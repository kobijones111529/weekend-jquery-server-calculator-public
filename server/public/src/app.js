import $ from 'jquery'
import api from './api'
import { renderResult, renderHistory } from './render'

/**
 * Application entry point
 */
export function main () {
  // Initial render of result
  api.getHistory().then(history => {
    if (history.length === 0) {
      return
    }

    const result = history[history.length - 1].result
    renderResult(Number(result))

    renderHistory(history)
  })

  // Listen for calculator form submission
  const jqCalculator = $('#calculator')
  jqCalculator.on('submit', handleCalculate)

  // Listen for calculator clear request
  const jqClear = $('button[name=clear]')
  jqClear.on('click', handleClear)
}

/**
 * Handle calculator form submit
 * @param {SubmitEvent} event Form submit event
 */
function handleCalculate (event) {
  // Prevent page reload
  event.preventDefault()

  const input = readCalculatorInput($(event.target))

  const parsedInput = {
    operation: input.operation,
    left: Number(input.left),
    right: Number(input.right)
  }

  // Make requests to API
  api.calculate(parsedInput.operation, parsedInput.left, parsedInput.right).then(() => {
    api.getHistory().then(history => {
      // Rerender result
      const result = history[0].result
      renderResult(Number(result))

      renderHistory(history)
    })
  })
}

/**
 * Handle calculator clear button click
 * @param {MouseEvent} event Button click event
 */
function handleClear (event) {
  const jqButton = $(event.target)
  const jqForm = jqButton.parents('form')
  jqForm.find('input[name=operation]:checked').prop('checked', false)
  jqForm.find('input[name=left]').val('')
  jqForm.find('input[name=right]').val('')
}

/**
 * Read calculator form input fields
 * @param {JQuery<HTMLFormElement>} jqForm jQuery form element
 * @returns {object} Calculator input
 */
function readCalculatorInput (jqForm) {
  const jqOperation = jqForm.find('input[name=operation]:checked')
  const jqLeft = jqForm.find('input[name=left]')
  const jqRight = jqForm.find('input[name=right]')

  return {
    operation: jqOperation.val(),
    left: jqLeft.val(),
    right: jqRight.val()
  }
}
