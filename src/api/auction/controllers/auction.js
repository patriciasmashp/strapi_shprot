'use strict';

const { default: AuctionFactory } = require('../classes/AuctionFactory');
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

        let filesUploaded = undefined;

        if (ctx.request.files['file[]']) {

            filesUploaded = await strapi.plugins.upload.services.upload.upload(
                {
                    data: {},
                    files: ctx.request.files['file[]']
                }
            )
        }
        const { data, meta } = await super.create(ctx);

        if (filesUploaded) {
            await strapi.documents('api::auction.auction')
                .update({ documentId: data.documentId, data: { file: filesUploaded }, populate: ['file'] })
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

        const auctionData = await strapi.documents('api::auction.auction')
            .findOne({ documentId: auctionDocumentId, populate: ["client", "file", "masterResponses", "masterResponses.master"] })

        const master = await strapi.documents('api::master.master')
            .findOne({ documentId: masterDocumentId })

        if (!auctionData || !master) {
            return ctx.badRequest('Auction or master not found')
        }

        const auctionFactory = new AuctionFactory(auctionData)
        const auction = await auctionFactory.createAuction(auctionData.type)
        await auction.setClientChoice(master)
        const success = await strapi.service('api::auction.auction').notifyMasterSelectedByClient(auctionData, master)

        if (success) {
            await strapi.service('api::auction.auction').updateMasterAuctionStatistic(master)
        }
        ctx.body = { data: success }

    },


}));
