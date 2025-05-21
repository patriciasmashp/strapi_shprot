import { Bot } from "grammy";
import { env } from "process"
export default {
    beforeCreate(event) {
        const { data, where, select, populate } = event.params;
    },

    async afterCreate(event) {
        const { result, params, model } = event;
        const bot = new Bot(env.CLIENT_BOT_TOKEN);
        const botData = await bot.api.getMe();
        
        const masterLink = "https://t.me/" + botData.username + "?start=" + result.documentId
       
        const masterData = await strapi.documents('api::master.master').update({
            documentId: result.documentId,
            data: {
                master_url: masterLink
            }
        });
        console.log(masterData);

    },
};