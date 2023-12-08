import { KVNamespace, D1Database } from "@cloudflare/workers-types";
export interface Env {
    // If you set another name in wrangler.toml as the value for 'binding',
    // replace "DB" with the variable name you defined.
    DB: D1Database;
}

export default defineEventHandler((event) => {
    //const DB: D1Database = event.context.cloudflare.env.DB;
    console.log('zzzzzzzzzz', process.env.DB)
    return {
        hello: 'world11111' + Math.random(),
    }
})