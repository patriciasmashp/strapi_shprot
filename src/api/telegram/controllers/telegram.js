'use strict';
// import { Bot } from "grammy";
const { Bot } = require('grammy')
const { InputFile } = require('grammy')
const { InputMediaBuilder } = require('grammy')
// import { InputFile } from "grammy/types";
const { createCoreController } = require('@strapi/strapi').factories;
/**
 * A set of functions called "actions" for `telegram`
 */


async function sendMessage(bot, message, chatId, files = null) {
  
  if (Object.keys(files).length > 0) {
    if (Object.keys(files).length == 1) {
      const file = new InputFile(files[0].filepath)
      await bot.api.sendPhoto(chatId, file, {
        caption: message,
        parse_mode: 'HTML'
      })
    }
    else {
      let medias = []

      Object.values(files).forEach(file => {
        if (file.mimetype.startsWith('image')) {
          const media = InputMediaBuilder.photo(new InputFile(file.filepath))
          medias.push(media)
        }
        else if (file.mimetype.startsWith('video')) {
          const media = InputMediaBuilder.video(new InputFile(file.filepath))
          medias.push(media)
        }
        else {
          const media = InputMediaBuilder.document(new InputFile(file.filepath))
          medias.push(media)
        }
      });

      medias[0].caption = message
      medias[0].parse_mode = "HTML"
      
      
      await bot.api.sendMediaGroup(chatId, medias)
      // console.log(success);

    }
  }
  else {
    
    await bot.api.sendMessage(chatId, message, {
      parse_mode: 'HTML'
    })
  }
}







module.exports = createCoreController('api::master.master', ({ strapi }) => ({
  exampleAction: async (ctx) => {

    try {

      let errors = []
      const message = ctx.request.body.html
      const files = ctx.request.files
      const bot = new Bot(process.env.BOT_TOKEN)
      const masters = await strapi.documents("api::master.master").findMany();

      
      masters.forEach(async (master) => {

        sendMessage(bot, message, master.master_id, files).catch(err => {
          errors.push(err.description);
        })



      });
      const errorsPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          if(errors.length > 0){
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

  }
}));
