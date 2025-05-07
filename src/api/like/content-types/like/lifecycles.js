const { Bot, InlineKeyboard } = require("grammy");
const fs = require("fs");
const { env } = require("process");
module.exports = {
    beforeCreate(event) {
        const { data, where, select, populate } = event.params;
        event.params.populate = ['master', 'client']
    },

    async afterCreate(event) {
        const { result, params, model } = event;
        const totalMasterLieks = await strapi.documents('api::like.like').count({ filters: { master: { documentId: { $eq: result.master.documentId } } } })
        const masterData = await strapi.documents('api::master.master').update({
            documentId: result.master.documentId,
            data: {
                likes: totalMasterLieks
            }
        });
        console.log(masterData);
        
    },
};