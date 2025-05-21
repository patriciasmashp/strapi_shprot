import { ApiAuctionAuction } from "@stypes/contentTypes";
import { AuctionTypesEnum } from "../enums";
import { sketchAuction as SketchAuction } from "./SketchAuiction";
import { Data } from "@strapi/strapi";
import { PriceAuction } from "./PriceAuction";
import { AuctionSettings, IAuction } from "../Ifaces/IAuction";


export class AuctionFactory {
    auction: Data.ContentType<'api::auction.auction'>;

    constructor(auction: Data.ContentType<'api::auction.auction'>) {
        this.auction = auction;
    }

    private async getAuctionSettings(): Promise<AuctionSettings> {
        const settings = await strapi.service('api::bot-settings.bot-settings').getAuctionSettings()
        if (!settings) throw new Error('Auction settings not found')
        return settings
    }

    public async createAuction(type: AuctionTypesEnum): Promise<IAuction> {
        const settings = await this.getAuctionSettings()
        if (type === AuctionTypesEnum.sketchAuction) {
            return new SketchAuction(this.auction, settings)
        }
        else if (type === AuctionTypesEnum.priceAuction) {
            return new PriceAuction(this.auction, settings)
        }
        else {
            throw new Error('Auction type not found')
        }
    }
}
