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
        port: 3000,
        //node_args: '--preserve-symlinks -r esm',
        env: {
            NODE_ENV: 'production',
            SOURCE_MAP: 'source-map',
            NODE_PATH: '.',
            //DEBUG: '*',
        },
        output: 'logs/backend.log',
        error: 'logs/backend-error.log',
        //log_date_format,
        //combine_logs,
        //error_file: `${__dirname}/logs/server.err.log`,
        //out_file:   `${__dirname}/logs/server.out.log`,
        //pid_file:   `${__dirname}/logs/server.pid`,
    }],
    deploy : {
        production : {
            "user" : "ubuntu",
            "host" : ["127.0.0.1"],
            "ref"  : "origin/master",
            "repo" : "git@github.com:Username/repository.git",
            "path" : "/var/www/my-repository",
            "post-deploy" : "npm install"
        }
    }
};
