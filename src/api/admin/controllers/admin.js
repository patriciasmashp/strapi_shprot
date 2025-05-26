'use strict';

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'example.txt');
const { createCoreController } = require('@strapi/strapi').factories;
// Функция для проверки существования файла и его создания
const checkAndCreateFile = (filePath) => {
    // Проверяем, существует ли файл
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // Файл не существует, создаем новый
            fs.writeFile(filePath, '', (err) => {
                if (err) {
                    console.error('Ошибка при создании файла:', err);
                } else {
                    console.log('Файл успешно создан:', filePath);
                }
            });
        }
    });
};




module.exports = createCoreController('api::admin.admin', ({ strapi }) => ({
    async logFrontendError(ctx) {
        const error = ctx.request.body.data
        
        checkAndCreateFile('logs/frontEndLog.json');
        fs.appendFileSync('logs/frontEndLog.json', JSON.stringify(error));
        ctx.response.body = "ok"
    }
}));
