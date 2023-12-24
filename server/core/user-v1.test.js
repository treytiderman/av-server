// Imports
import * as um from './user-v1.js'

// Functions
export async function test() {
    let pass = true
    let response = {}

    // Tests
    await um.users.reset()

    response = await um.token.get("admin", "admin")
    if (response.startsWith("error")) pass = false
    um.token.verify(response, (response, error) => {
        if (error === "error bad token") pass = false
        if (response.username !== "admin") pass = false
    })

    um.token.verify("BAD_TOKEN", (response, error) => {
        if (error !== "error bad token") pass = false
    })
    um.token.verify("BAD_TOKEN", () => {})

    if (um.validGroup()) pass = false
    if (um.validGroup(0)) pass = false
    if (um.validGroup("")) pass = false
    if (um.validGroup(``)) pass = false
    if (um.validGroup([])) pass = false
    if (um.validGroup({})) pass = false
    if (um.validGroup(NaN)) pass = false
    if (um.validGroup(null)) pass = false
    if (um.validGroup(false)) pass = false
    if (um.validGroup(undefined)) pass = false
    if (um.validGroup("0")) pass = false
    if (!um.validGroup("Capital")) pass = false
    if (!um.validGroup("white space")) pass = false
    if (!um.validGroup("special_char-!@#$%^&")) pass = false

    if (um.isUsername()) pass = false
    if (um.isUsername("")) pass = false
    if (um.isUsername(null)) pass = false
    if (um.isUsername(undefined)) pass = false
    if (um.isUsername("fakeUser")) pass = false
    if (!um.isUsername("admin")) pass = false

    response = um.user.get("admin") || {}
    if (response.username !== um.DEFAULT_USERS["admin"].username) pass = false
    response = um.user.get("admin") || {}
    if (response.username !== um.DEFAULT_USERS["admin"].username) pass = false

    if (um.isGroup()) pass = false
    if (um.isGroup("")) pass = false
    if (um.isGroup(null)) pass = false
    if (um.isGroup(undefined)) pass = false
    if (um.isGroup("fakeGroup")) pass = false
    if (!um.isGroup("admin")) pass = false

    if (um.areGroups([])) pass = false
    if (um.areGroups()) pass = false
    if (um.areGroups("")) pass = false
    if (um.areGroups({})) pass = false
    if (um.areGroups(null)) pass = false
    if (um.areGroups(undefined)) pass = false
    if (um.areGroups("admin")) pass = false
    if (um.areGroups(["admin", "fakeGroup"])) pass = false

    response = um.groups.get()
    if (!response.some(group => group === um.ADMIN_GROUP)) pass = false
    
    response = await um.groups.create("<guest>")
    if (!response.startsWith("error")) pass = false

    response = await um.groups.create("test-group")
    if (response !== "ok") pass = false
    if (!um.isGroup("test-group")) pass = false

    response = await um.groups.create("test-group")
    if (!response.startsWith("error")) pass = false
    
    response = await um.groups.delete("test-group")
    if (response !== "ok") pass = false
    if (um.isGroup("test-group")) pass = false
    
    response = await um.groups.delete("test-group")
    if (!response.startsWith("error")) pass = false
    
    response = await um.groups.delete("admin")
    if (!um.isGroup("admin")) pass = false
    
    response = await um.user.delete("test-user")
    if (!response.startsWith("error")) pass = false
    
    response = await um.user.create("test-user", "password", "password", ["admin", "user"])
    if (response !== "ok") pass = false
    if (!um.isUsername("test-user")) pass = false
    
    response = await um.token.get("test-user", "wrong-password")
    if (!response.startsWith("error")) pass = false
    
    response = await um.token.get("test-user", "password")
    if (response.startsWith("error")) pass = false
    
    if (um.isUserInGroup("test-user", "fake-group")) pass = false
    if (!um.isUserInGroup("test-user", "admin")) pass = false
    if (!um.isUserInGroup("test-user", "user")) pass = false
    
    response = await um.user.addGroup("test-user", "fake-group")
    if (!response.startsWith("error")) pass = false
    
    response = await um.user.addGroup("test-user", "guest")
    if (response !== "ok") pass = false
    
    response = await um.user.removeGroup("test-user", "fake-group")
    if (!response.startsWith("error")) pass = false
    
    response = await um.user.removeGroup("test-user", "user")
    if (response !== "ok") pass = false
    if (um.isUserInGroup("test-user", "user")) pass = false
    
    response = await um.user.changePassword("test-user", "password2", "password22")
    if (!response.startsWith("error")) pass = false
    
    response = await um.user.changePassword("fake-user", "password2", "password2")
    if (!response.startsWith("error")) pass = false
    
    response = await um.user.changePassword("test-user", "password2", "password2")
    if (response !== "ok") pass = false
    
    response = await um.token.get("test-user", "password2")
    if (response.startsWith("error")) pass = false
    
    response = await um.user.delete("fake-user")
    if (!response.startsWith("error")) pass = false

    response = await um.user.delete("test-user")
    if (response !== "ok") pass = false

    return pass
}
