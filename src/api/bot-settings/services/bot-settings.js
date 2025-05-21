'use strict';

/**
 * bot-settings service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::bot-settings.bot-settings', ({ strapi }) => ({
    // Method 1: Creating an entirely new custom service
    async getRequestCurency(...args) {
        const response = await strapi.documents('api::bot-settings.bot-settings').findFirst({})

        return response.settings.request_cost
    },
    async getRankWeights(...args) {
        const response = await strapi.documents('api::bot-settings.bot-settings').findFirst({})
        
        return response.settings.rank_weights
    },

    async getAuctionSettings(...args) {
        const response = await strapi.documents('api::bot-settings.bot-settings').findFirst({})
        
        return response.settings.auction_settings
    },

    async getBotInfo(token){
        const bot = new Bot(token)
        return bot.getMe()
    
    }

}));
