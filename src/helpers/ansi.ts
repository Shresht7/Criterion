//  ==========
//  ANSI CODES
//  ==========

export const ESC = '\u001b'
export const RESET = `${ESC}[0m`

/**
 * Helper function to wrap the given string with the given ansi code tuple
 * @param str Text to wrap ANSI code around
 * @param code Tuple representing the ANSI start and end codes [start, end]
 */
function wrap(str: string, code: [string, string]) { return `${code[0]}${str}${code[1]}` }

/** ANSI Code Utilities */
export const ansi = {
    /** Wraps the text in ANSI bold codes */
    bold: (str: string) => wrap(str, [`${ESC}[1m`, `${ESC}[22m`]),
    /** Wraps the text in ANSI inverse codes */
    inverse: (str: string) => wrap(str, [`${ESC}[7m`, `${ESC}[27m`]),
    /** Returns a curried function that inturn wraps a text in n whitespaces */
    pad: (n: number = 1) => (str: string) => wrap(str, [' '.repeat(n), ' '.repeat(n)]),
    /** Returns a curried function that inturn wraps a text in n newlines */
    margin: (n: number = 1) => (str: string) => wrap(str, ['\n'.repeat(n), '\n'.repeat(n)]),
    /** Wraps the text in ANSI green codes */
    green: (str: string) => wrap(str, [`${ESC}[32m`, `${ESC}[39m`]),
    /** Wraps the text in ANSI red codes */
    red: (str: string) => wrap(str, [`${ESC}[31m`, `${ESC}[39m`]),
}
