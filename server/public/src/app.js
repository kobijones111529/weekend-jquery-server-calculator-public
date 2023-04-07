import $ from 'jquery'
import api from './api/mock'

export function main () {
  const jqResult = $('#result')
  api.getHistory().then(history => {
    if (history.length === 0) {
      return
    }

    const result = history[history.length - 1].result
    jqResult.text(result)
  })

  const jqCalculator = $('#calculator')
  jqCalculator.on('submit', handleCalculate)
}

/**
 * Handle calculator form submit
 * @param {SubmitEvent} event Form submit event
 */
function handleCalculate (event) {
  event.preventDefault()

  const jqForm = $(event.target)
  const jqOperation = jqForm.find('input[name=operation]:checked')
  const jqLeft = jqForm.find('input[name=left]')
  const jqRight = jqForm.find('input[name=right]')

  const operation = jqOperation.val()
  const left = jqLeft.val()
  const right = jqRight.val()

  api.calculate(operation, Number(left), Number(right)).then(() => {
    api.getHistory().then(history => {
      const result = history[history.length - 1].result
      console.log(history[history.length - 1])
      $('#result').text(Number(result))
    })
  })
}
