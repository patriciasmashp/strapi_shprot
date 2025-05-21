'use strict';

/**
 * master controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::master.master', ({ strapi }) => ({

    async updateStatistic(ctx) {
        const { body, query } = ctx.request;
        await this.validateQuery(ctx);
        const sanitizedQueryParams = await this.sanitizeInput(ctx, body);
        const master = await strapi.service('api::master.master').findOne(sanitizedQueryParams.params.id);
        const { aboutRequestCount, requestCount, shareCount, postCount } = body.data;
        if (aboutRequestCount) {
            if (master.aboutRequestCount) master.aboutRequestCount++
            else master.aboutRequestCount = 1
        };

        if (requestCount) {
            if (!ctx.state.auth.credentials) {
                ctx.response.badRequest('You are not authorized to perform this action');
                return;
            }
            if (master.requestCount) master.requestCount++
            else master.requestCount = 1
        };

        if (shareCount) {
            if (!ctx.state.auth.credentials) {
                ctx.response.badRequest('You are not authorized to perform this action');
                return;
            }
            if (master.shareCount) master.shareCount++
            else master.shareCount = 1
        };

        if (postCount) {
            if (!ctx.state.auth.credentials) {
                ctx.response.badRequest('You are not authorized to perform this action');
                return;
            }
            if (master.postCount) master.postCount++
            else master.postCount = 1
        };



        const updated = await strapi.service('api::master.master').update(sanitizedQueryParams.params.id,
            {
                data: {
                    aboutRequestCount: master.aboutRequestCount,
                    requestCount: master.requestCount,
                    shareCount: master.shareCount,
                    postCount: master.postCount,
                }
            });

        ctx.body = { data: updated };

    },
}));
