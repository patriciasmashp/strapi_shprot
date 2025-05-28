import { Data } from "@strapi/strapi";
import { AuctionSettings, IAuction, MessageIds } from "../Ifaces/IAuction";
import { AbstractAuction } from "./AbstractAuction";
import { Bot, InlineKeyboard } from "grammy";


export class sketchAuction extends AbstractAuction implements IAuction {
    private bot: Bot;
    private text: string;
    private textEnoughBalance: string;
    private keyboard: InlineKeyboard;
    private keyboardEnoughBalance: InlineKeyboard;

    constructor(auctuionData: Data.ContentType<'api::auction.auction'>, settings: AuctionSettings) {
        super(auctuionData, settings)
        const price = this.settings.responce_price
        this.text = this.textBuilder.buildText(price)
        this.textEnoughBalance = this.textBuilder.buildEnoughBalanceText()
        this.keyboard = new InlineKeyboard().text("Участвовать в аукционе", `auction_response_price_y_${this.auctuionData.documentId}`)
            
        this.keyboardEnoughBalance = new InlineKeyboard().text("Как пополнить баланас",
            `auction_balance_help_${this.auctuionData.documentId}`)
        this.bot = new Bot(process.env.BOT_TOKEN)
    }
    public async alertMasters(): Promise<MessageIds> {
        const masters = await this.filterMasters()
        const rootDir = process.cwd();

        let files = {}

        if (this.auctuionData.file) {
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
            catch (error) {
                console.log(error);
                
            }
        }

        return messages
    }

}