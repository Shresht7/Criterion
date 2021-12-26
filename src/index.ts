//  Library
import * as fs from 'fs'
import * as path from 'path'
import * as assert from 'assert'

//  Type Definitions
type callbackFn = () => void
type test = { name: string, callback: callbackFn }

//  ========
//  CRITERIA
//  ========

/** Test Suite */
class Criteria {

    /** Name of the test suite */
    private readonly name: string = ''
    private readonly header: string = ''

    //  Results
    private successes = 0
    private failures = 0
    private total = 0

    /** Collection of all tests in this suite */
    tests: test[] = []

    constructor(name: string) {
        this.name = name
        this.header = `   \u001b[1m\u001b[7m${this.name}\u001b[21m\u001b[27m   `
    }

    /**
     * Register a test to this suite
     * @param name Test description/name
     * @param callback Callback function
     */
    test = (name: string, callback: () => void) => { this.tests.push({ name, callback }); return this }
    /**
     * Register a test to this suite
     * @param name Test description/name
     * @param callback Callback function
     */
    spec = this.test
    /**
     * Register a test to this suite
     * @param name Test description/name
     * @param callback Callback function
     */
    it = this.test

    /** Runs all tests in this suite */
    run = () => {

        console.log(this.header)

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

        console.log('\n' + this.getResults() + '\n')
    }

    /** Returns a formatted string that shows the number of test successes, failures and total */
    getResults = () => {
        let results = ''
        results += `\u001b[1m${this.successes}\u001b[21m `
        results += `\u001b[32mpassed\u001b[39m`
        results += this.failures ? ` (\u001b[1m${this.failures}\u001b[21m \u001b[31mfailed\u001b[39m) ` : ' '
        results += 'out of '
        results += `\u001b[1m${this.total}\u001b21m `
        results += 'total'
        return results
    }
}

//  ===========
//  EXPECTATION
//  ===========

/**
 * Chainable wrapper around Node's assertion library
 * @param actual Actual value to test
 */
export function expect<T>(actual: T) {

    let matchers = {
        toDeepEqual: <U>(expected: U) => {
            assert.deepEqual(actual, expected)
            return matchers
        },
        toEqual: <U>(expected: U) => {
            assert.equal(actual, expected)
            return matchers
        },
        toBeOkay: () => {
            assert.ok(actual)
            return matchers
        },
        toBeOfType: (type: 'string' | 'number' | 'boolean' | 'function' | 'bigint' | 'symbol' | 'undefined' | 'object') => {
            assert.ok(typeof actual === type)
            return matchers
        },
        toMatch: (expected: RegExp) => {
            if (typeof actual !== 'string') { assert.fail('Not a string') }
            assert.match(actual, expected)
            return matchers
        },
        not: {
            toDeepEqual: <U>(expected: U) => {
                assert.notDeepEqual(actual, expected)
                return matchers
            },
            toEqual: <U>(expected: U) => {
                assert.notEqual(actual, expected)
                return matchers
            },
            toBeOkay: () => {
                assert.ok(!actual)
                return matchers
            },
            toMatch: (expected: RegExp) => {
                if (typeof actual !== 'string') { assert.fail('Not a string') }
                assert.doesNotMatch(actual, expected)
                return matchers
            }
        }
    }

    //TODO: Implement functions and promise matchers

    return matchers
}

//  ====
//  MAIN
//  ====

//  ------------------------------------
const MAIN = new Map<string, Criteria>()
//  ------------------------------------

/** Register a new test suite */
export function criteria(name: string) {
    const _criteria = new Criteria(name)
    MAIN.set(name, _criteria)
    return _criteria
}

/** File-extensions to look for tests */
const fileExtension = /\.(test|spec)\.(ts|js)$/

/** Script's Main Function */
function main() {
    //  Walk over the current directory and require all test files
    walkDir(process.cwd(), (x) => {
        if (fileExtension.test(x)) {
            console.log('loading ' + x)
            require(x)
        }
    })

    //  Iterate over the map and run all test suites
    for (const [_, criteria] of MAIN) {
        criteria.run()
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