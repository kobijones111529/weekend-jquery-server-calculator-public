import $ from 'jquery';

function handleReady () {
  const jqCalculator = $('#calculator')
  jqCalculator.on('submit', handleCalculate)
}

/**
 * Handle calculator form submit
 * @param {SubmitEvent} event Form submit event
 */
function handleCalculate (event) {
  event.preventDefault()
}

// Start
$(document).ready(handleReady)
