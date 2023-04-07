const state = {
  history: []
}

async function calculate (operation, left, right) {
  state.history.push({ input: { operation, left, right }, result: 0 })
}

async function getHistory () {
  return state.history
}

export default {
  calculate,
  getHistory
}
