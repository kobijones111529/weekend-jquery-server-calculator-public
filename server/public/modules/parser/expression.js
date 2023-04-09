import * as parser from '../parser.js'

export const digit = parser.one(c => /^[0-9]$/.test(c))

export const number =
  parser
    .some(c => /^[0-9]$/.test(c))
    .map(arr => Number(arr.join('')))

export const add = parser.one(c => c === '+')

export const multiply = parser.one(c => c === '*')

// export const expression = number.apply(
//   multiply.or(() => add).map(op => left =>
//     [left, op]
//   )
// ).apply(
//   number.map(right => ([left, op]) =>
//     [left, op, right]
//   )
// )

export const inParens = p =>
  parser
    .one(c => c === '(')
    .prefixOf(() => p)
    .withSuffix(() => parser.one(c => c === ')'))

export const expression =
  number
    .or(() => inParens(expression))
    .withSuffix(() => add)
    .many()
    .apply(() => number.or(() => inParens(expression)).map(last => rest => [...rest, last]))
