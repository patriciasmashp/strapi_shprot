import { Worker } from 'bullmq';
import { Bot, InlineKeyboard } from 'grammy';


export function createBroadcastWorker(strapi) {
    const redisConfig: any = strapi.config.get('server.redis');

    const connection = {
        host: redisConfig.host,
        port: redisConfig.port
    };
    const worker = new Worker('broadcast', async job => {
        const bot = new Bot(job.data.bot == 'master' ? process.env.BOT_TOKEN : process.env.CLIENT_BOT_TOKEN);
        for (let tgId in job.data.users) {
            try {
               
                const sended = await strapi.service('plugin::telegram.telegramApiService').sendMessage(bot, job.data.text, job.data.users[tgId], job.data.files || {}, job.data.keyboard);
            } catch (error) { }
        }
    }, {
        connection: connection,
        concurrency: 1,
        useWorkerThreads: true,
    });


    worker.on('failed', (job, err) => {
        console.log(`${job.id} has failed with ${err.message}`);
    });
}