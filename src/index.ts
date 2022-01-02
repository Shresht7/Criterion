//  Library
import Criteria from './Criteria'

//  Exports
export * from './expect'

//  ------------------------------
export const MAIN: Criteria[] = []
//  ------------------------------

/** Register a new test suite */
export function criteria(name: string) {
    const _criteria = new Criteria(name)
    MAIN.push(_criteria)
    return _criteria
}