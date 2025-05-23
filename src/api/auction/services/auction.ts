'use strict';
import { Data } from '@strapi/strapi';
/**
 * auction service
 */

import { factories } from '@strapi/strapi';
import { Bot } from 'grammy';
import { AuctionTypesEnum } from '../Ifaces/IAuction';
import AllertMasterTextBuilder from '../classes/TextBuilder';


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
        const response = auction.masterResponses.find(r => r.master.id === master.id)
        const bot = new Bot(process.env.BOT_TOKEN)
        const textBuilder = new AllertMasterTextBuilder(auction)

        const text = await textBuilder.getClientChoiceText(response.price)
        let files = {}
        if (auction.file) {
            for (let index = 0; index < auction.file.length; index++) {
                const file = auction.file[index];
                files[index] = `${process.cwd()}/public${file.url}`
            }
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
