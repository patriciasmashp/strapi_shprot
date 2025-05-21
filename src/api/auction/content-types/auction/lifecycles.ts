import { AuctionFactory } from "../../classes/AuctionFactory";



export default {
    beforeCreate(event) {
        let { data, where, select, populate } = event.params;
        event.params.populate = populate || [];
        if (!event.params.populate.includes('client')) {
            event.params.populate.push('client');
        }
        if (!event.params.populate.includes('city')) {
            event.params.populate.push('city');
        }
        if (!event.params.populate.includes('file')) {
            event.params.populate.push('file');
        }

        // let's do a 20% discount everytime
        // event.params.data.price = event.params.data.price * 0.8;
    },

    async afterCreate(event) {
        const { result, params } = event;
        setTimeout(async () => {
            const auctionData = await strapi.documents('api::auction.auction')
            .findOne({documentId: result.documentId, populate: ['file', 'client', 'city', 'masterResponses', 'masterResponses.master']})
            console.log(auctionData);
            
            const factory = new AuctionFactory(auctionData);
            const auction = await factory.createAuction(result.type);
            await auction.startAuction();
        },
        5000
    )



    },
};