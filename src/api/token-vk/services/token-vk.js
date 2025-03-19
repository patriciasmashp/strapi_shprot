'use strict';

/**
 * token-vk service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::token-vk.token-vk');
