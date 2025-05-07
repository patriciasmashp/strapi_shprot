'use strict';

/**
 * like router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::like.like', {
    config: {
        create: {},
        findOne: {},
        update: {},
        delete: {},
    }
});
