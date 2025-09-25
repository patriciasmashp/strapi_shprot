module.exports = ({env}) => ({
  telegram: {
    enabled: true,
    resolve: `./src/plugins/telegram`,
  },
  sentry: {
    enabled: true,
    config: {
      dsn: env('SENTRY_DSN'),
      sendMetadata: true,
    },
  },
  upload: {
    config: {
      breakpoints: {
        xlarge: 1920,
        large: 1000,
        medium: 750,
        small: 500,
        avatar: 50
      },
    },
  },
});
