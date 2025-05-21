import { Queue, Worker } from 'bullmq';
import { Bot } from 'grammy';

const redisConfig: any = strapi.config.get('server.redis')

const connection = {
    host: redisConfig.host,
    port: redisConfig.port
}
export const auctionQueue = new Queue('auction', {
    connection: connection
})

// export const registerWorker = (strapi): void => {



    
// }