const fs = require('fs').promises

// Helper Functions
function log(...params) { if (false) console.log("file_system.js |", ...params) }
function err(...params) { if (true) console.error("ERROR | file_system.js |", ...params) }

// Functions
async function getStatsRaw(path) {
  
  // Write
  try {
    const statsRaw = await fs.stat(path)
    log(`getStatsRaw(${path})`)
    return statsRaw
  }
  
  // Error
  catch (error) {

    // Path didn't exist, Create it then write the file
    if (error?.code === "ENOENT") {
      err(`getStatsRaw(${path}) ERROR path doesn't exist`)
      return
    }

    // Other Error
    err(`getStatsRaw(${path}) ERROR`)
    err(error)
    return

  }

}
async function getStats(path) {
  
  // Write
  try {
    const statsRaw = await fs.stat(path)
    log(`getStats(${path})`)

    if (statsRaw.isDirectory() && path.slice(-1) !== "/") path += "/"
    const path_folder = path.slice(0, path.lastIndexOf('/')) + "/"
    const path_up = path_folder.slice(0, path_folder.slice(0, -1).lastIndexOf('/')) + "/"
    const file_name = path.slice(path.lastIndexOf('/') + 1)
    const folder_name = "/" + path_folder.slice(path_folder.slice(0, -1).lastIndexOf('/') + 1).slice(0, -1)
    const stats = {
      path: path,
      path_folder: path_folder,
      path_up: path_up,
      file_name: statsRaw.isDirectory() ? "/" + file_name : file_name,
      folder_name: folder_name,
      isFile: statsRaw.isFile(),
      isFolder: statsRaw.isDirectory(),
      size_bytes: statsRaw.size,
      created_iso: statsRaw.birthtime,
      accessed_iso: statsRaw.atime,
      modified_iso: statsRaw.mtime,
      changed_status_iso: statsRaw.ctime,
      contains_files: [],
      contains_folders: []
    }

    if (stats.isFolder) {
      const files = await fs.readdir(path)
      for (const file of files) {
        const path2 = `${path}${file}`
        const fileStats = await fs.stat(path2)
        const path_folder2 = path2.slice(0, path2.lastIndexOf('/')) + "/"
        const path_up2 = path_folder2.slice(0, path_folder2.slice(0, -1).lastIndexOf('/')) + "/"
        const file_name2 = path2.slice(path2.lastIndexOf('/') + 1)
        const folder_name2 = "/" + path_folder2.slice(path_folder2.slice(0, -1).lastIndexOf('/') + 1).slice(0, -1)
        const stats2 = {
          path: path2,
          path_folder: path_folder2,
          path_up: path_up2,
          file_name: fileStats.isDirectory() ? "/" + file_name2 : file_name2,
          folder_name: folder_name2,
          isFile: fileStats.isFile(),
          isFolder: fileStats.isDirectory(),
          size_bytes: fileStats.size,
          created_iso: fileStats.birthtime,
          accessed_iso: fileStats.atime,
          modified_iso: fileStats.mtime,
          changed_status_iso: fileStats.ctime,
          contains_files: [],
          contains_folders: []
        }
  
        // Folder
        if (stats2.isFolder) {
          stats.contains_folders.push(stats2)
        }
  
        // File
        else {
          stats.contains_files.push(stats2)
        }
      }
    }

    return stats
  }

  // Error
  catch (error) {

    // Path didn't exist, Create it then write the file
    if (error?.code === "ENOENT") {
      err(`getStats(${path}) ERROR path doesn't exist`)
      return
    }

    // Other Error
    err(`getStats(${path}) ERROR`)
    err(error)
    return

  }

}
async function getStatsRecursive(path) {
  
  // Write
  try {
    const statsRaw = await fs.stat(path)
    log(`getStats(${path})`)

    if (statsRaw.isDirectory() && path.slice(-1) !== "/") path += "/"
    const path_folder = path.slice(0, path.lastIndexOf('/')) + "/"
    const path_up = path_folder.slice(0, path_folder.slice(0, -1).lastIndexOf('/')) + "/"
    const file_name = path.slice(path.lastIndexOf('/') + 1)
    const folder_name = "/" + path_folder.slice(path_folder.slice(0, -1).lastIndexOf('/') + 1).slice(0, -1)
    const stats = {
      path: path,
      path_folder: path_folder,
      path_up: path_up,
      file_name: statsRaw.isDirectory() ? "/" + file_name : file_name,
      folder_name: folder_name,
      isFile: statsRaw.isFile(),
      isFolder: statsRaw.isDirectory(),
      size_bytes: statsRaw.size,
      created_iso: statsRaw.birthtime,
      accessed_iso: statsRaw.atime,
      modified_iso: statsRaw.mtime,
      changed_status_iso: statsRaw.ctime,
      contains_files: [],
      contains_folders: []
    }

    if (stats.isFolder) {
      const files = await fs.readdir(path)
      // console.log(files)
      for (const file of files) {
        const fileStats = await getStatsRecursive(`${path}${file}`)

        // Folder
        if (fileStats.isFolder) {
          stats.contains_folders.push(fileStats)
        }

        // File
        else {
          stats.contains_files.push(fileStats)
        }
      }
    }

    return stats
  }
  
  // Error
  catch (error) {

    // Path didn't exist, Create it then write the file
    if (error?.code === "ENOENT") {
      err(`getStats(${path}) ERROR path doesn't exist`)
      return
    }

    // Other Error
    err(`getStats(${path}) ERROR`)
    err(error)
    return

  }

}
async function readText(path) {

  // Write
  try {
    const file = await fs.readFile(path, 'utf-8')
    log(`readText(${path})`)
    return file
  }
  
  // Error
  catch (error) {

    // Path didn't exist, Create it then write the file
    if (error?.code === "ENOENT") {
      err(`readText(${path}) ERROR path doesn't exist`)
      return
    }

    // Other Error
    err(`readText(${path}) ERROR`)
    err(error)
    return

  }

}
async function readJSON(path) {

  // Write
  try {
    const file = await fs.readFile(path)
    log(`readJSON(${path})`)

    try { return JSON.parse(file) }
    catch (error) { return err(`readJSON(${path}) ERROR not JSON`) }
  }
  
  // Error
  catch (error) {

    // Path didn't exist, Create it then write the file
    if (error?.code === "ENOENT") {
      err(`readJSON(${path}) ERROR path doesn't exist`)
      return
    }

    // Other Error
    err(`readJSON(${path}) ERROR`)
    err(error)
    return

  }

}
async function writeText(path, text) {

  // Write
  try {
    await fs.writeFile(path, text)
    log(`writeText(${path}, ...)`)
  }
  
  // Error
  catch (error) {

    // Path didn't exist, Create it then write the file
    if (error?.code === "ENOENT") {
      log(`writeText(${path}, ...) ERROR path doesn't exist. Creating path...`)
      await makeDir(path.slice(0, path.lastIndexOf('/')) + "/")
      await writeText(path, text)
      return
    }

    // Other Error
    err(`writeText(${path}, ...) ERROR`)
    err(error)
    return

  }

}
async function appendText(path, text) {

  // Write
  try {
    await fs.appendFile(path, text)
    log(`appendText(${path}, ...)`)
  }
  
  // Error
  catch (error) {

    // Path didn't exist, Create it then write the file
    if (error?.code === "ENOENT") {
      log(`appendText(${path}, ...) ERROR path doesn't exist. Creating path...`)
      await makeDir(path.slice(0, path.lastIndexOf('/')) + "/")
      await appendText(path, text)
      return
    }

    // Other Error
    err(`appendText(${path}, ...) ERROR`)
    err(error)
    return

  }

}
async function writeJSON(path, obj) {
  
  // Write
  try {
    const json = JSON.stringify(obj, null, 2)
    await fs.writeFile(path, json)
    log(`writeJSON(${path}, ...)`)
  }
  
  // Error
  catch (error) {

    // Path didn't exist, Create it then write the file
    if (error?.code === "ENOENT") {
      log(`writeJSON(${path}, ...) ERROR path doesn't exist. Creating path...`)
      await makeDir(path.slice(0, path.lastIndexOf('/')) + "/")
      await writeJSON(path, obj)
      return
    }

    // Other Error
    err(`writeJSON(${path}, ...) ERROR`)
    err(error)
    return

  }

}
async function makeDir(path) {
  
  // Make Directory
  try {
    await fs.mkdir(path, { recursive: true })
    log(`makeDir(${path})`)
  }
  
  // Error
  catch (error) {
    err(`makeDir(${path}) ERROR`)
    err(error)
  }

}
async function deleteFile(path) {
  
  // Make Directory
  try {
    await fs.rm(path)
    log(`deleteFile(${path})`)
  }
  
  // Error
  catch (error) {
    if (error?.code === "ENOENT") {
      log(`deleteFile(${path}) ERROR path doesn't exist`)
    }
    else {
      err(`deleteFile(${path}) ERROR`)
      err(error)
    }
  }

}
async function deleteFolder(path) {
  
  // Make Directory
  try {
    await fs.rmdir(path, { recursive: true })
    log(`deleteFolder(${path})`)
  }
  
  // Error
  catch (error) {
    if (error?.code === "ENOENT") {
      log(`deleteFolder(${path}) ERROR path doesn't exist`)
    }
    else {
      err(`deleteFolder(${path}) ERROR`)
      err(error)
    }
  }

}
async function rename(oldPath, newPath) {
  
  // Make Directory
  try {
    await fs.rename(oldPath, newPath)
    log(`rename(${oldPath}, ${newPath})`)
  }
  
  // Error
  catch (error) {
    if (error?.code === "ENOENT") {
      err(`rename(${oldPath}, ${newPath}) ERROR path doesn't exist`)
      if (await exists(oldPath)) {
        console.log("exists(oldPath)", await exists(oldPath));
        await makeDir(newPath.slice(0, newPath.lastIndexOf('/')) + "/")
        await rename(oldPath, newPath)
      }
      err(error)
    }
    else {
      err(`rename(${oldPath}, ${newPath}) ERROR`)
      err(error)
    }
  }

}
async function exists(path) {
  
  // Make Directory
  try {
    const stat = await fs.stat(path)
    log(`exists(${path})`)
    return true
  }
  
  // Error
  catch (error) {
    log(`exists(${path}) ERROR`)
    log(error)
    return false
  }

}

// Export
exports.getStatsRaw = getStatsRaw
exports.getStats = getStats
exports.getStatsRecursive = getStatsRecursive
exports.readText = readText
exports.readJSON = readJSON
exports.writeText = writeText
exports.appendText = appendText
exports.writeJSON = writeJSON
exports.makeDir = makeDir
exports.deleteFile = deleteFile
exports.deleteFolder = deleteFolder
exports.rename = rename
exports.exists = exists

// ----------------------------------------------------------------

// getStats("../private/logs/example.log")
//   .then(stats => console.log(stats))

// getStats("../private/docs")
//   .then(stats => writeJSON("../private/DELETE_ME/test.json", stats))

// getStatsRecursive("../private/docs")
//   .then(stats => writeJSON("../private/DELETE_ME/test.json", stats))

// writeJSON("../private/DELETE_ME/test.json", { 
//   name: 'Mike',
//   age: 24, 
//   gender: 'Male',
//   department: 'English',
//   car: 'Honda' 
// })

// readJSON("../private/DELETE_ME/test.json")
//   .then(json => console.log(json))

// appendText("../private/DELETE_ME/go/ddd/example.log", "test other \n")

// readText("../private/logs/example.log").then(async text => {
//   log(text)
//   await writeText("../private/DELETE_ME/example.log", text)
//   await appendText("../private/DELETE_ME/example.log", "test others \n")
// })

// writeJSON("../private/DELETE_ME/1/2/test.json", { 
//   name: 'John',
//   age: 29, 
//   gender: 'Male',
//   department: 'English',
//   car: 'Honda' 
// })

// makeDir("../private/DELETE_ME/super/path/")
// makeDir("../private/DELETE_ME/super/path2")

// exists("../private/DELETE_ME/1/2/test.json")
//   .then(bool => console.log(bool))

// rename("../private/DELETE_ME/1/2/test.json", "../private/DELETE_ME/1/test.json")
// rename("../private/DELETE_ME/1/2/test.json", "../private/DELETE_ME/1/3/test.json")

// deleteFile("../private/DELETE_ME/example.log")

// deleteFolder("../private/DELETE_ME/")
