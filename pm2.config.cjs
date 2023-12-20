require('dotenv').config();
const pkginfo = require('./package.json');
const execSync = require('child_process').execSync;

const log_date_format = 'DD.MM.YYYY HH:mm:ss';
const combine_logs = true;

let branch = '';

try {
    let gitInfo = execSync('git log -1 --date="format:%Y.%m.%d:%H%M" --format="%cd %D"') + '';
    branch = gitInfo.split(',')[1].split('/').pop();
} catch (error) {
}
;

/**
 * Конфигурация для деплоя
 */
module.exports = {
    apps: [{
        name: `${pkginfo.name}-backend`,
        script: './.output/server/index.mjs',
        env: {
            NODE_ENV: 'production',
            SOURCE_MAP: 'source-map',
            HOST: '127.0.0.1',
            PORT: process.env.APP_PORT
            //DEBUG: '*',
        },
        output: 'logs/backend.log',
        error: 'logs/backend-error.log',
    }]
};
