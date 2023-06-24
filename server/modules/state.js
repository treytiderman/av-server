// Overview: basic local JSON database to maintain state
const { readJSON, writeJSON, deleteFile } = require('./files')
const { log } = require('./logger')

// Variables
const BASE_STATE_FILE_PATH = "../private/configs/"

// Class
class State {
    #id
    #defaultState
    #workingState

    constructor(id, defaultState = {}) {
        this.#id = id
        this.#defaultState = this.#clone(defaultState)
        this.#workingState = this.#clone(defaultState)
        this.ready = false
        this.#initFile().then(() => {
            this.ready = true
            return this
        })
    }

    #clone(obj) {
        try { return JSON.parse(JSON.stringify(obj)) }
        catch { return obj }
    }

    async #initFile() {
        const file = await this.#getFile()
        if (file) {
            this.#workingState = file
            log("state.js",this.#id, file)
            console.log(this.#id, file)
        }
        else {
            this.#saveFile()
            log("state.js",`${this.#id}.json not found. default loaded`, this.#defaultState)
            console.log(`${this.#id}.json not found. default loaded`, this.#defaultState)
        }
    }

    async #getFile() {
        const file = await readJSON(BASE_STATE_FILE_PATH + this.#id + ".json")
        return file
    }

    async #saveFile() {
        await writeJSON(BASE_STATE_FILE_PATH + this.#id + ".json", this.#workingState)
    }

    async deleteStateFile() {
        this.#workingState = {}
        await deleteFile(BASE_STATE_FILE_PATH + this.#id + ".json")
    }

    async resetToDefaultState() {
        this.#workingState = this.#clone(this.#defaultState)
        await this.#saveFile()
    }

    async set(key, value) {
        if (!this.ready) return
        this.#workingState[key] = value
        await this.#saveFile()
    }

    get(key) {
        const value = this.#clone(this.#workingState[key])
        return value
    }
}

// Testing
setTimeout(async () => {
    if (process.env.RUN_TESTS) runTests("state.js")
}, 1000)
async function runTests(testName) {
    let pass = true

    const defaultState = { num: 72, array: [1, 2] }
    const TestState = new State("test-state", defaultState)
    if (TestState.get("num") !== 72) pass = false

    const arr = TestState.get("array")
    arr.push(3)
    arr.push(4)
    if (TestState.get("array").length !== 2) pass = false

    TestState.resetToDefaultState()
    if (TestState.get("num") !== 72) pass = false

    await TestState.deleteStateFile()
    if (TestState.get("other") === null) pass = false

    const testObj = { num: 99 }
    await TestState.set("num", testObj.num)
    testObj.num = 42
    if (TestState.get("num") !== 99) pass = false

    await TestState.set("num", 104)
    if (TestState.get("num") !== 104) pass = false

    await TestState.resetToDefaultState()
    if (TestState.get("num") !== 72) pass = false

    await TestState.deleteStateFile()

    const time = new Date().toISOString()
    await TestState.set("time", time)
    if (TestState.get("time") !== time) pass = false

    await TestState.deleteStateFile()

    if (pass !== true) console.log(testName, '\x1b[31mTESTS FAILED\x1b[0m')
}

// Export
exports.State = State
exports.runTests = runTests
