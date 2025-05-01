'use strict';

/**
 * admin service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::admin.admin', ({ strapi }) => ({
    async getAdmins(){
        const response = await strapi.documents('api::admin.admin').findFirst({})

        return response.admins_id.admins
        
    }
}));
