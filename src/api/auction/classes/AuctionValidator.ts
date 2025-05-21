import { AuctionData } from "../Ifaces/IAuction";

type PredicateAnswer = {
    isValid: boolean;
    message?: string;
}
interface ValidatorPredicate {
    check(auctionData: AuctionData): Promise<PredicateAnswer>;
}
class LimiteClientAuctions implements ValidatorPredicate {
    async check(auctionData: AuctionData): Promise<PredicateAnswer> {

        const auctions = await strapi.documents('api::auction.auction').findMany({
            filters: {
                client: {
                    documentId: {
                        $eq: auctionData.client
                    }
                },
                finished:{
                    $eq: false
                }
            }, populate: 'client'
        })
        console.log(auctions);
        if (auctions.length >= 3) {
            return {
                isValid: false,
                message: 'Максимальное количество аукционов достигнуто'
            };
        }
        return { isValid: true };
    }
}
class MasterForbiden implements ValidatorPredicate {
    async check(auctionData: AuctionData): Promise<PredicateAnswer> {
        const client = await strapi.documents('api::client.client').findOne({ documentId: auctionData.client })
        const master = await strapi.documents('api::master.master').findFirst(
            {
                filters: { master_id: { $eq: client.client_id } }
            }
        )
        console.log(master);

        if (master) {
            return {
                isValid: false,
                message: 'Мастерам запрещенно создавать аукционы'
            };
        }
        return { isValid: true };
    }
}


export class AuctionValidator {
    private auctionData: AuctionData;
    private predicates: ValidatorPredicate[];

    constructor(auctionData: AuctionData) {
        this.auctionData = auctionData;
        this.predicates = [/*new LimiteClientAuctions(), new MasterForbiden()*/];
    }

    async validateBeforeCreate(): Promise<PredicateAnswer> {
        for (const predicate of this.predicates) {
            const answer = await predicate.check(this.auctionData);
            if (!answer.isValid) {
                return answer;
            }
        }
        return { isValid: true };
    }


}