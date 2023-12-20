/**
 * Конфигурация для деплоя
 */
export const apps = [{
    name: `yktbands`,
    script: 'node .output/server/index.mjs',
    //node_args: '--preserve-symlinks -r esm',
    env: {
        NODE_ENV: 'production',
        SOURCE_MAP: 'source-map',
        NODE_PATH: '.',
        //DEBUG: '*',
    },
    output: 'logs/backend.log',
    error: 'logs/backend.log',
    //log_date_format,
    //combine_logs,
    //error_file: `${__dirname}/logs/server.err.log`,
    //out_file:   `${__dirname}/logs/server.out.log`,
    //pid_file:   `${__dirname}/logs/server.pid`,
}];
