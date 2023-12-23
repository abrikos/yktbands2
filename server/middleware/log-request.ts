
export default defineEventHandler(async (event) => {
    console.log(process.env.BOT_TOKEN)
    console.log(event.method, event._path)
})