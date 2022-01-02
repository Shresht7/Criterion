//  Library
import { MAIN } from '.'
import { walkDir, ansi, parseArguments } from './helpers'
import * as path from 'path'

/** File-extensions to look for tests */
const fileExtension = /\.(test|spec)\.(js|ts)$/

//  ====
//  MAIN
//  ====

/** Script's Main Function */
function main() {

    //  Parse Command-Line Arguments
    const args = parseArguments()
    const dir = path.join(process.cwd(), args.arguments[0] || 'tests') 

    //  Walk over the current directory and require all test files
    const done: string[] = []
    walkDir(dir, (x) => {
        if (fileExtension.test(x)) {
            const fileName = path.basename(x).replace(fileExtension, '')
            if (!fileName || done.includes(fileName)) { return }    //  If a test with the same fileName is already done then skip it
            done.push(fileName)
            console.log('loading: ' + x.replace(fileName, ansi.bold(fileName)))
            require(x)
        }
    })

    //  Iterate over the map and run all test suites
    MAIN.forEach(_criteria => _criteria.run())
    
}

main()