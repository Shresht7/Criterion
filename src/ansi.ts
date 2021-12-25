//  ===============
//  TERMINAL STYLES
//  ===============

//  Exerpt from : https://github.com/Shresht7/cli-tools

const ESC = '\u001b'
const RESET = `${ESC}[0m`

type stringLike = string | number

//  HELPER FUNCTIONS
//  ================

/**
 * Wrap ANSICode around string
 * @param str text to wrap string around
 * @param tuple ansiCode tuple to wrap
 */
const wrap = (str: stringLike, tuple: [number, number]) => `${ESC}[${tuple[0]}m${str}${ESC}[${tuple[1]}m`

//  ANSI COLOR
//  ==========

type ANSIColor =
    | 'black'
    | 'red'
    | 'green'
    | 'yellow'
    | 'blue'
    | 'magenta'
    | 'cyan'
    | 'white'
    | 'default'

const color: Record<ANSIColor, [number, number]> = {
    black: [30, 39],
    red: [31, 39],
    green: [32, 39],
    yellow: [33, 39],
    blue: [34, 39],
    magenta: [35, 39],
    cyan: [36, 39],
    white: [37, 39],
    default: [39, 39],
}

/** Background offset */
const bgOffset = 10
/** Bright-color offset */
const brightOffset = 60

/**
 * Initializes ANSIColor code functions
 * @param clr ANSIColor code
 * @returns Function to apply colors
 */
const ansiColor = (clr: ANSIColor) => {
    const c = (str: stringLike) => wrap(str, color[clr])
    c.bg = (str: stringLike) => wrap(str, color[clr].map(x => x + bgOffset) as [number, number])
    c.bright = (str: stringLike) => wrap(str, color[clr].map(x => x + brightOffset) as [number, number])
    c.bgBright = (str: stringLike) => wrap(str, color[clr].map(x => x + bgOffset + brightOffset) as [number, number])
    return c
}

/** Colors the string black */
export const black = ansiColor('black')
/** Colors the string red */
export const red = ansiColor('red')
/** Colors the string green */
export const green = ansiColor('green')
/** Colors the string yellow */
export const yellow = ansiColor('yellow')
/** Colors the string blue */
export const blue = ansiColor('blue')
/** Colors the string magenta */
export const magenta = ansiColor('magenta')
/** Colors the string cyan */
export const cyan = ansiColor('cyan')
/** Colors the string white */
export const white = ansiColor('white')

/** Colors the string with the given rgb values */
export const rgb = (str: stringLike, [r, g, b]: [number, number, number]) => `${ESC}[38;2;${r};${g};${b}m${str}${RESET}`
rgb.bg = (str: stringLike, [r, g, b]: [number, number, number]) => `${ESC}[48;2;${r};${g};${b}m${str}${RESET}`

//  ANSI STYLE
//  ==========

type ANSIStyle =
    | 'bold'
    | 'faint'
    | 'italic'
    | 'underline'
    | 'blinking'
    | 'inverse'
    | 'hidden'
    | 'strikethrough'

export const style: Record<ANSIStyle, [number, number]> = {
    bold: [1, 21],
    faint: [2, 22],
    italic: [3, 23],
    underline: [4, 24],
    blinking: [5, 25],
    inverse: [7, 27],
    hidden: [8, 28],
    strikethrough: [9, 29],
}

/** Makes the string bold */
export const bold = (str: stringLike) => wrap(str, style.bold)
/** Makes the string faint */
export const faint = (str: stringLike) => wrap(str, style.faint)
/** Makes the string italic */
export const italic = (str: stringLike) => wrap(str, style.italic)
/** Makes the string underlined */
export const underline = (str: stringLike) => wrap(str, style.underline)
/** Makes the string blink */
export const blinking = (str: stringLike) => wrap(str, style.blinking)
/** Inverts the string's colors */
export const inverse = (str: stringLike) => wrap(str, style.inverse)
/** Hides the string */
export const hidden = (str: stringLike) => wrap(str, style.hidden)
/** Strikethrough a string */
export const strikethrough = (str: stringLike) => wrap(str, style.strikethrough)
/** Add padding around text */
export const pad = (str: stringLike, n: number = 1) => ' '.repeat(n) + str + ' '.repeat(n)
