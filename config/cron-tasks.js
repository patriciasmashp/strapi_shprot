const { Bot, InlineKeyboard } = require("grammy");

module.exports = {
    /**
     * Simple example.
     * Every monday at 1am.
     */

    rankMasters: {
        task: async ({ strapi }) => {
            const masters = await strapi.documents("api::master.master").findMany()
            const { like_rank_weight,
                post_rank_weight,
                index_rank_weight,
                share_rank_weight,
                request_rank_weight,
                about_master_rank_weight,
                auction_rank_weight
            } = await strapi.service("api::bot-settings.bot-settings").getRankWeights()
            for (let index = 0; index < masters.length; index++) {
                const master = masters[index];
                const rank = master.aboutRequestCount * about_master_rank_weight
                    + master.requestCount * request_rank_weight
                    + master.shareCount * share_rank_weight
                    + master.likes * like_rank_weight
                    + master.postCount * post_rank_weight
                    + master.auctionCount * auction_rank_weight
                    + master.index * index_rank_weight * 2

                await strapi.documents("api::master.master").update({
                    documentId: master.documentId,
                    data: {
                        rank: rank
                    }
                })


            }



        },
        options: {
            // rule: "0 0 0 * * 3",
            start: new Date(Date.now()),
            // end 20 seconds from now
            // end: new Date(Date.now()),
        },
    },
    closeAuctions: {
        task: async ({ strapi }) => {
            const auctions = await strapi.documents('api::auction.auction').findMany({
                filters: {
                    finished: { $eq: false }
                },
                populate: ['client']
            })
            console.log('auction');
            const auctionSettings = await strapi.service('api::bot-settings.bot-settings').getAuctionSettings()

            for (let auction of auctions) {
                const created = new Date(auction.createdAt)
                const finishTime = created.getTime() + auctionSettings.life_time
                
                if (new Date() > finishTime) {
                    console.log(auction.documentId, 'closed');
                    await strapi.documents('api::auction.auction').update({ documentId: auction.documentId, data: { finished: true } })
                    const bot = new Bot(process.env.CLIENT_BOT_TOKEN)
                    
                    const text = await strapi.service('api::bot-text.bot-text').getText('auction_finished')
                    const keyboard = new InlineKeyboard().webApp("Посмотреть", `${process.env.WEB_APP_URL}/auction`)
                    await strapi.service('plugin::telegram.telegramApiService').sendMessage(bot, text, auction.client.client_id, {}, keyboard)
                }



            }

        },
        options: {
            // rule: "* 1 * * * *",
            start: new Date(Date.now()),
            // end 20 seconds from now
            // end: new Date(Date.now()),
        },
    }
};