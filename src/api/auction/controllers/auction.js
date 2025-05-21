'use strict';

const { AuctionValidator } = require('../classes/AuctionValidator');

/**
 * auction controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::auction.auction', ({ strapi }) => ({
    async create(ctx) {
        ctx.request.body = { data: ctx.request.body }

        const auctionValidator = new AuctionValidator(ctx.request.body.data);
        const valid = await auctionValidator.validateBeforeCreate();

        if (!valid.isValid) {

            return ctx.badRequest(valid.message);
        }
        const { data, meta } = await super.create(ctx);

        const file = ctx.request.files.file;

        if (file) {
            let fiileUploaded = await strapi.plugins.upload.services.upload.upload(
                {
                    data: {},
                    files: file
                }
            )
            await strapi.documents('api::auction.auction')
                .update({ documentId: data.documentId, data: { file: fiileUploaded[0] }, populate: ['file'] })
        }



        ctx.body = { data, meta };
    },
    async setMasterResponse(ctx) {
        const { body, params } = ctx.request

        const master = await strapi.documents('api::master.master')
            .findOne({ documentId: body.data.master })

        const auction = await strapi.documents('api::auction.auction')
            .findOne({ documentId: params.id, populate: ["masterResponses", "masterResponses.master"] })

        const masterResponses = auction.masterResponses

        if (auction.finished) {
            ctx.locked('Auction finished')
            return
        }
        const exist = masterResponses.some((response) => response.master.id == master.id)
        if (exist) {
            ctx.locked('Only one response')
            return
        }

        const success = await strapi.service('api::auction.auction').addMasterResponse(body.data, auction)

        ctx.body = { data: success }

    },
    async notifyMasterSelectedByClient(ctx) {
        const { body, params } = ctx.request
        const auctionDocumentId = body.data.auction
        const masterDocumentId = body.data.master

        if (!auctionDocumentId || !masterDocumentId) {
            return ctx.badRequest('Auction and master requied')
        }

        const auction = await strapi.documents('api::auction.auction')
            .findOne({ documentId: auctionDocumentId, populate: ["client", "file"] })

        const master = await strapi.documents('api::master.master')
            .findOne({ documentId: masterDocumentId })

        if (!auction || !master) {
            return ctx.badRequest('Auction or master not found')
        }

        const success = await strapi.service('api::auction.auction').notifyMasterSelectedByClient(auction, master)

        if (success) {
            await strapi.service('api::auction.auction').updateMasterAuctionStatistic(master)
        }
        ctx.body = { data: success }

    },


}));
