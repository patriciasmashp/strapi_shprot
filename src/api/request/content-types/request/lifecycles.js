const { Bot, InlineKeyboard } = require("grammy");

module.exports = {
    beforeCreate(event) {
        const { data, where, select, populate } = event.params;
        
        //   // let's do a 20% discount everytime
        //   event.params.data.price = event.params.data.price * 0.8;
    },

    async afterCreate(event) {
        const { result, params, model } = event;
        const bot = new Bot(process.env.BOT_TOKEN)
        console.log(`request_${result.documentId}`);
        const request_cost = await strapi.service('api::bot-settings.bot-settings').getRequestCurency();

        
        const text = `Дорогой мастер, твою анкету и профессионализм оценили по достоинству, пользователь оставил свои контактные данные для связи, поспеши их получить!\n\nСтоимость получения контакта: ${request_cost}`
        const keyboard = new InlineKeyboard().text("Получить контакты", `request_${result.documentId}`)
        const sendMessage = strapi.service('plugin::telegram.telegramApiService').sendMessage(bot, text, result.master.master_id, {}, keyboard)

        
        // await sendMessage


    },
};