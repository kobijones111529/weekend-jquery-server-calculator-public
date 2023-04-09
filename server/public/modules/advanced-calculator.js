import $ from 'jquery'

/**
 * Initialize advanced calculator
 * @param {JQuery<HTMLFormElement>} jqElem Calculator jQuery element
 */
export function init (jqForm) {
  jqForm.on('submit', handleSubmit)
  jqForm.on('click', 'button', handleButtonClick)
  jqForm.on('mousedown', 'button', function (event) {
    // Prevent mousedown from moving focus
    event.preventDefault()
  })

  // jQuery doesn't seem to have a beforeinput handler
  const expressionElement = jqForm.get()[0].querySelector('input[name=expression]')
  expressionElement.onbeforeinput = handleExpressionBeforeInput
}

/**
 * Handle form submit
 * @param {SubmitEvent} event Submit event
 */
function handleSubmit (event) {
  // Prevent page reload
  event.preventDefault()
}

/**
 * Handle calculator button clicks
 * @param {MouseEvent} event Click event
 */
function handleButtonClick (event) {
  const jqButton = $(event.target)

  const jqExpression = jqButton.parents('form').find('input[name=expression]')
  const expressionInput = jqExpression.get()[0]
  jqExpression.focus()

  // Expression input should be an input element
  if (!(expressionInput instanceof window.HTMLInputElement)) return

  const selectionStart = expressionInput.selectionStart
  const selectionEnd = expressionInput.selectionEnd
  const selectionDirection = expressionInput.selectionDirection
  const expression = expressionInput.value
  const input = {
    before: expression.slice(0, selectionStart),
    after: expression.slice(selectionEnd)
  }

  const buttonName = jqButton.attr('name')
  const nameSymbolMap = new Map([
    ['zero', '0'],
    ['one', '1'],
    ['two', '2'],
    ['three', '3'],
    ['four', '4'],
    ['five', '5'],
    ['six', '6'],
    ['seven', '7'],
    ['eight', '8'],
    ['nine', '9'],
    ['decimal', '.'],
    ['add', '+'],
    ['subtract', '−'],
    ['multiply', '*'],
    ['divide', '/']
  ])
  const symbol = nameSymbolMap.get(buttonName)
  if (symbol !== undefined) {
    expressionInput.setSelectionRange(null, null, selectionDirection)
    expressionInput.value = input.before + symbol + input.after
    const newSelectionEnd = input.before.length + symbol.length
    expressionInput.setSelectionRange(newSelectionEnd, newSelectionEnd, selectionDirection)
  }
}

/**
 * Handle expression before input
 * @param {InputEvent} event Input event
 */
function handleExpressionBeforeInput (event) {
  // Ignore delete events
  if (event.data === null) return

  event.preventDefault()

  const expressionElement = event.target

  // Expression input should be an input element
  if (!(expressionElement instanceof window.HTMLInputElement)) return

  const selectionStart = expressionElement.selectionStart
  const selectionEnd = expressionElement.selectionEnd
  const selectionDirection = expressionElement.selectionDirection
  const expression = expressionElement.value
  const input = {
    before: expression.slice(0, selectionStart),
    after: expression.slice(selectionEnd)
  }

  const charMap = [
    ['-', '−']
  ]
  const newInput = charMap.reduce((str, [key, value]) => {
    const newStr = str.replace(key, value)
    return newStr
  }, event.data === null ? '' : event.data)
  expressionElement.setSelectionRange(null, null, selectionDirection)
  expressionElement.value = input.before + newInput + input.after
  const newSelectionEnd = input.before.length + newInput.length
  expressionElement.setSelectionRange(newSelectionEnd, newSelectionEnd, selectionDirection)
}
