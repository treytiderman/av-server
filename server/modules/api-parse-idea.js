

// v1 user.get["username"] -> { "username": "username", "groups": [] }


function parse(string) {
    if (typeof string != 'string') return "error not a string"
    if (string.length < 8) return "error string not longer than 8 charactors"

    const data = {
        version: "",
        function: "",
        object: [],
        params: [],
        args: [],
    }
    const versionSplit = splitAt(string, " ")
    data.version = versionSplit[0]
    const objectSplit = versionSplit[1].includes("[") ? splitAt(versionSplit[1], "[") : splitAt(versionSplit[1], "(")
    data.object = objectSplit[0].split(".")
    data.function = data.object[data.object.length-1]
    data.object.pop()
    const paramsSplit = objectSplit[1].includes("]") ? splitAt(versionSplit[1], "]") : ""
    data.params = objectSplit[1].split(",")


    splitAt(objectSplit[1], "(")
    return data
}
// function parse(string) {
//     if (typeof string != 'string') return "error not a string"
//     if (string.length < 8) return "error string not longer than 8 charactors"
//     "v1 time()"

//     const data = {
//         version: "",
//         object: "",
//         function: "",
//         params: [],
//         args: [],
//     }
//     const flag = {
//         version: false,
//         object: false,
//         function: false,
//         params: false,
//         args: false,
//     }
//     string.split("").forEach((char, i) => {
//         // console.log(char)

//         // Version
//         if (!flag.version) {
//             if (i === 0 && char !== "v") return "error first charactor must be 'v'"
//             else if (i === 0 && char === "v") data.version += char
//             else if (i === 1 && !isNumeric(char)) return "error second charactor be numeric"
//             else if (isNumeric(char)) data.version += char
//             else if (char === " ") flag.version = true
//             else if (!isNumeric(char)) return "error 'v' is followed by numerics"
//         }
//         else if (!flag.object) {
//             if (data.object === "" && !isAlpha(char)) return "first charactor of the object must be alpha"
//             else if (data.object !== "" && char === ".") flag.object = true
//             else if (isAlphaNumericDash(char)) data.object += char
//         }
//         else if (!flag.function) {
//             if (data.function === "" && !isAlpha(char)) return "first charactor of the function must be alpha"
//             else if (data.function !== "" && char === "(") flag.function = true, flag.params = true
//             else if (data.function !== "" && char === "[") flag.function = true
//             else if (isAlphaNumericDash(char)) data.function += char
//         }
//         else if (!flag.params) {
//             if (data.params === [] && !isAlpha(char)) return "first charactor of the params must be alpha"
//             else if (data.params !== "" && char === "]") flag.params = true
//             else if (isAlphaNumericDash(char)) data.params += char
//         }
//         else if (!flag.args) {
//             // if (data.args === "" && !isAlpha(char)) return "first charactor of the args must be alpha"
//             // else if (data.args !== "" && char === ")") flag.args = true
//             // else if (isAlphaNumericDash(char)) data.args += char
//         }
//     })

//     console.log(flag)
//     return data
// }

function splitAt(str, char) {
    const [first, ...rest] = str.split(char);
    const remainder = rest.join('-');
    return [first, remainder];
  }

const splitAt2 = (str, char) => str.split(char).slice(1).join(char)
const isNumeric = (str) => str.match(/[0-9]/)
const isAlpha = (str) => str.match(/[a-zA-Z]/)
const isAlphaNumericDash = (str) => str.match(/[0-9a-zA-Z-]/)

setTimeout(() => {
    const strings = [
        'v1 auth.login["username"]()',
        'v1 users.get()',
    ]
    strings.forEach((string, i) => console.log(i, parse(string)))
}, 100);


