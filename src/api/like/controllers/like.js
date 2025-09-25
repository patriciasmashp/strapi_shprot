'use strict';

/**
 * like controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::like.like', {
    async create(ctx) {
        const responseData = ctx.request.body.data;
        const likeData = await strapi.documents('api::like.like').findFirst({
            filters: {
                $and: [
                    { master: { documentId: { $eq: responseData.master } } },
                    { client: { documentId: { $eq: responseData.client } } },
                ]
            },
            populate: ['master', 'client']
        });
        if (likeData) {
            return ctx.response.badRequest('You have already liked this master');
        }
        const response = await super.create(ctx);
        return response

    }
});
