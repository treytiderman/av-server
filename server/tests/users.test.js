// Imports
import * as users from '../modules/users.js'

// Functions
export async function test() {
    let pass = true
    let response = {}

    // Tests
    await users.resetToDefault()

    response = users.login("admin", "admin")
    if (response.startsWith("error")) pass = false
    users.loginWithToken(response, (response, error) => {
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
    
    response = await users.createGroup("<guest>")
    if (!response.startsWith("error")) pass = false

    response = await users.createGroup("test-group")
    if (response !== "ok") pass = false
    if (!users.isGroup("test-group")) pass = false

    response = await users.createGroup("test-group")
    if (!response.startsWith("error")) pass = false
    
    response = await users.deleteGroup("test-group")
    if (response !== "ok") pass = false
    if (users.isGroup("test-group")) pass = false
    
    response = await users.deleteGroup("test-group")
    if (!response.startsWith("error")) pass = false
    
    response = await users.deleteGroup("admin")
    if (!users.isGroup("admin")) pass = false
    
    response = await users.deleteUser("test-user")
    if (!response.startsWith("error")) pass = false
    
    response = await users.createUser("test-user", "password", "password", ["admin", "user"])
    if (response !== "ok") pass = false
    if (!users.isUsername("test-user")) pass = false
    
    response = users.login("test-user", "wrong-password")
    if (!response.startsWith("error")) pass = false
    
    response = users.login("test-user", "password")
    if (response.startsWith("error")) pass = false
    
    if (users.isUserInGroup("test-user", "fake-group")) pass = false
    if (!users.isUserInGroup("test-user", "admin")) pass = false
    if (!users.isUserInGroup("test-user", "user")) pass = false
    
    response = await users.addGroupToUser("test-user", "fake-group")
    if (!response.startsWith("error")) pass = false
    
    response = await users.addGroupToUser("test-user", "guest")
    if (response !== "ok") pass = false
    
    response = await users.removeGroupFromUser("test-user", "fake-group")
    if (!response.startsWith("error")) pass = false
    
    response = await users.removeGroupFromUser("test-user", "user")
    if (response !== "ok") pass = false
    if (users.isUserInGroup("test-user", "user")) pass = false
    
    response = await users.changeUserPassword("test-user", "password2", "password22")
    if (!response.startsWith("error")) pass = false
    
    response = await users.changeUserPassword("fake-user", "password2", "password2")
    if (!response.startsWith("error")) pass = false
    
    response = await users.changeUserPassword("test-user", "password2", "password2")
    if (response !== "ok") pass = false
    
    response = users.login("test-user", "password2")
    if (response.startsWith("error")) pass = false
    
    response = await users.deleteUser("fake-user")
    if (!response.startsWith("error")) pass = false

    response = await users.deleteUser("test-user")
    if (response !== "ok") pass = false

    return pass
}
