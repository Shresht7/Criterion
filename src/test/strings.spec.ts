import { suite } from '../'
import * as assert from 'assert'

const capitalize = (str: string) => str[0].toUpperCase() + str.slice(1)

suite('STRINGS')
    .test('Capitalize', () => assert.deepEqual(capitalize('myTest'), 'MyTest'))