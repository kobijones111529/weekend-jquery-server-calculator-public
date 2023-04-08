import $ from 'jquery'

/**
 * Initialize advanced calculator
 * @param {JQuery<HTMLFormElement>} jqElem Calculator jQuery element
 */
export function init (jqForm) {
  jqForm.find('input[name=expression]')

  jqForm.on('submit', handleSubmit)
  jqForm.on('click', 'button', handleButtonClick)
  jqForm.on('mousedown', 'button', function (event) {
    // Prevent mousedown from moving focus
    event.preventDefault()
  })
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

  jqButton.parents('form').find('input[name=expression]').focus()

  const buttonName = jqButton.attr('name')
  console.log(buttonName)
}
