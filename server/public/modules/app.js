import $ from 'jquery'
import api from './api.js'
import { renderResult, renderHistory } from './render.js'
import * as advancedCalculator from './advanced-calculator.js'
import * as simpleCalculator from './simple-calculator.js'

/**
 * Application entry point
 */
export function main () {
  // Initial render of result
  api.getHistory().then(history => {
    if (history.length === 0) {
      return
    }

    const result = history[0].result
    renderResult(Number(result))

    renderHistory(history)
  })

  // Listen for calculator form submission
  const jqSimpleCalculator = $('#calculator')
  simpleCalculator.init(jqSimpleCalculator)

  // Initial advanced calculator setup
  const jqAdvancedCalculator = $('#advanced-calculator')
  advancedCalculator.init(jqAdvancedCalculator)
}
