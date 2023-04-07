import $ from 'jquery'

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
        throw new Error('Invalid input') // TODO make custom error class
    }
  }

  // Clear and rerender
  const jqList = $('#history')
  jqList.empty()
  history.reduce((jqList, calculation) => {
    const input = calculation.input
    const result = calculation.result
    const sybmol = symbolFor(input.operation)
    jqList.append(`
      <li>${input.left} ${sybmol} ${input.right} = ${result}</li>
    `)
    return jqList
  }, jqList)
}
