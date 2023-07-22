// Overview: Ideas for handling Promises and Errors

// Functions
function throwError(bool = false) {
    if (bool) throw new Error('error thrown')
    else return "ok"
}
function rejectPromise(bool = false) {
    return new Promise((resolve, reject) => {
        if (bool) reject(new Error('rejected'))
        else resolve("resolved")
    })
}
async function throwAsyncError(bool = false) {
    return await rejectPromise(bool)
}

function delay(ms) {
    return new Promise((resolve, reject) => {
        if (!ms) {
            reject(new Error('ms is required'))
        } else {
            setTimeout(() => resolve(ms), ms)
        }
    })
}
async function fetchJson() {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos/1")
    if (!response.ok) {throw new Error("fetch not ok")}
    const data = await response.json()
    return data
}

async function wrapPromise(promise) {
    const [{ value, reason }] = await Promise.allSettled([promise])
    return [value, reason]
}

async function delayThreeTimes_inOrder(ms) {
    await delay(ms)
    await delay(ms)
    await delay(ms)
}

async function delayThreeTimes_allAtOnce(ms) {
    await Promise.all([
        delay(ms),
        delay(ms),
        delay(ms),
    ])
}

// Testing
setTimeout(async () => {
    console.time("time")

    try {
        console.log("throwError(false)", throwError(false))
        console.log("throwError(true)", throwError(true))
    } catch (error) {
        console.log("throwError(true)", error.message)
    }

    try {
        console.log("rejectPromise(false)", await rejectPromise(false))
        console.log("rejectPromise(true)", await rejectPromise(true))
    } catch (error) {
        console.log("rejectPromise(true)", error.message)
    }

    try {
        console.log("throwAsyncError(false)", await throwAsyncError(false))
        console.log("throwAsyncError(true)", await throwAsyncError(true))
    } catch (error) {
        console.log("throwAsyncError(true)", error.message)
    }

    const [{ value, reason }] = await Promise.allSettled([delay()])
    console.log(value, reason.message);

    console.log("\ntry delay()")
    try {
        await delay()
    } catch (error) {
        console.error("delay() -> error.message =", error.message);
    }
    console.timeLog("time")
    
    console.log("\ntry fetchJson()")
    const [json, error] = await wrapPromise(fetchJson())
    console.log(json || error.message)
    console.timeLog("time")
    
    console.log("\ndelay(1000)")
    await delay(1000)
    console.timeLog("time")
    
    console.log("\ndelayThreeTimes_inOrder(500)")
    await delayThreeTimes_inOrder(500)
    console.timeLog("time")
    
    console.log("\ndelayThreeTimes_allAtOnce(500)")
    await delayThreeTimes_allAtOnce(500)
    console.timeLog("time")
    
    console.log("\nend")
    console.timeEnd("time")
}, 1_000);
