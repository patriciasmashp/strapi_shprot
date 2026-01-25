'use strict';

const { broadcastQueue } = require('../../auction/classes/Queue');
const { InlineKeyboard } = require('grammy')
/**
 * token-vk controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::token-vk.token-vk', ({ strapi }) => ({
    async handleVkEvent(ctx) {
        if (ctx.request.body.type === 'confirmation') {
            ctx.response.body = "a5f7f3f0";
            return;
        }
        if (ctx.request.body.type !== 'wall_post_new' || ctx.request.body.object.post_type !== 'post') {
            ctx.response.body = "ok"
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

        // Извлекаем ссылки из текста и создаем кнопки
        const link = text.match(/https:\/\/t\.me\/TattooVibebot\?start=[^\]]*/gm);
        const url = link ? new URL(link[0]) : null;
        const startParam = url ? url.searchParams.get('start') : null;

        const inlineKeyboard = new InlineKeyboard();
        if (startParam) {
            inlineKeyboard.webApp('Посмотреть мастера', `${process.env.WEB_APP_URL}/${startParam}`);
        }
        // Удаляем теги из текста
        text = text.replace(/\[#[^\]]+\]/g, '');
        
        await broadcastQueue.add('send', {
                    bot: strapi.plugin('telegram').service('botService').getClientBotInstance(),
                    users: clienIds,
                    text: text,
                    files: attachments,
                    keyboard: startParam ? inlineKeyboard : undefined
                })

        
        ctx.response.body = "ok"
    }
}));
