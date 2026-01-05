'use strict';

const { broadcastQueue } = require('../../auction/classes/Queue');

/**
 * token-vk controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::token-vk.token-vk', ({ strapi }) => ({
    async handleVkEvent(ctx) {
        if (ctx.request.body.type === 'confirmation') {
            ctx.response.body = "0a2a5b05";
            return;
        }
        const attachments = ctx.request.body.object.attachments || [];
        attachments.forEach((attachment, index) => {
            if (attachment.photo) {
                attachments[index] = attachment.photo.orig_photo.url;
            }
        });

        const clients = await strapi.documents('api::client.client').findMany({
            fields: ['client_id'],
        });
        const clienIds = clients.map(client => client.client_id);
        let text = ctx.request.body?.object?.text;

        text = text.replace(/\[#(?:[^|]+)\|([^|]+)\|([^\]\s]+)\]/g, '<a href="$3">$2</a>');

        await broadcastQueue.add('send', {
                    bot: strapi.plugin('telegram').service('botService').getClientBotInstance(),
                    users: clienIds,
                    text: text,
                    files: attachments,
                })

        
        ctx.response.body = "ok"
    }
}));
