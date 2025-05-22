// import { Data } from "@strapi/strapi";
import { AuctionSettings, IAuction, MessageIds } from "../Ifaces/IAuction";
import { AbstractAuction } from "./AbstractAuction";
import { Bot, InlineKeyboard } from "grammy";

export class PriceAuction extends AbstractAuction implements IAuction {
    private bot: Bot;
    private text: string;
    private textEnoughBalance: string;
    private keyboard: InlineKeyboard;
    private keyboardEnoughBalance: InlineKeyboard;
    constructor(auctuionData: any, settings: AuctionSettings) {
        super(auctuionData, settings)
        this.bot = new Bot(process.env.BOT_TOKEN)
        const price = this.settings.responce_price
        this.text = "Дорогой мастер, мы нашли клиента c конкретным бюджетом," +
            "\nты и другие мастера можете взяться за этот проект либо отказаться от него." +
            "\nПользователь ознакомится портфолио c откликнувшихся мастеров и выберет наиболее подходящего ему мастера." +
            `\n\nОписание аукциона: ${this.auctuionData.idea}` +
            `\nБюджет: ${this.auctuionData.price} ₽` +
            `\n\nСтоимость участия: ${price}`

        this.textEnoughBalance = "Дорогой мастер, мы нашли клиента," +
            " но к сожалению твой текущий баланс не позволит принять участие в тату-аукционе." +
            "\nНо ты можешь ознакомиться с тем, как это исправить ниже нажав на кнопку."

        this.keyboard = new InlineKeyboard().text("да", `auction_response_price_y_${this.auctuionData.documentId}`)
            .text("нет", `auction_price_n_${this.auctuionData.documentId}`).row()
        this.keyboardEnoughBalance = new InlineKeyboard().text("Как пополнить баланас",
            `auction_balance_help_${this.auctuionData.documentId}`)
    }
    public async alertMasters(): Promise<MessageIds> {
        const masters = await this.filterMasters()
        const rootDir = process.cwd();
        let files = {}

        if (this.auctuionData.file.length != 0) {
            for (let index = 0; index < this.auctuionData.file.length; index++) {
                const file = this.auctuionData.file[index];
                files[index] = `${rootDir}/public${file.url}`
            }
        }

        const messages = {}

        for (let master of masters) {
            let enoughBalance = master.balance - this.settings.responce_price >= 0
            try {
                if (enoughBalance) {
                    if (this.auctuionData.file) {
                        await strapi.service('plugin::telegram.telegramApiService')
                            .sendMessage(this.bot, "", master.master_id, files)
                    }
                    const message = await strapi.service('plugin::telegram.telegramApiService')
                        .sendMessage(this.bot, this.text, master.master_id, {}, this.keyboard)

                    messages[master.master_id] = message.message_id
                }
                else {
                    if (this.auctuionData.file) {
                        await strapi.service('plugin::telegram.telegramApiService')
                            .sendMessage(this.bot, "", master.master_id, files)
                    }
                    const message = await strapi.service('plugin::telegram.telegramApiService')
                        .sendMessage(
                            this.bot,
                            this.textEnoughBalance,
                            master.master_id, files,
                            this.keyboardEnoughBalance
                        )
                    messages[master.master_id] = message.message_id
                }
            }
            catch (error) {}
        }

        return messages
    }

}