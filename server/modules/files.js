// Overview: os file operations
// Don't require logger.js since it requires this file

// Todos
// Add tests

// Imports
import fs from 'fs/promises'

// Exports
export {
    getStatsRaw,
    getStats,
    getStatsRecursive,

    readText,
    readJSON,
    writeText,
    appendText,
    writeJSON,

    makeDir,
    deleteFile,
    deleteFolder,
    rename,
    exists,
}

// Functions
async function getStatsRaw(path) {
    try {
        const statsRaw = await fs.stat(path)
        // console.debug(`getStatsRaw(${path})`, statsRaw)
        return statsRaw
    }
    catch (error) {
        if (error?.code === "ENOENT") {
            // console.error(`getStatsRaw(${path})`, "error path doesn't exist")
            return
        }
        // console.error(`getStatsRaw(${path})`, error)
        return
    }
}
async function getStats(path) {
    try {
        const statsRaw = await fs.stat(path)
        // console.debug(`getStats(${path})`)

        // Create stats object
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

        // Add files and folders if path was a folder
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
    catch (error) {
        if (error?.code === "ENOENT") {
            // console.error(`getStats(${path}) ERROR path doesn't exist`)
            return
        }
        // console.error(`getStats(${path}) ERROR`)
        return
    }
}
async function getStatsRecursive(path) {
    try {
        const statsRaw = await fs.stat(path)
        // console.debug(`getStats(${path})`)

        // Create stats object
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

        // Add files and folders if path was a folder recursively 
        if (stats.isFolder) {
            const files = await fs.readdir(path)
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
    catch (error) {
        if (error?.code === "ENOENT") {
            // console.error(`getStatsRecursive(${path})`, "error path doesn't exist")
            return
        }
        // console.error(`getStatsRecursive(${path})`, error)
        return
    }
}
async function readText(path) {
    try {
        const file = await fs.readFile(path, 'utf-8')
        // console.debug(`readText(${path})`)
        return file
    }
    catch (error) {
        if (error?.code === "ENOENT") {
            // console.error(`readText(${path})`, "error path doesn't exist")
            return
        }
        // console.error(`readText(${path})`, error)
        return
    }
}
async function readJSON(path) {
    try {
        const file = await fs.readFile(path)
        // console.debug(`readJSON(${path})`)
        try {
            return JSON.parse(file)
        }
        catch (error) {
            // return console.error(`readJSON(${path}) ERROR not JSON`)
        }
    }
    catch (error) {
        if (error?.code === "ENOENT") {
            // console.error(`readJSON(${path})`, "error path doesn't exist")
            return
        }
        // console.error(`readJSON(${path})`, error)
        return
    }
}
async function writeText(path, text) {
    try {
        await fs.writeFile(path, text)
        // console.debug(`writeText(${path}, text...)`, text)
    }
    catch (error) {
        if (error?.code === "ENOENT") {
            // console.info(`writeText(${path}, text...)`, "path doesn't exist. creating path...")
            await makeDir(path.slice(0, path.lastIndexOf('/')) + "/")
            await writeText(path, text)
            return
        }
        // console.error(`writeText(${path}, text...)`, error)
        return
    }
}
async function appendText(path, text) {
    try {
        await fs.appendFile(path, text)
        // console.debug(`appendText(${path}, text...)`, text)
    }
    catch (error) {
        if (error?.code === "ENOENT") {
            // console.info(`appendText(${path}, text...)`, "path doesn't exist. creating path...")
            await makeDir(path.slice(0, path.lastIndexOf('/')) + "/")
            await appendText(path, text)
            return
        }
        // console.error(`appendText(${path}, ...) ERROR`)
        return
    }
}
async function writeJSON(path, obj) {
    try {
        const json = JSON.stringify(obj, null, 2)
        await fs.writeFile(path, json)
        // console.debug(`writeJSON(${path}, obj...)`, obj)
    }
    catch (error) {
        if (error?.code === "ENOENT") {
            // console.info(`writeJSON(${path}, obj...)`, "path doesn't exist. creating path...")
            await makeDir(path.slice(0, path.lastIndexOf('/')) + "/")
            await writeJSON(path, obj)
            return
        }
        // console.error(`writeJSON(${path}, obj...)`, error)
        return
    }
}
async function makeDir(path) {
    try {
        await fs.mkdir(path, { recursive: true })
        // console.debug(`makeDir(${path})`)
    }
    catch (error) {
        // console.error(`makeDir(${path})`, error)
    }
}
async function deleteFile(path) {
    try {
        await fs.rm(path)
        // console.debug(`deleteFile(${path})`)
    }
    catch (error) {
        if (error?.code === "ENOENT") {
            // console.error(`deleteFile(${path})`, "error path doesn't exist")
            return
        }
        // console.error(`deleteFile(${path})`, error)
    }
}
async function deleteFolder(path) {
    try {
        await fs.rmdir(path, { recursive: true })
        // console.debug(`deleteFolder(${path})`)
    }
    catch (error) {
        if (error?.code === "ENOENT") {
            // console.error(`deleteFolder(${path})`, "error path doesn't exist")
            return
        }
        // console.error(`deleteFolder(${path})`, error)
    }
}
async function rename(oldPath, newPath) {
    try {
        await fs.rename(oldPath, newPath)
        // console.debug(`rename(${oldPath}, ${newPath})`)
    }
    catch (error) {
        if (error?.code === "ENOENT") {
            // console.error(`rename(${oldPath}, ${newPath})`, "error path doesn't exist")
            if (await exists(oldPath)) {
                await makeDir(newPath.slice(0, newPath.lastIndexOf('/')) + "/")
                await rename(oldPath, newPath)
            }
            // console.error(`rename(${oldPath}, ${newPath})`, error)
        }
        else {
            // console.error(`rename(${oldPath}, ${newPath})`, error)
        }
    }
}
async function exists(path) {
    try {
        const stat = await fs.stat(path)
        // console.debug(`exists(${path})`)
        return true
    }
    catch (error) {
        // console.error(`exists(${path})`, error)
        return false
    }
}

// Tests
if (process.env.DEV_MODE) await runTests("auth.js")
async function runTests(testName) {
    // getStats("../docs")
    //   .then(stats => writeJSON("../DELETE_ME/test1.json", stats))
    
    // getStatsRecursive("../docs")
    //   .then(stats => writeJSON("../DELETE_ME/test2.json", stats))
    
    // writeJSON("../DELETE_ME/test3.json", { 
    //   name: 'Mike',
    //   age: 24, 
    //   gender: 'Male',
    //   department: 'English',
    //   car: 'Honda' 
    // })
    
    // readJSON("../DELETE_ME/test.json")
    //   .then(json => console.log(json))
    
    // appendText("../DELETE_ME/go/ddd/example.log", "test other \n")
    
    // readText("../logs/example.log").then(async text => {
    //   log(text)
    //   await writeText("../DELETE_ME/example.log", text)
    //   await appendText("../DELETE_ME/example.log", "test others \n")
    // })
    
    // writeJSON("../DELETE_ME/1/2/test.json", { 
    //   name: 'John',
    //   age: 29, 
    //   gender: 'Male',
    //   department: 'English',
    //   car: 'Honda' 
    // })
    
    // makeDir("../DELETE_ME/super/path/")
    // makeDir("../DELETE_ME/super/path2")
    
    // exists("../DELETE_ME/1/2/test.json")
    //   .then(bool => console.log(bool))
    
    // rename("../DELETE_ME/1/2/test.json", "../DELETE_ME/1/test.json")
    // rename("../DELETE_ME/1/2/test.json", "../DELETE_ME/1/3/test.json")
    
    // deleteFile("../DELETE_ME/example.log")
    
    // deleteFolder("../DELETE_ME/")
}
