// Imports
import * as user from '../modules/user.js'

// Functions
export async function test() {
    let pass = true
    let response = {}

    // Tests
    if (user.validUsermame()) pass = false
    if (user.validUsermame("")) pass = false
    if (user.validUsermame(null)) pass = false
    if (user.validUsermame(undefined)) pass = false
    if (user.validUsermame("h")) pass = false
    if (user.validUsermame(32400)) pass = false
    if (!user.validUsermame("username")) pass = false

    if (user.isUser()) pass = false
    if (user.isUser("")) pass = false
    if (user.isUser(null)) pass = false
    if (user.isUser(undefined)) pass = false
    if (user.isUser("fakeUser")) pass = false
    if (!user.isUser("admin")) pass = false

    response = user.getUserAndPassword("admin") || {}
    if (response.username !== user.DEFAULT_USER.username) pass = false
    response = user.getUser("admin") || {}
    if (response.username !== user.DEFAULT_USER.username) pass = false

    if (user.isGroup()) pass = false
    if (user.isGroup("")) pass = false
    if (user.isGroup(null)) pass = false
    if (user.isGroup(undefined)) pass = false
    if (user.isGroup("fakeGroup")) pass = false
    if (!user.isGroup("admin")) pass = false

    if (user.areGroups([])) pass = false
    if (user.areGroups()) pass = false
    if (user.areGroups("")) pass = false
    if (user.areGroups(null)) pass = false
    if (user.areGroups(undefined)) pass = false
    if (user.areGroups("admin")) pass = false
    if (user.areGroups(["admin", "fakeGroup"])) pass = false
    if (!user.areGroups(["admin", "user"])) pass = false

    response = user.getGroups()
    if (!response.some(group => group === "admin")) pass = false

    await user.createGroup("testGroup")
    await user.createGroup("testGroup")
    if (!user.isGroup("testGroup")) pass = false
    await user.deleteGroup("testGroup")
    if (user.isGroup("testGroup")) pass = false

    try {
        await user.deleteGroup("admin")
        pass = false
    } catch (error) {
        if (error.message !== "error can not delete admin group") pass = false
    }
    if (!user.isGroup("admin")) pass = false

    const token = user.getToken("admin", "admin")
    if (token.startsWith("error")) pass = false
    user.verifyToken("BAD_TOKEN", (response, error) => {
        if (error !== "error bad token") pass = false
    })
    user.verifyToken(token, (response, error) => {
        if (error === "error bad token") pass = false
        if (response.username !== "admin") pass = false
    })

    await user.deleteUser("user4")
    const createUserResponse = await user.createUser("user4", "password", "password", ["admin", "guest"])
    if (createUserResponse.username !== "user4") pass = false
    if (!user.isUser("user4")) pass = false
    const token2 = user.getToken("user4", "password")
    if (token2.startsWith("error")) pass = false

    if (user.isUserInGroup("user4", "admin") === false) pass = false
    if (user.isUserInGroup("user4", "user") === true) pass = false
    if (user.isUserInGroup("user4", "hop") === true) pass = false

    const addGroupToUserResponse = await user.addGroupToUser("user4", "user")
    if (!addGroupToUserResponse.groups.some(group => group === "user")) pass = false
    const removeGroupFromUserResponse = await user.removeGroupFromUser("user4", "user")
    if (removeGroupFromUserResponse.groups.some(group => group === "user")) pass = false

    const changeUserPasswordResponse = await user.changeUserPassword("user4", "password2", "password2")
    if (changeUserPasswordResponse.username !== "user4") pass = false
    const token3 = user.getToken("user4", "password2")
    if (token3.startsWith("error")) pass = false

    const deleteUserResponse2 = await user.deleteUser("user4")
    if (deleteUserResponse2 !== "ok") pass = false

    return pass
}
