const { Bot } = require('grammy')
const { InputFile } = require('grammy')
const { InputMediaBuilder } = require('grammy')

const telegramApiService = ({ strapi }) => ({
  async sendMessage(bot, message, chatId, files = {}, keyboard = null) {


    if (Object.keys(files).length > 0) {
      if (Object.keys(files).length == 1) {
        const file = typeof files[0] === 'string' ? files[0] : new InputFile(files[0])
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
          // if (file.mimetype.startsWith('image')) {
            const media = typeof file === 'string' ? InputMediaBuilder.photo(file) : InputMediaBuilder.photo(new InputFile(file))
            medias.push(media)
          // }
          // else if (file.mimetype.startsWith('video')) {
          //   const media = typeof file === 'string' ? InputMediaBuilder.video(file) : InputMediaBuilder.video(new InputFile(file))
          //   medias.push(media)
          // }
          // else {
          //   const media = typeof file === 'string' ? InputMediaBuilder.document(file) : InputMediaBuilder.document(new InputFile(file))
          //   medias.push(media)
          // }
        });

        medias[0].caption = message
        medias[0].parse_mode = "HTML"
        // medias[0].reply_markup = keyboard


        const success = await bot.api.sendMediaGroup(chatId, medias)

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
