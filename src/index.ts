//  Library
import * as fs from 'fs'
import * as path from 'path'

//  CLI-Tools
import { ansi } from 'cli-tools'
const { bold, inverse, green, red, white } = ansi

//  Type Definitions
type test = { name: string, callback: () => void }

/** Test Suite */
class Suite {
    private readonly name: string = ''

    private successes = 0
    private failures = 0
    private total = 0

    /** Collection of all tests in this suite */
    tests: test[] = []

    constructor(name: string) {
        this.name = name
    }

    /**
     * Registers a test to this suite
     * @param name Test description or name
     * @param callback Callback function to test
     */
    test = (name: string, callback: () => void) => { this.tests.push({ name, callback }); return this }
    spec = this.test
    it = this.test

    /** Runs all tests in this suite */
    run = () => {

        console.log('\n' + inverse(bold(`  ${this.name}  `)) + '\n')

        this.tests.forEach(test => {
            //  Try to run the test
            try {
                test.callback()
                //  If the callback doesn't throw an exception, report success
                console.log(`  ✅ ${test.name}`)
                this.successes++
            } catch (e) {
                const error = e as Error
                //  If exception then report failure and log the error stack
                console.error(`❌ ${test.name}`)
                console.error(error.stack)
                this.failures++
            } finally {
                this.total++
            }
        })

        console.log(`\n${bold(this.successes.toString())} ${green('passed')} out of ${bold(this.total.toString())} total\n`)
        this.failures && console.log(`(${bold(this.failures.toString())} ${red('failed')})`)
    }
}

//  ====
//  MAIN
//  ====

//  ---------------------------------
const MAIN = new Map<string, Suite>()
//  ---------------------------------

/** Register a new test suite */
export function suite(name: string) {
    const _suite = new Suite(name)
    MAIN.set(name, _suite)
    return _suite
}

/** File-extensions to look for tests */
const fileExtensions = [
    '.test.js',
    '.spec.js',
    '.test.ts',
    '.spec.ts',
]

/** Script's Main Function */
function main() {
    //  Walk over the current directory and require all test files
    walkDir(process.cwd(), (x) => {
        if (fileExtensions.some(ext => x.includes(ext))) {
            require(x)
        }
    })

    //  Iterate over the map and run all test suites
    for (const [_, suite] of MAIN) {
        suite.run()
    }
}

main()

//  ================
//  HELPER FUNCTIONS
//  ================

/**
 * Walks the provided path and executes the callback function
 * @param dir Path to directory
 * @param callback Callback function to execute for every entry
 */
function walkDir(dir: string, callback: (x: string) => void) {
    fs.readdirSync(dir).forEach(f => {
        const dirPath = path.join(dir, f)
        const isDirectory = fs.statSync(dirPath).isDirectory()
        isDirectory
            ? walkDir(dirPath, callback)
            : callback(path.join(dir, f))
    })
}

/** Helper function to time code execution */
function snapshot(now: number = Date.now()) {
    return () => (Date.now() - now).toFixed(2) + 'ms'
}
