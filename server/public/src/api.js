import $ from 'jquery'

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

export default {
  calculate,
  getHistory
}
