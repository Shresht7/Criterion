//  Library
import * as assert from 'assert'

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