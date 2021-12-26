import { criteria, expect } from '../'
import * as assert from 'assert'

const add = (x: number, y: number) => x + y
const subtract = (x: number, y: number) => x - y
const multiply = (x: number, y: number) => x * y
const divide = (x: number, y: number) => x / y

criteria('MATH')
    .test('Addition', () => assert.deepEqual(add(2, 3), 5))
    .test('Subtraction', () => assert.deepEqual(subtract(2, 3), -1))
    .test('Multiplication', () => assert.deepEqual(multiply(2, 3), 6))
    .test('Division', () => {
        expect(divide(3, 2))
            .toBeOkay()
            .toBeOfType('number')
            .toEqual(3 / 2)
    })
    .criteria('NEW')
    .test('Test 1', () => assert.ok(true))
    .test('Test 2', () => assert.ok(true))
    .criteria('OLD')
    .test('Test 3', () => assert.ok(true))