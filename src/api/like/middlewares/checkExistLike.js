'use strict';

/**
 * `checkExistLike` middleware
 */

module.exports = (config, { strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    console.log(ctx);

    await next();
  };
};
