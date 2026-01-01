'use strict';

/**
 * token-vk controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::token-vk.token-vk', ({ strapi }) => ({
    async handleVkEvent(ctx) {
        if (ctx.request.body.type === 'confirmation') {
            ctx.response.body = "020187db";
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
        console.log(ctx.request.body.object);
        const regex = /https:\/\/t\.me\/TattooVibebot\?start=[^\]\s]+/g;
        let text = ctx.request.body?.object?.text;
        // Замена Мастер: 123 [#alias|short|url] на Мастер: [123](url)
        text = text.replace(/Мастер: (\d+) \[#[^|]+\|[^|]+\|([^\]]+)\]/g, 'Мастер: <a href="$2"> $1 </a>');
        const errors = await strapi.plugin('telegram').service('telegramApiService').broadcast(
            strapi.plugin('telegram').service('botService').getClientBotInstance(),
            text,
            clienIds,
            attachments
        );
              
        ctx.response.body = "ok"
    }
}));
