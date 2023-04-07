import $ from 'jquery'

/**
 * Render result to DOM
 * @param {number} result Result
 */
export function renderResult (result) {
  const jqResult = $('#result')
  jqResult.text(result)
}
