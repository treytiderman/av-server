// Imports
import * as users from '../modules/users-v1.js'

// Functions
export async function test() {
    let pass = true
    let response = {}

    // Tests
    users.resetToDefault()

    const token = users.login("admin", "admin")
    if (token.startsWith("error")) pass = false
    users.loginWithToken(token, (response, error) => {
        if (error === "error bad token") pass = false
        if (response.username !== "admin") pass = false
    })
    users.loginWithToken("BAD_TOKEN", (response, error) => {
        if (error !== "error bad token") pass = false
    })

    if (users.validGroup()) pass = false
    if (users.validGroup(0)) pass = false
    if (users.validGroup("")) pass = false
    if (users.validGroup(``)) pass = false
    if (users.validGroup([])) pass = false
    if (users.validGroup({})) pass = false
    if (users.validGroup(NaN)) pass = false
    if (users.validGroup(null)) pass = false
    if (users.validGroup(false)) pass = false
    if (users.validGroup(undefined)) pass = false
    if (users.validGroup("0")) pass = false
    if (!users.validGroup("Capital")) pass = false
    if (!users.validGroup("white space")) pass = false
    if (!users.validGroup("special_char-!@#$%^&")) pass = false

    if (users.isUsername()) pass = false
    if (users.isUsername("")) pass = false
    if (users.isUsername(null)) pass = false
    if (users.isUsername(undefined)) pass = false
    if (users.isUsername("fakeUser")) pass = false
    if (!users.isUsername("admin")) pass = false

    response = users.getUserAndPassword("admin") || {}
    if (response.username !== users.DEFAULT_USER.username) pass = false
    response = users.getUser("admin") || {}
    if (response.username !== users.DEFAULT_USER.username) pass = false

    if (users.isGroup()) pass = false
    if (users.isGroup("")) pass = false
    if (users.isGroup(null)) pass = false
    if (users.isGroup(undefined)) pass = false
    if (users.isGroup("fakeGroup")) pass = false
    if (!users.isGroup("admin")) pass = false

    if (users.areGroups([])) pass = false
    if (users.areGroups()) pass = false
    if (users.areGroups("")) pass = false
    if (users.areGroups({})) pass = false
    if (users.areGroups(null)) pass = false
    if (users.areGroups(undefined)) pass = false
    if (users.areGroups("admin")) pass = false
    if (users.areGroups(["admin", "fakeGroup"])) pass = false
    if (!users.areGroups(users.DEFAULT_GROUPS)) pass = false

    response = users.getGroups()
    if (!response.some(group => group === users.ADMIN_GROUP)) pass = false

    // await users.createGroup("testGroup")
    // await users.createGroup("testGroup")
    // if (!users.isGroup("testGroup")) pass = false
    // await users.deleteGroup("testGroup")
    // if (users.isGroup("testGroup")) pass = false

    // response = await users.deleteGroup("admin")
    // if (!users.isGroup("admin")) pass = false

    // await users.deleteUser("user4")
    // const createUserResponse = await users.createUser("user4", "password", "password", ["admin", "guest"])
    // if (createUserResponse.username !== "user4") pass = false
    // if (!users.isUsername("user4")) pass = false
    // const token2 = users.getToken("user4", "password")
    // if (token2.startsWith("error")) pass = false

    // if (users.isUserInGroup("user4", "admin") === false) pass = false
    // if (users.isUserInGroup("user4", "user") === true) pass = false
    // if (users.isUserInGroup("user4", "hop") === true) pass = false

    // const addGroupToUserResponse = await users.addGroupToUser("user4", "user")
    // if (!addGroupToUserResponse.groups.some(group => group === "user")) pass = false
    // const removeGroupFromUserResponse = await users.removeGroupFromUser("user4", "user")
    // if (removeGroupFromUserResponse.groups.some(group => group === "user")) pass = false

    // const changeUserPasswordResponse = await users.changeUserPassword("user4", "password2", "password2")
    // if (changeUserPasswordResponse.username !== "user4") pass = false
    // const token3 = users.getToken("user4", "password2")
    // if (token3.startsWith("error")) pass = false

    // const deleteUserResponse2 = await users.deleteUser("user4")
    // if (deleteUserResponse2 !== "ok") pass = false

    return pass
}
