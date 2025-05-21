'use strict';

/**
 * bot-text service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::bot-text.bot-text', ({strapi}) => ({
    async getText(key) {
        const data = await strapi.documents('api::bot-text.bot-text').findFirst();
        const text = data.texts;
        
        if(text[key] === undefined) throw new Error(`Text not found for key ${key}`)
        return text[key];
    }
}));
