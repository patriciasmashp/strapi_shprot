'use strict';

/**
 * `authPolicy` policy
 */

module.exports = (policyContext, config, { strapi }) => {
    // Add your own logic here.
    console.log(Object.keys(policyContext.is));
    // console.log(policyContext.is);
    console.log(policyContext.state);

    const canDoSomething = true;

    if (canDoSomething) {
      return true;
    }

    return false;
};
