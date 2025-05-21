'use strict';
import { Data } from '@strapi/strapi';
/**
 * auction service
 */

import { factories } from '@strapi/strapi';
import { Bot } from 'grammy';
import { AuctionTypesEnum } from '../Ifaces/IAuction';


export default factories.createCoreService('api::auction.auction', ({ strapi }) => ({
    async addMasterResponse(masterResponse: Data.Component<'api.otkliki-masterov'>,
        auction: Data.ContentType<'api::auction.auction'>) {
        auction.masterResponses.push(masterResponse)


        const updated = await strapi.documents('api::auction.auction').update({
            documentId: auction.documentId,
            data: { masterResponses: auction.masterResponses },
            populate: ['masterResponses', 'city', 'client']
        })

        return updated

    },
    async notifyMasterSelectedByClient(auction: Data.ContentType<'api::auction.auction'>,
        master: Data.ContentType<'api::master.master'>) {


        if (!master || !auction) {
            return false
        }

        const bot = new Bot(process.env.BOT_TOKEN)
        let text = await strapi.service('api::bot-text.bot-text').getText('auction_sent_contact_master')
        text += `\n\nКонтакты клиента: @${auction.client.username}\nАукцион: ${auction.bodyPart}`
        console.log(auction.type);
        
        if (auction.type === AuctionTypesEnum.priceAuction && auction.price) {
         text += `\nЦена: ${auction.price} ₽`   
        }
        let files = {}
        if (auction.file) {
            files = { 0: `${process.cwd()}/public${auction.file.url}` }
        }
        const message = await strapi.service('plugin::telegram.telegramApiService').sendMessage(bot, text, master.master_id, files)

        return true
    },
    async updateMasterAuctionStatistic(master: Data.ContentType<'api::master.master'>) {
        await strapi.documents('api::master.master').update({
            documentId: master.documentId,
            data: {
                auctionCount: master.auctionCount + 1
            }
        })
    }
}));
