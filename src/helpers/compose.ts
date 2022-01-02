//  ====================
//  FUNCTION COMPOSITION
//  ====================

/** Function composition utility */
export function compose(...fns: Function[]) {
    return (str: string) => fns.reduceRight((acc, currFn) => {
        //  If currFn is a curried function (like pad and margin in this case) then pass in the default of 1 and pipe forward
        if (typeof currFn(1) === 'function') { currFn = currFn(1) }
        //  Return the accumulated result
        return currFn(acc)
    }, str)
}