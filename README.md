# Criteria
----------

A super-simple bare minimum test framework.

<!-- 
## Installation

Currently N/A
-->

## Usage

```ts
import { criteria } from 'criteria'
import * as assert from 'assert'    //  Node's builtin assert module

//  Random functions to test
const capitalize = (str: string) => str[0].toUpperCase() + str.slice(1)
const hyphenate = (str: string) => str.replace(/([A-Z])/, '-$1').toLowerCase()

let str = 'Hello World'
let count = 0

criteria('String Helpers')
    .beforeEach(() => str = 'helloWorld')

    .test('Capitalize', () => assert.deepEqual(capitalize(str), 'HelloWorld'))
    .test('Hyphenate', () => assert.deepEqual(hyphenate(str), 'hello-world'))

    .afterEach(() => console.log(`The count is ${++count}`))
```

## Expect

`expect` is a chainable wrapper around Node's `assert` that allows you to add multiple validation criteria to a single statement.

```ts
import { criteria, expect } from 'criteria'

const divide = (x: number, y: number) => x / y

criteria('Division')
    .test('x divided by y', () => {
        expect(divide(4, 2))
            .toBeOkay()
            .toBeOfType('number')
            .toEqual(2)
    })
```