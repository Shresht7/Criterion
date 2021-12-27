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

    //  Results
    private successes = 0
    private failures = 0
    private total = 0

    /** Collection of all tests in this suite */
    private tests: test[] = []

    //  Setup and teardown functions
    private _beforeAll: (() => void)[] = []
    private _beforeEach: (() => void)[] = []
    private _afterEach: (() => void)[] = []
    private _afterAll: (() => void)[] = []

    constructor(name: string) {
        this.name = name
        this.header = compose(ansi.margin, ansi.bold, ansi.inverse, ansi.pad(3))(this.name)
    }

    /** Setup function before all */
    beforeAll = (callback: () => void) => { this._beforeAll.push(callback); return this }
    /** Setup function before each */
    beforeEach = (callback: () => void) => { this._beforeEach.push(callback); return this }
    /** Teardown function after each */
    afterEach = (callback: () => void) => { this._afterEach.push(callback); return this }
    /** Teardown function after all */
    afterAll = (callback: () => void) => { this._afterAll.push(callback); return this }

    /**
     * Register a test to this suite
     * @param name Test description/name
     * @param callback Callback function
     */
    test = (name: string, callback: () => void) => { this.tests.push({ name, callback }); return this }
    /**
     * Register a test to this suite (Alias for test)
     * @param name Test description/name
     * @param callback Callback function
     */
    spec = this.test
    /**
     * Register a test to this suite (Alias for test)
     * @param name Test description/name
     * @param callback Callback function
     */
    it = this.test

    /** Runs all tests in this suite */
    run = () => {
        console.log(this.header)    //  Show header

        this._beforeAll.forEach(callback => callback()) //  Setup beforeAll

        this.tests.forEach(test => {
            this._beforeEach.forEach(callback => callback())    //  Setup beforeEach

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
                this._afterEach.forEach(callback => callback())   //  Setup afterEach
                this.total++
            }
        })

        this._afterAll.forEach(callback => callback())  //  Setup afterAll

        console.log(this.getResults())  //  Show results
    }

    /** Returns a formatted string that shows the number of test successes, failures and total */
    private getResults = () => {
        let results = ''
        results += ansi.bold(this.successes.toString()) + ' '
        results += ansi.green('passed')
        results += this.failures ? ` (${ansi.bold(this.failures.toString())} ${ansi.red('failed')}) ` : ' '
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
        toBeAnInstanceOf: <T extends Function>(className: T) => {
            assert.ok(actual instanceof className)
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
    MAIN.forEach(_criteria => _criteria.run())
}

main()