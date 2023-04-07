// 'Database'
const state = {
  history: [{
    input: {
      operation: 'add',
      left: 1,
      right: 4
    },
    result: 5
  }]
}

// Run and store calculation
async function calculate (operation, left, right) {
  state.history.push({ input: { operation, left, right }, result: 0 })
}

// Get calculator history
async function getHistory () {
  return state.history
}

export default {
  calculate,
  getHistory
}
