import express from 'express'

// 'Database'
const state = {
  history: []
}

class InvalidInputError extends Error {
  constructor (message) {
    super(message)
    this.name = 'InvalidInputError'
  }
}

/**
 * My Little Calculator™
 * @param {string} operation Binary mathematical operation
 * @returns Resulting binary function
 */
const calculate = operation =>
  /**
   * @param {number} left Left argument
   * @param {number} right Right argument
   * @returns {number} Result
   */
  (left, right) => {
    if (typeof (left) !== 'number' || typeof (right) !== 'number') {
      throw new TypeError('Input type must be number')
    }

    // Pattern match (kinda) on operation
    switch (operation) {
      case 'add':
        return left + right
      case 'subtract':
        return left - right
      case 'multiply':
        return left * right
      case 'divide':
        return left / right
      default:
        throw new InvalidInputError('Invalid operation')
    }
  }

// Create server
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.static('server/public'))

// GET route for calculator history
app.get('/history', (_req, res) => {
  res.send({ history: state.history })
})

// POST route for running and saving calculation
app.post('/calculate', (req, res) => {
  const input = {
    operation: req.body.operation,
    left: Number(req.body.left),
    right: Number(req.body.right)
  }

  try {
    const result = calculate(input.operation)(input.left, input.right)
    state.history.unshift({ input, result })
    res.sendStatus(201)
  } catch (e) {
    if (e instanceof InvalidInputError) {
      console.error('Invalid input')
      res.sendStatus(422)
    } else {
      throw e
    }
  }
})

// Start server
const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
