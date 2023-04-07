import $ from 'jquery'

export function main () {
  const jqResult = $('#result')
  getHistory().then(history => {
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

  calculate(operation, Number(left), Number(right)).then(res => {
    console.log('POST /calculate:', res)

    getHistory().then(history => {
      const result = history[history.length - 1].result
      console.log(history[history.length - 1])
      $('#result').text(Number(result))
    })
  })
}

async function calculate (operation, left, right) {
  await $.ajax({
    method: 'POST',
    url: '/calculate',
    data: { operation, left, right }
  })
}

async function getHistory () {
  const res = await $.ajax({
    method: 'GET',
    url: '/history'
  })
  return res.history
}
