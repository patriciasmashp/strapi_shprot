'use strict';

/**
 * bot-text service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::bot-text.bot-text');
