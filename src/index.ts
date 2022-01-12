//  Library
import Criteria from './Criteria'

//  Exports
export * from './expect'

/** Register a new test suite */
export function criteria(name: string) {
    return new Criteria(name)
}