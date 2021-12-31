//  Library
import * as fs from 'fs'
import * as path from 'path'

//  ==============
//  WALK DIRECTORY
//  ==============

/**
 * Walks the provided path and executes the callback function
 * @param dir Path to directory
 * @param callback Callback function to execute for every entry
 */
export function walkDir(dir: string, callback: (x: string) => void) {
    fs.readdirSync(dir).forEach(f => {
        const dirPath = path.join(dir, f)
        const isDirectory = fs.statSync(dirPath).isDirectory()
        isDirectory
            ? walkDir(dirPath, callback)
            : callback(path.join(dir, f))
    })
}