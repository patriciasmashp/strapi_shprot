import { Bot } from 'grammy';

export default {
  default: {
    clientBotInstance: new Bot(process.env.CLIENT_BOT_TOKEN),
    masterBotInstance: new Bot(process.env.BOT_TOKEN),
  },
  validator() { },
};
