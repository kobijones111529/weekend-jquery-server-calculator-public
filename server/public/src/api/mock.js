// 'Database'
const state = {
  history: []
}

// Run and store calculation
async function calculate (operation, left, right) {
  state.history.unshift({ input: { operation, left, right }, result: 0 })
}

// Get calculator history
async function getHistory () {
  return state.history
}

export default {
  calculate,
  getHistory
}
