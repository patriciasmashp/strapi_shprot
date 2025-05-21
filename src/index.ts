'use strict';


import { Worker } from 'bullmq';
import { Bot } from 'grammy';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {
    const redisConfig: any = strapi.config.get('server.redis')

    const connection = {
      host: redisConfig.host,
      port: redisConfig.port
    }
    const worker = new Worker('auction', async job => {
      const bot = new Bot(process.env.BOT_TOKEN)
      for (let tgId in job.data.messages) {
        try {
          const deleted = await bot.api.deleteMessage(tgId, job.data.messages[tgId])
        } catch (error) { }
      }

    }, {
      connection: connection,
      concurrency: 1,
      useWorkerThreads: true,
    });


    worker.on('completed', job => {
      const auction = job.data.auctuion

      strapi.documents('api::auction.auction').update({
        documentId: auction.documentId, data: {
          finished: true
        }
      }).then((response) => {
        console.log(`auction finished. task id: ${job.id}`)
      })

    });

    worker.on('failed', (job, err) => {
      console.log(`${job.id} has failed with ${err.message}`);
    });
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {

  },
};
