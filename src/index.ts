//  Library
import Criteria from './Criteria'
import { walkDir, ansi, parseArguments } from './helpers'
import * as path from 'path'

//  Exports
export * from './expect'

//  ====
//  MAIN
//  ====

//  -----------------------
const MAIN: Criteria[] = []
//  -----------------------

/** Register a new test suite */
export function criteria(name: string) {
    const _criteria = new Criteria(name)
    MAIN.push(_criteria)
    return _criteria
}

/** File-extensions to look for tests */
const fileExtension = /\.(test|spec)\.ts$/
//TODO: #3 Eliminate redundant test runs when both .ts and .js files are preset (Ignore files using .gitignore?)
// const fileExtension = /\.(test|spec)\.(js|ts)$/

/** Script's Main Function */
function main() {

    const args = parseArguments()
    const dir = path.join(process.cwd(), args.arguments[0] || '') 

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