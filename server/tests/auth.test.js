// Imports
import * as auth from '../modules/auth.js'

// Functions
export async function test() {
    let pass = true
    let response = {}

    // Tests
    const testPassword = "password"
    const hashTestPassword = auth.hashPassword(testPassword)
    if (auth.isHashedPassword(testPassword, hashTestPassword.hash, hashTestPassword.salt) === false) pass = false

    const testData = { boom: "pow" }
    const testToken = auth.generateToken(testData)
    let verifyToken_error = ""
    let verifyToken_json = ""
    auth.verifyToken(testToken, (error, json) => {
        verifyToken_error = error
        verifyToken_json = json
    })
    if (verifyToken_error || verifyToken_json.boom !== testData.boom) pass = false

    return pass
}

