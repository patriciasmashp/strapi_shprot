'use strict';
const { Bot } = require('grammy');
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::master.master', ({ strapi }) => ({
  allert: async (ctx) => {

    try {

      let errors = []
      const message = ctx.request.body.html
      const files = ctx.request.files
      const bot = new Bot(process.env.BOT_TOKEN)
 
      
      const masters = await strapi.documents("api::master.master").findMany();

      masters.forEach(async (master) => {

        strapi.service('plugin::telegram.telegramApiService').sendMessage(bot, message, master.master_id, files).catch(err => {
          errors.push(err.description);
        })

      });
      const errorsPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          if (errors.length > 0) {
            resolve(`Во время отпраки сообщения Telegram вернул ошибку(и) ${errors}`);
            ctx.response.status = 203;
          }
          else
          
          
            resolve("ok");
        }, 1000);
      })
      ctx.body = await errorsPromise
    } catch (err) {
      console.log("err", err);

      ctx.badRequest("error", { err })
    }

  },
  sendMessage: async (ctx) => {
    try {
      const message = ctx.request.body.message
      const chatId = ctx.request.body.chatId
      const bot = new Bot(process.env.BOT_TOKEN)
      await await strapi.service('plugin::telegram.telegramApiService').sendMessage(bot, message, chatId)
    } catch (err) {
      console.log("err", err);

      ctx.badRequest("error", { err })
    }
  }
}));
