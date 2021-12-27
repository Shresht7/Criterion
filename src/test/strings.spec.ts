//  Library
import { criteria } from '../'
import * as assert from 'assert'

//  Random functions to test
const capitalize = (str: string) => str[0].toUpperCase() + str.slice(1)
const hyphenate = (str: string) => str.replace(/([A-Z])/, '-$1').toLowerCase()

let str = 'Hello World'
let count = 0

criteria('STRINGS')
    .beforeEach(() => str = 'helloWorld')

    .test('Capitalize', () => assert.deepEqual(capitalize(str), 'HelloWorld'))
    .test('Hyphenate', () => assert.deepEqual(hyphenate(str), 'hello-world'))

    .afterEach(() => console.log(++count))
    .afterEach(() => console.log(`The count is ${count}`))