//  Library
import * as fs from 'fs'
import * as path from 'path'
import * as assert from 'assert'

//  Type Definitions
type test = { name: string, callback: () => void }

//  ================
//  HELPER FUNCTIONS
//  ================

//  WALK DIRECTORY
//  ==============

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

//  ANSI CODES
//  ==========

const ESC = '\u001b'
const RESET = `${ESC}[0m`

/**
 * Helper function to wrap the given string with the given ansi code tuple
 * @param str Text to wrap ANSI code around
 * @param code Tuple representing the ANSI start and end codes [start, end]
 */
function wrap(str: string, code: [string, string]) { return `${code[0]}${str}${code[1]}` }

/** ANSI Code Utilities */
const ansi = {
    /** Wraps the text in ANSI bold codes */
    bold: (str: string) => wrap(str, [`${ESC}[1m`, `${ESC}[22m`]),
    /** Wraps the text in ANSI inverse codes */
    inverse: (str: string) => wrap(str, [`${ESC}[7m`, `${ESC}[27m`]),
    /** Returns a curried function that inturn wraps a text in n whitespaces */
    pad: (n: number = 1) => (str: string) => wrap(str, [' '.repeat(n), ' '.repeat(n)]),
    /** Returns a curried function that inturn wraps a text in n newlines */
    margin: (n: number = 1) => (str: string) => wrap(str, ['\n'.repeat(n), '\n'.repeat(n)]),
    /** Returns a curried function that inturn indents the text by n times 4 spaces */
    indent: (n: number = 0) => (str: string) => (n > 0 ? '    '.repeat(n) : '') + str,
    /** Wraps the text in ANSI green codes */
    green: (str: string) => wrap(str, [`${ESC}[32m`, `${ESC}[39m`]),
    /** Wraps the text in ANSI red codes */
    red: (str: string) => wrap(str, [`${ESC}[31m`, `${ESC}[39m`]),
}

/** Function composition utility */
function compose(...fns: Function[]) {
    return (str: string) => fns.reduceRight((acc, currFn) => {
        //  If currFn is a curried function (like pad and margin in this case) then pass in the default of 1 and pipe forward
        if (typeof currFn(1) === 'function') { currFn = currFn(1) }
        //  Return the accumulated result
        return currFn(acc)
    }, str)
}

//  ========
//  CRITERIA
//  ========

/** Test Suite */
class Criteria {

    /** Name of the test suite */
    private readonly name: string = ''
    private readonly header: string = ''
    private readonly level: number = -1

    //  Results
    private successes = 0
    private failures = 0
    private total = 0

    /** Collection of all tests in this suite */
    tests: test[] = []
    subcriteria: Criteria[] = []

    constructor(name: string, level: number = -1) {
        this.name = name
        this.level = level
        this.header = compose(ansi.margin, ansi.indent(this.level), ansi.bold, ansi.inverse, ansi.pad(3))(this.name)
    }

    /**
     * Creates a new sub-criteria
     * @param name Criteria name or description
     * @returns SubCriteria
     */
    criteria = (name: string) => {
        const subCriteria = new Criteria(name, this.level + 1)
        this.subcriteria.push(subCriteria)
        return subCriteria
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

        if (this.tests?.length) {

            console.log(this.header)

            this.tests.forEach(test => {
                //  Try to run the test
                try {
                    test.callback()
                    //  If the callback doesn't throw an exception, report success
                    console.log(ansi.indent(this.level)(`  ✅ ${test.name}`))
                    this.successes++
                } catch (e) {
                    const error = e as Error
                    //  If exception then report failure and log the error stack
                    console.error(ansi.indent(this.level)(` ❌ ${test.name}`))
                    console.error(error.stack)
                    this.failures++
                } finally {
                    this.total++
                }
            })

            console.log(this.getResults())

        }

        //  Run all sub-criteria
        this.subcriteria.forEach(subCriteria => subCriteria.run())
    }

    /** Returns a formatted string that shows the number of test successes, failures and total */
    getResults = () => {
        let results = ''
        results += ansi.indent(this.level)(results)
        results += ansi.bold(this.successes.toString()) + ' '
        results += ansi.green('passed')
        results += this.failures ? `(${ansi.bold(this.failures.toString())} ${ansi.red('failed')})` : ' '
        results += 'out of '
        results += ansi.bold(this.total.toString()) + ' '
        results += 'total'
        results += RESET
        results = ansi.margin(1)(results)
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

//  -------------------------------------
const CRITERIA = new Criteria('CRITERIA')
//  -------------------------------------

/** Register a new test suite */
export function criteria(name: string) {
    return CRITERIA.criteria(name)
}

/** Register new test */
export function test(name: string, callback: () => void) {
    return CRITERIA.test(name, callback)
}

/** File-extensions to look for tests */
const fileExtension = /\.(test|spec)\.ts$/
//TODO: Eliminate redundant test runs when both .ts and .js files are preset (Ignore files using .gitignore?)
// const fileExtension = /\.(test|spec)\.(js|ts)$/

/** Script's Main Function */
function main() {
    //  Walk over the current directory and require all test files
    const done: string[] = []
    walkDir(process.cwd(), (x) => {
        if (fileExtension.test(x)) {
            const fileName = path.basename(x).replace(fileExtension, '')
            if (!fileName || done.includes(fileName)) { return }    //  If a test with the same fileName is already done then skip it
            done.push(fileName)
            console.log('loading: ' + x.replace(fileName, ansi.bold(fileName)))
            require(x)
        }
    })

    //  Iterate over the map and run all test suites
    CRITERIA.run()
}

main()