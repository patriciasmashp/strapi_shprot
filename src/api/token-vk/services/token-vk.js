'use strict';

/**
 * token-vk service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::token-vk.token-vk', ({ strapi }) => ({
    fetchImage(url) {
        return fetch(url).then(res => res.arrayBuffer());
    }
}));
