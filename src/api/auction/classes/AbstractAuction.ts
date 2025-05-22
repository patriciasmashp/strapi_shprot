import { Data } from "@strapi/strapi";
import { AuctionSettings, MessageIds } from "../Ifaces/IAuction";
import { auctionQueue } from "./Queue";
import { Bot, InlineKeyboard } from "grammy";



export abstract class AbstractAuction {

    auctuionData: Data.ContentType<'api::auction.auction'>;
    settings: AuctionSettings

    constructor(auctuionData: Data.ContentType<'api::auction.auction'>, settings: AuctionSettings) {
        this.auctuionData = auctuionData;
        this.settings = settings;
    }
    abstract alertMasters(): Promise<MessageIds>;


    async filterMasters(): Promise<Data.ContentType<'api::master.master'>[]> {

        const filter = {
            city: {
                name: {
                    $eq: this.auctuionData.city.name
                }
            }
        }
        const masters = await strapi.documents("api::master.master").findMany({ filters: filter });
        return masters
    }
    private async setJob(messages: MessageIds) {
        await auctionQueue.add('newJob', {
            messages: messages,
            settings: this.settings,
            auctuion: this.auctuionData,
        }, { delay: this.settings.life_time })
    }

    public async startAuction() {
        const messages = await this.alertMasters()
        console.log(messages);
        
        await this.setJob(messages)
    }

    public async setClientChoice(master: Data.ContentType<'api::master.master'>) {
        const masterResponses = this.auctuionData.masterResponses
        masterResponses.filter(response => response.master.id === master.id)[0].clientChoice = true
        await strapi.documents('api::auction.auction')
            .update({ documentId: this.auctuionData.documentId, data: { masterResponses: masterResponses } })
    }
    private async notifyClientEndAuction() {
        const bot = new Bot(process.env.CLIENT_BOT_TOKEN)
        this.auctuionData.client.client_id
        const text = await strapi.service('api::bot-text.bot-text').getText('auction_finished')
        const keyboard = new InlineKeyboard().webApp("Посмотреть", `${process.env.WEB_APP_URL}/auction`)
        await strapi.service('plugin::telegram.telegramApiService').sendMessage(bot, text, this.auctuionData.client.client_id, {}, keyboard)
    }
    public async endAuction() {
        const created = new Date(this.auctuionData.createdAt)
        const finishTime = created.getTime() + this.settings.life_time

        if (new Date().getTime() >= finishTime) {
            await strapi.documents('api::auction.auction')
                .update({ documentId: this.auctuionData.documentId, data: { finished: true } })
            await this.notifyClientEndAuction()
        }
    }
}