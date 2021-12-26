import { criteria } from '../'
import * as assert from 'assert'

const capitalize = (str: string) => str[0].toUpperCase() + str.slice(1)

criteria('STRINGS')
    .test('Capitalize', () => assert.deepEqual(capitalize('myTest'), 'MyTest'))