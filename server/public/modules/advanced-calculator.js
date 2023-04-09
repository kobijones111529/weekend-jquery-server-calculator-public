import $ from 'jquery'
import * as exp from './parser/expression.js'
import * as parser from './parser.js'

/**
 * Initialize advanced calculator
 * @param {JQuery<HTMLFormElement>} jqElem Calculator jQuery element
 */
export function init (jqForm) {
  // Handle form submission
  jqForm.on('submit', handleSubmit)

  // Handle calculator button clicks
  jqForm.on('click', 'button', handleButtonClick)

  // Handle calculator button mousedown events
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

  const jqForm = $(event.target)
  const jqExpression = jqForm.find('input[name=expression]')
  const expression = jqExpression.val()

  const fullParser = (exp.expression).withSuffix(() => parser.end)
  console.log(fullParser.run(expression.split('')))
}

/**
 * Handle calculator button clicks
 * @param {MouseEvent} event Click event
 */
function handleButtonClick (event) {
  const jqButton = $(event.target)
  const jqForm = jqButton.parents('form')
  const jqExpression = jqForm.find('input[name=expression]')
  const expressionElement = jqExpression.get()[0]
  jqExpression.focus()

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
    expressionElement.setSelectionRange(null, null, selectionDirection)
    expressionElement.value = input.before + symbol + input.after
    const newSelectionEnd = input.before.length + symbol.length
    expressionElement.setSelectionRange(newSelectionEnd, newSelectionEnd, selectionDirection)
  }
}

/**
 * Handle expression before input
 * @param {InputEvent} event Input event
 */
function handleExpressionBeforeInput (event) {
  // Ignore delete events
  if (event.data === null) return

  // Handle input manually for more control
  event.preventDefault()

  const expressionElement = event.target

  // Expression input should be an input element
  if (!(expressionElement instanceof window.HTMLInputElement)) return

  // Get cursor selection
  const selection = {
    start: expressionElement.selectionStart,
    end: expressionElement.selectionEnd,
    direction: expressionElement.selectionDirection
  }
  const expression = expressionElement.value
  // Segment expression by cursor selection
  const segments = {
    before: expression.slice(0, selection.start),
    after: expression.slice(selection.end)
  }

  // Transform new input
  const charMap = [
    ['-', '−']
  ]
  const newInput = charMap.reduce((str, [key, value]) => {
    const newStr = str.replace(key, value)
    return newStr
  }, event.data === null ? '' : event.data) // null means no new input text

  // Update expression element value and cursor selection
  expressionElement.setSelectionRange(null, null)
  expressionElement.value = segments.before + newInput + segments.after
  const newSelectionEnd = segments.before.length + newInput.length
  expressionElement.setSelectionRange(newSelectionEnd, newSelectionEnd, selection.direction)
}
