'use strict';

/**
 * token-vk controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::token-vk.token-vk', ({ strapi }) => ({
    async handleVkEvent(ctx) {
        if (ctx.request.body.type === 'confirmation') {
            ctx.response.body = "595155db";
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
        // Гибкая замена: Мастер: 123 [#alias|short|url] -> Мастер: <a href="url">123</a>
        // Учитываем любые пробельные символы (включая NBSP) и возможные варианты короткой части
        text = text.replace(/Мастер:\s*(\d+)\s*\[#(?:[^|]+)\|(?:[^|]+)\|([^\]\s]+)\]/gu, 'Мастер: <a href="$2">$1</a>');
        const errors = await strapi.plugin('telegram').service('telegramApiService').broadcast(
            strapi.plugin('telegram').service('botService').getClientBotInstance(),
            text,
            ["6373403021"],
            attachments
        );
        console.log(errors);
        
        ctx.response.body = "ok"
    }
}));
