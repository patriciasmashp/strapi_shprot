const { Bot, InlineKeyboard } = require("grammy");
const fs = require("fs");
const { env } = require("process");
module.exports = {
    beforeCreate(event) {
        const { data, where, select, populate } = event.params;
        populate.push('files')

        console.log(data);

        //   // let's do a 20% discount everytime
        //   event.params.data.price = event.params.data.price * 0.8;
    },

    async afterCreate(event) {
        const { result, params, model } = event;
        const admins = await strapi.service('api::admin.admin').getAdmins()

        const bot = new Bot(process.env.BOT_TOKEN)

        setTimeout(async () => {

            const reportData = await strapi.documents('api::report.report').findOne({ documentId: result.documentId, populate: ['files', 'master', 'client'] });

            const text = `Новая жалоба: \n${result.text}`
            if (reportData.files) {
                const filePath = 'public' + reportData.files[0].url
                admins.forEach(id => {
                    const sendMessage = strapi.service('plugin::telegram.telegramApiService').sendMessage(bot, text, id, [filePath])
                });

            }
            else {
                admins.forEach(id => {
                    const sendMessage = strapi.service('plugin::telegram.telegramApiService').sendMessage(bot, text, id)
                });
            }

        }, 5000)

        return


        // await sendMessage


    },
};