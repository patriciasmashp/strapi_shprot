const cronTasks = require("./cron-tasks");

module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  logger: {
    config: { level: 'silly' }
  },
  cron: {
    enabled: true,
    tasks: cronTasks,
  },
  app: {
    keys: env.array('APP_KEYS'),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
  redis: {
    host: 'localhost',
    port: 6379,
    maxRetriesPerRequest: null,
    connectTimeout: 180000
  },
  watchIgnoreFiles: [
    '**/logs',
    './logs'
  ]
});
