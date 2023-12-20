module.exports = {
    apps: [
        {
            name: 'YktBands',
            exec_mode: 'cluster',
            instances: 'max',
            script: './.output/server/index.mjs',
            port: 3000
        }
    ]
}