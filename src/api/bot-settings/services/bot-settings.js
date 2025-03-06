'use strict';

/**
 * bot-settings service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::bot-settings.bot-settings');
