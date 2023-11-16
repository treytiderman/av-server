// Imports
import * as api from '../modules/api.js'

// Functions
export async function test() {
    let pass = true
    let response = {}

    // Tests
    response = api.parsePathTemplate("path/to/endpoint")
    if (
        response.string !== "path/to/endpoint" ||
        response.base !== "path/to/endpoint"
    ) pass = false

    response = api.parsePathTemplate("path/to/endpoint/:id")
    if (
        response.string !== "path/to/endpoint/:id" ||
        response.base !== "path/to/endpoint/" ||
        response.params[0] !== "id"
    ) pass = false
    response = api.parseParams(response, "path/to/endpoint/420")
    if (response.id !== "420") pass = false

    response = api.parsePathTemplate("path/:author/:series/:book")
    if (
        response.string !== "path/:author/:series/:book" ||
        response.base !== "path/" ||
        response.params[2] !== "book"
    ) pass = false
    response = api.parseParams(response, "path/doug/hhgtg/so-long")
    if (response.book !== "so-long") pass = false

    response = api.isAuth({ auth: false }, "path/1")
    if (response !== false) pass = false

    response = api.isAuth({ auth: true }, "path/2")
    if (response !== false) pass = false

    response = api.isAuth({ auth: true, send: () => { } }, "path/3")
    if (response !== true) pass = false

    response = api.isAdmin({
        auth: true,
        user: {},
        send: () => { },
    }, "path/4")
    if (response !== false) pass = false

    response = api.isAdmin({
        auth: true,
        user: { groups: [] },
        send: () => { },
    }, "path/5")
    if (response !== false) pass = false

    response = api.isAdmin({
        auth: false,
        user: { groups: ["admin"] },
        send: () => { },
    }, "path/6")
    if (response !== false) pass = false

    response = api.isAdmin({
        auth: true,
        user: { groups: ["user"] },
        send: () => { },
    }, "path/7")
    if (response !== false) pass = false

    response = api.isAdmin({
        auth: true,
        user: { groups: ["admin"] },
        send: () => { },
    }, "path/8")
    if (response !== true) pass = false

    return pass
}

