import { Data } from "@strapi/strapi";
import { AuctionTypesEnum } from "../Ifaces/IAuction";

export default class AllertMasterTextBuilder {
    private auctionData: Data.ContentType<'api::auction.auction'>;

    private enoughBalanceText: string;

    constructor(auctionData: Data.ContentType<'api::auction.auction'>) {
        this.auctionData = auctionData;
    }
    public getBaseText(): string {
        if (this.auctionData.type === AuctionTypesEnum.priceAuction) {
            return "Дорогой мастер, мы нашли клиента c конкретным бюджетом," +
                "\nты и другие мастера можете взяться за этот проект либо отказаться от него." +
                "\nПользователь ознакомится портфолио c откликнувшихся мастеров и выберет наиболее подходящего ему мастера." +
                `\nБюджет: ${this.auctionData.price} ₽`
        } else {
            return "Дорогой мастер, мы нашли клиента, ты и другие мастера можете оценить его идею." +
                "\nТату-аукцион закрытый, поэтому не ставь очень низкую цену, оценивай реальную стоимость." +
                "А пользователь выберет наиболее подходящего ему мастера."

        }
    }

    private getAuctionCost(price: number): string {
        return `\nСтоимость участия: ${price}`
    }

    private getIdea(): string {
        return `\nОписание аукциона: ${this.auctionData.idea}`
    }

    private getBodyPart(): string {
        return `\nЧасть тела: ${this.auctionData.bodyPart}`
    }
    private getSize(): string {
        return `\nРазмер: ${this.auctionData.size}`
    }
    private getCityName(): string {
        return `\nГород: ${this.auctionData.city.name}`
    }
    private getClientContats(): string {
        return `\n\nКонтакты клиента: @${this.auctionData.client.username}`
    }

    private getMasterResponcePrice(masterPrice: number){
        return `\nВы оценили в ${masterPrice} ₽`
    }
    public buildText(auctionCost: number): string {
        let text = ""
        text += this.getBaseText();
        text += "\n"
        text += this.getCityName()
        text += this.getSize()
        text += this.getBodyPart()
        text += this.getIdea()

        text += "\n"
        text += this.getAuctionCost(auctionCost)
        return text;
    }

    private async buildClientChoiceTextPriceAuction(masterPrice: number): Promise<string> {
        let text: string = await strapi.service('api::bot-text.bot-text').getText('auction_sent_contact_master')
        text += "\n"
        text += this.getCityName()
        text += this.getSize()
        text += this.getBodyPart()
        text += this.getIdea()
        text += "\n"
        text += this.getMasterResponcePrice(masterPrice)
        text += this.getClientContats()
        return text;

    }

    private async buildClientChoiceTextSketchAuction(masterPrice: number): Promise<string> {
        let text: string = await strapi.service('api::bot-text.bot-text').getText('auction_sent_contact_master')
        text += "\n"
        text += this.getCityName()
        text += this.getSize()
        text += this.getBodyPart()
        text += this.getIdea()
        text += "\n"
        text += this.getMasterResponcePrice(masterPrice)
        text += this.getClientContats()
        return text;
    }

    public async getClientChoiceText(masterPrice: number): Promise<string> {
        if (this.auctionData.type === AuctionTypesEnum.priceAuction) {
            return this.buildClientChoiceTextPriceAuction(masterPrice)
        } else {
            return this.buildClientChoiceTextSketchAuction(masterPrice)
        }
    }
    public buildEnoughBalanceText(): string {
        return "Дорогой мастер, мы нашли клиента," +
            " но к сожалению твой текущий баланс не позволит принять участие в тату-аукционе." +
            "\nНо ты можешь ознакомиться с тем, как это исправить ниже нажав на кнопку.";
    }
    // this.text += `\nФайлы: ${this.auctionData.files.map(file => file.name)}`
    //                 `\n\nСтоимость участия: ${price}`
}