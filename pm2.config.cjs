require('dotenv').config();


const {PORT, BOT_NAME, BOT_TOKEN, MAIL_PASSWORD, MAIL_USER} = process.env

/**
 * Конфигурация для деплоя
 */
module.exports = {
    apps: [{
        name: `ykt-bands`,
        script: './.output/server/index.mjs',
        env: {
            NODE_ENV: 'production',
            SOURCE_MAP: 'source-map',
            HOST: '127.0.0.1',
            PORT, BOT_NAME, BOT_TOKEN, MAIL_PASSWORD, MAIL_USER,
            DEBUG: '*',
        },
        output: 'logs/backend.log',
        error: 'logs/backend-error.log',
    }]
};
