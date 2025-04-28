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
}));
