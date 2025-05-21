import { Data } from "@strapi/strapi";
import { AuctionSettings, MessageIds } from "../Ifaces/IAuction";
import { auctionQueue } from "./Queue";



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
        await this.setJob(messages)
    }
}