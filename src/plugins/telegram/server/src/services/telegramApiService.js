const { Bot } = require('grammy')
const { InputFile } = require('grammy')
const { InputMediaBuilder } = require('grammy')

const telegramApiService = ({ strapi }) => ({
  async sendMessage(bot, message, chatId, files = {}, keyboard = null) {


    if (Object.keys(files).length > 0) {
      if (Object.keys(files).length == 1) {
        console.log(files[0]);

        const file = new InputFile(files[0])
        await bot.api.sendPhoto(chatId, file, {
          caption: message,
          parse_mode: 'HTML'
        })
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


        await bot.api.sendMediaGroup(chatId, medias)
        // console.log(success);

      }
    }
    else {

      await bot.api.sendMessage(chatId, message, {
        parse_mode: 'HTML',
        reply_markup: keyboard
      })
    }
  }

}
);

export default telegramApiService;
