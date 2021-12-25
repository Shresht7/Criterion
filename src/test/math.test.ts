import { suite } from '../'
import * as assert from 'assert'

const add = (x: number, y: number) => x + y
const subtract = (x: number, y: number) => x - y
const multiply = (x: number, y: number) => x * y
const divide = (x: number, y: number) => x / y

suite('Math')
    .test('Addition', () => assert.deepEqual(add(2, 3), 5))
    .test('Subtraction', () => assert.deepEqual(subtract(2, 3), -1))
    .test('Multiplication', () => assert.deepEqual(multiply(2, 3), 6))
    .test('Division', () => assert.deepEqual(divide(2, 3), 2 / 3))