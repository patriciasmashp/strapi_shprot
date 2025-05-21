import { Data } from "@strapi/strapi";
import { AuctionSettings, IAuction, MessageIds } from "../Ifaces/IAuction";
import { AbstractAuction } from "./AbstractAuction";
import { Bot, InlineKeyboard } from "grammy";


export class sketchAuction extends AbstractAuction implements IAuction {

    constructor(auctuionData: Data.ContentType<'api::auction.auction'>, settings: AuctionSettings) {
        super(auctuionData, settings)
    }
    public async alertMasters(): Promise<MessageIds> {

        const price = this.settings.responce_price
        const text = "Дорогой мастер, мы нашли клиента, ты и другие мастера можете оценить его идею." +
            "\nТату-аукцион закрытый, поэтому не ставь очень низкую цену, оценивай реальную стоимость." +
            "А пользователь выберет наиболее подходящего ему мастера." +
            `\n\n Описание аукциона: ${this.auctuionData.idea}` +
            `\n\nСтоимость участия: ${price}`

         const textEnoughBalance = "Дорогой мастер, мы нашли клиента," +
            " но к сожалению твой текущий баланс не позволит принять участие в тату-аукционе." +
            "\nНо ты можешь ознакомиться с тем, как это исправить ниже нажав на кнопку."

        const keyboard = new InlineKeyboard().text("да", `auction_response_price_y_${this.auctuionData.documentId}`)
            .text("нет", `auction_price_n_${this.auctuionData.documentId}`).row()
        const keyboardEnoughBalance = new InlineKeyboard().text("Как пополнить баланас",
            `auction_balance_help_${this.auctuionData.documentId}`)

        const masters = await this.filterMasters()
        const rootDir = process.cwd();
        
        let files = {}
        
        if(this.auctuionData.file){
            files = {0: `${rootDir}/public${this.auctuionData.file.url}`}
        }

        const bot = new Bot(process.env.BOT_TOKEN)

        
        const messages = {}

        for (let master of masters) {
            let enoughBalance = master.balance - this.settings.responce_price >= 0

            try {
                if (enoughBalance) {
                    const message = await strapi.service('plugin::telegram.telegramApiService').sendMessage(bot, text, master.master_id, files, keyboard)
                    messages[message.chat.id] = message.message_id
                }
                else {
                    const message = await strapi.service('plugin::telegram.telegramApiService').sendMessage(bot, textEnoughBalance, master.master_id, files, keyboardEnoughBalance)
                    messages[message.chat.id] = message.message_id
                }

            }
            catch (error) { 
  
            }
        }

        return messages
    }

}