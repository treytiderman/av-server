import { Logger, emitter as logEmitter } from "./modules/logger-v0.js";
const log = new Logger('server.js')

// Constants
const ERROR_SHUTDOWN_TIMEOUT = process.env.DEV_MODE ? 300_000 : 2_000

// Startup
process.on('uncaughtException', error)
// process.on('unhandledRejection', reject)

// Functions
async function error(error) {
    const errorMessage = `ERROR SHUTTING DOWN IN ${ERROR_SHUTDOWN_TIMEOUT / 1_000} SEC`
    console.log(errorMessage)
    console.log("ERROR", error)

    await log.error(errorMessage)
    await log.error(
        `process.on('uncaughtException', error(${error.message}))`,
        error.stack.split("\n").map(txt => txt.trim())
        // JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error)))
    )

    // Shut down
    setTimeout(() => process.exit(1), ERROR_SHUTDOWN_TIMEOUT).unref()
}
async function reject(error, promise) {
    console.log("REJECT", error)
    log.warn(`process.on('unhandledRejection', reject(${error}))`, promise)
    // await log.warn(`process.on('unhandledRejection', reject(${error}))`, promise)
}
