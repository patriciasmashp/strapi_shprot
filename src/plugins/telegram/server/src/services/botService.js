

const botService = ({ strapi }) => ({
  getClientBotInstance() {
    const bot = strapi.plugin('telegram').config('clientBotInstance');
    return bot;
  },
  getMasterBotInstance() {
    const bot = strapi.plugin('telegram').config('masterBotInstance');
    return bot;
  },

});

export default botService;
