const { Bot } = require('grammy')
const { InputFile } = require('grammy')
const { InputMediaBuilder } = require('grammy')
const fs = require('fs')

const isUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

const telegramApiService = ({ strapi }) => ({
  async sendMessage(bot, message, chatId, files = {}, keyboard = null) {


    if (Object.keys(files).length > 0) {
      if (Object.keys(files).length == 1) {
        const file = typeof files[0] === 'string' ? (isUrl(files[0]) ? files[0] : new InputFile(fs.readFileSync(files[0]))) : new InputFile(files[0])
        const success = await bot.api.sendPhoto(chatId, file, {
          caption: message,
          reply_markup: keyboard,
          parse_mode: 'HTML'
        })
        return success
      }
      else {
        let medias = []

        Object.values(files).forEach(file => {

          const media = typeof file === 'string' ? (isUrl(file) ? InputMediaBuilder.photo(file) : InputMediaBuilder.photo(fs.readFileSync(file))) : InputMediaBuilder.photo(new InputFile(file))
          medias.push(media)
        });

        if (keyboard === null) {
          medias[0].caption = message
          medias[0].parse_mode = "HTML"
          medias[0].reply_markup = keyboard

        const success = await bot.api.sendMediaGroup(chatId, medias)
        }
        else {
          // If keyboard is provided, we can only attach it to the first media
          medias[0].parse_mode = "HTML"
          medias[0].reply_markup = keyboard
          const success = await bot.api.sendMediaGroup(chatId, medias)
          await bot.api.sendMessage(chatId, message, {
            parse_mode: 'HTML',
            reply_markup: keyboard
          })
        }

        return success

      }
    }
    else {

      const success = await bot.api.sendMessage(chatId, message, {
        parse_mode: 'HTML',
        reply_markup: keyboard
      })
      return success
    }
  },
  async broadcast(bot, message, chatsID, files = {}, keyboard = null) {
    const results = [];
    for (const chatId of chatsID) {
      try {
        const result = await this.sendMessage(bot, message, chatId, files, keyboard);
        results.push({ chatId, success: true, result });
      } catch (error) {
        results.push({ chatId, success: false, error });
      }
    }
    return results;
  }
}
);

export default telegramApiService;
