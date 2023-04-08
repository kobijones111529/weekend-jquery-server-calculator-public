import $ from 'jquery'
import { InvalidInputError } from './util.js'

/**
 * Render result to DOM
 * @param {number} result Result
 */
export function renderResult (result) {
  const jqResult = $('#result')
  jqResult.text(result)
}

/**
 * Render history to DOM
 * @param {object[]} history History
 */
export function renderHistory (history) {
  /**
   * Get symbol for binary mathematic operation
   * @param {"add" | "subtract" | "multiply" | "divide"} operation Binary operation
   * @returns Symbol
   */
  const symbolFor = operation => {
    switch (operation) {
      case 'add':
        return '+'
      case 'subtract':
        return '−'
      case 'multiply':
        return '×'
      case 'divide':
        return '÷'
      default:
        throw new InvalidInputError('Invalid operation')
    }
  }

  const jqList = $('#history')
  // Clear
  jqList.empty()
  // Rerender
  history.reduce((jqList, calculation) => {
    const input = calculation.input
    const result = calculation.result
    try {
      const sybmol = symbolFor(input.operation)
      jqList.append(`
        <li>${input.left} ${sybmol} ${input.right} = ${result}</li>
      `)
    } catch (e) {
      if (e instanceof InvalidInputError) {
        jqList.append(`
          <li>Unknown operation</li>
        `)
      }
    }
    return jqList
  }, jqList)
}
