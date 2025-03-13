import { PaperPlane } from '@strapi/icons';
import {TelegramMenu} from './extensions/telegram/TelegramMenu.jsx';
const config = {
  locales: [
    // 'ar',
    // 'fr',
    // 'cs',
    // 'de',
    // 'dk',
    // 'es',
    // 'he',
    // 'id',
    // 'it',
    // 'ja',
    // 'ko',
    // 'ms',
    // 'nl',
    // 'no',
    // 'pl',
    // 'pt-BR',
    // 'pt',
    'ru',
    // 'sk',
    // 'sv',
    // 'th',
    // 'tr',
    // 'uk',
    // 'vi',
    // 'zh-Hans',
    // 'zh',
  ],
};

const bootstrap = (app) => {

  app.addMenuLink({
    to: '/plugins/telegram-plugin',
    icon: PaperPlane,
    intlLabel: {
      id: 'telegram-plugin.telegram-plugin',
      defaultMessage: 'Telegram',
    },
    Component: () => TelegramMenu,
    permissions: [], // permissions to apply to the link
    position: 8, // position in the menu
    licenseOnly: false, // mark the feature as a paid one not available in your license
  });
};

export default {
  config,
  bootstrap,
};
