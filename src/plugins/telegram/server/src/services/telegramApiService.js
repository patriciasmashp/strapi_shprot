const { Bot } = require('grammy')
const { InputFile } = require('grammy')
const { InputMediaBuilder } = require('grammy')

const telegramApiService = ({ strapi }) => ({
  async sendMessage(bot, message, chatId, files = {}, keyboard = null) {


    if (Object.keys(files).length > 0) {
      if (Object.keys(files).length == 1) {
        const file = new InputFile(files[0])
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
          if (file.mimetype.startsWith('image')) {
            const media = InputMediaBuilder.photo(new InputFile(file))
            medias.push(media)
          }
          else if (file.mimetype.startsWith('video')) {
            const media = InputMediaBuilder.video(new InputFile(file))
            medias.push(media)
          }
          else {
            const media = InputMediaBuilder.document(new InputFile(file))
            medias.push(media)
          }
        });

        medias[0].caption = message
        medias[0].parse_mode = "HTML"


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
  }
}
);

export default telegramApiService;
