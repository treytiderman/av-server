const fs = require('fs')

// Functions
function readText(path, file, cb) {
  fs.readFile(path+file, 'utf-8', (error, data) => {

    // Error
    if (error) {
      console.log("Read File Error", path+file)
      // console.log(error)
      return
    }
    
    // Success
    // console.log("Read Text File", path+file)
    cb(data)
  })
}
async function writeText(path, file, text) {

  // Write
  try {
    await fs.promises.writeFile(path+file, text)
    console.log("Write File Error", path+file)
  }
  
  // Error
  catch (error) {

    // Path didn't exist, Create it then write the file
    if (error?.code === "ENOENT") {
      console.log("Write File Error", "path doesn't exist", path+file)
      makeDir(path).then(() => {
        writeText(path, file, text)
        return
      })
    }

    // Other Error
    console.log("Write File Error", path)
    console.log(error)
    return
  }

}
async function appendText(path, file, text) {

  // Write
  try {
    await fs.promises.appendFile(path+file, text)
    console.log("Append Text to File", path+file)
  }
  
  // Error
  catch (error) {

    // Path didn't exist, Create it then write the file
    if (error?.code === "ENOENT") {
      console.log("Append Text Error", "path doesn't exist", path+file)
      makeDir(path).then(() => {
        appendText(path, file, text)
        return
      })
    }

    // Other Error
    console.log("Append Text Error", path)
    console.log(error)
    return
  }

}
function readJSON(path, file, cb) {
  fs.readFile(path+file, (error, data) => {

    // Error
    if (error) {
      console.log("Read File Error", path+file)
      // console.log(error)
      return
    }
    
    // Success
    // console.log("Read JSON File", path+file)
    let json = JSON.parse(data)
    cb(json)
  })
}
async function writeJSON(path, file, obj) {
  
  // Write
  try {
    const json = JSON.stringify(obj, null, 2)
    await fs.promises.writeFile(path+file, json)
    console.log("Wrote JSON File", path+file)
  }
  
  // Error
  catch (error) {

    // Path didn't exist, Create it then write the file
    if (error?.code === "ENOENT") {
      console.log("Write File Error", "path doesn't exist", path+file)
      makeDir(path).then(() => {
        writeJSON(path, file, obj)
        return
      })
    }

    // Other Error
    console.log("Make Directory Error", path)
    console.log(error)
    return
  }

}
async function makeDir(path) {
  
  // Make
  try {
    await fs.promises.mkdir(path, { recursive: true })
    console.log("Make Directory", path)
  }
  
  // Error
  catch (error) {
    console.log("Make Directory Error", path)
    console.log(error)
    return
  }

}

// ----------------------------------------------------------------

// writeJSON("../public/test/", "test.json", { 
//   name: 'Mike',
//   age: 24, 
//   gender: 'Male',
//   department: 'English',
//   car: 'Honda' 
// })

// readJSON("../public/test/", "test.json", json => {
//   console.log("json", json)
// })

// appendText("../public/test/go/ddd/", "example.log", "test other \n")

// readText("../public/logs/", "example.log", async text => {
//   console.log(text)
//   await writeText("../public/test/", "example.log", text)
//   await appendText("../public/test/", "example.log", "test other \n")
// })
  
// writeJSON("../public/test/1/2/", "test.json", { 
//   name: 'John',
//   age: 29, 
//   gender: 'Male',
//   department: 'English',
//   car: 'Honda' 
// })

// makeDir("../public/test/super/path")


