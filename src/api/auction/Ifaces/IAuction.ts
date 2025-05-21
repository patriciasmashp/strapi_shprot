import type { Data } from '@strapi/strapi';

type tgId = number
type messageId = number

export type AuctionSettings = {
    life_time: number;
    responce_price: number;
}

export enum AuctionTypesEnum {
    sketchAuction = "sketchAuction",
    priceAuction = "priceAuction",
}
export enum AuctionSizesEnum {
    small = "Маленькая",
    medium = "Средняя",
    large = "Большая",
    extraLarge = "Большой проект",
}
export type AuctionData = {
    type: AuctionTypesEnum;
    city: string;
    bodyPart: string;
    size: AuctionSizesEnum;
    idea: string;
    price?: number;
    file?: File;
    client: string,
    masterResponses: Array<any>;

}
// export type AuctionData = {
//     type: AuctionTypesEnum;
//     city: string;
//     bodyPart: string;
//     size: AuctionSizesEnum;
//     idea: string;
//     price?: number;
//     file?: File;
    
// }

export type MessageIds = {
    [k: tgId] : messageId
}

export interface IAuction {
    auctuionData: Data.ContentType<'api::auction.auction'>;
    startAuction(): Promise<void>;

}