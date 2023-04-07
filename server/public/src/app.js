import $ from 'jquery'
import api from './api'

/**
 * Application entry point
 */
export function main () {
  // Initial render of result
  const jqResult = $('#result')
  api.getHistory().then(history => {
    if (history.length === 0) {
      return
    }

    const result = history[history.length - 1].result
    jqResult.text(result)
  })

  // Listen for calculator form submission
  const jqCalculator = $('#calculator')
  jqCalculator.on('submit', handleCalculate)
}

/**
 * Handle calculator form submit
 * @param {SubmitEvent} event Form submit event
 */
function handleCalculate (event) {
  // Prevent page reload
  event.preventDefault()

  const jqForm = $(event.target)
  const jqOperation = jqForm.find('input[name=operation]:checked')
  const jqLeft = jqForm.find('input[name=left]')
  const jqRight = jqForm.find('input[name=right]')

  // Read input fields
  const operation = jqOperation.val()
  const left = jqLeft.val()
  const right = jqRight.val()

  // Make requests to API
  api.calculate(operation, Number(left), Number(right)).then(() => {
    api.getHistory().then(history => {
      // Rerender result
      const result = history[history.length - 1].result
      console.log(history[history.length - 1])
      $('#result').text(Number(result))
    })
  })
}
