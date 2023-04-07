import express from 'express';

const state = {
  history: []
}

class InvalidInputError extends Error {
  constructor (message) {
    super(message)
    this.name = 'InvalidInputError'
  }
}

const calculate = operation => (left, right) => {
  if (typeof(left) !== 'number' || typeof(right) !== 'number') {
    throw new TypeError('Input type must be number')
  }

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

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('server/public/dist'));

app.get('/history', (_req, res) => {
  res.send({ history: state.history })
})

app.post('/calculate', (req, res) => {
  const input = {
    operation: req.body.operation,
    left: Number(req.body.left),
    right: Number(req.body.right)
  }

  try {
    const result = calculate(input.operation)(input.left, input.right)
    state.history.push({ input, result })
    res.sendStatus(201)
  } catch (e) {
    if (e instanceof InvalidInputError) {
      console.error('Invalid input')
      res.sendStatus(422)
    } else {
      throw e
    }
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
