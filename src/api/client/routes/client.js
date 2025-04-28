'use strict';

/**
 * client router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::client.client', {
    config: {
        
        // update: {
        //     middlewares: ["global::favorite-middleware"],
        // },
        // find: {
        //     middlewares: ["api::article.article-populate"],
        // },
        // findOne: {
        //     middlewares: ["api::article.article-populate"],
        // },
    },
});
