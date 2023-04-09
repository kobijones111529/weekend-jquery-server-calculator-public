export class ParserError extends Error {
  constructor (input, message) {
    super(message)
    this.input = input
    this.name = 'ParserError'
  }
}

/**
 * Left case of either monad
 */
export class Left {
  constructor (value) {
    this.value = value
  }

  map (fn) {
    return this
  }

  apply () {
    return this
  }

  seq () {
    return this
  }

  bind () {
    return this
  }

  or (either) {
    const other = either()
    return other instanceof Left ? this : other
  }

  toString () {
    return `Left: ${this.value}`
  }

  either (left) {
    return left(this.value)
  }
}

/**
 * Right case of either monad
 */
export class Right {
  constructor (value) {
    this.value = value
  }

  map (fn) {
    return new Right(fn(this.value))
  }

  apply (either) {
    return either instanceof Left ? either : this.map(either.value)
  }

  seq (either) {
    return either
  }

  bind (fn) {
    return fn(this.value)
  }

  or () {
    return this
  }

  toString () {
    return `Right: ${this.value}`
  }

  either (_, right) {
    return right(this.value)
  }
}

/**
 * Unwrap either
 * @param {function} left Map left
 * @param {function} right Map right
 * @param {Left | Right} either Either
 */
export const either = (left, right, either) => {
  return either instanceof Left ? left(either.value) : right(either.value)
}

/**
 * Parser combinator
 */
export class Parser {
  /**
   * Create a new parser
   * @param {function} run Parsing function
   */
  constructor (run) {
    this.run = run
  }

  /**
   * Functor map
   * @param {*} fn Function to apply
   */
  map (fn) {
    return new Parser(input =>
      this
        .run(input)
        .map(([input, output]) =>
          [input, fn(output)]
        )
    )
  }

  /**
   * Applicative apply
   * @param {function} parser Parser to apply (lazy)
   */
  apply (parser) {
    return new Parser(input =>
      this
        .run(input)
        .bind(([input, output]) =>
          parser().run(input)
            .map(([input, fn]) => [input, fn(output)])
        )
    )
  }

  /**
   * Applicative apply, ignoring previous result
   * @param {function} parser Parser 2 electric boogaloo (lazy)
   */
  seq (parser) {
    return this.apply(() => parser().map(output => _ => output))
  }

  /**
   * Apply and ignore left output
   * @param {function} parser Suffix (lazy)
   */
  prefixOf (parser) {
    return this.apply(() => parser().map(output => _ => output))
  }

  /**
   * Apply and ignore right output
   * @param {*} parser Suffix (lazy)
   */
  withSuffix (parser) {
    return this.apply(() => parser().map(_ => output => output))
  }

  /**
   * Monadic bind
   * @param {function} fn Function to bind
   */
  bind (fn) {
    return new Parser(input =>
      this
        .run(input)
        .bind(([input, output]) =>
          fn(output).run(input)
        )
    )
  }

  /**
   * Alternative
   * @param {function} parser Alternate parser (lazy)
   */
  or (parser) {
    return new Parser(input =>
      this
        .run(input)
        .or(() => parser().run(input))
    )
  }

  /**
   * Match zero or more times
   */
  many () {
    return this.apply(() =>
      // Recurse
      this
        .many()
        .map(b => a => [a, ...b])
    ).or(() =>
      // End
      Parser.pure([])
    )
  }

  /**
   * Match one or more times
   */
  some () {
    return this.apply(() =>
      // Match remaining
      this
        .many()
        .map(b => a => [a, ...b])
    )
  }

  /**
   * Applicative pure
   * @param {*} value Value to be lifted
   */
  static pure (value) {
    return new Parser(input => new Right([input, value]))
  }

  /**
   * Parser error
   * @param {*} value Value to be lifted
   */
  static error (value) {
    return new Parser(input => new Left([input, value]))
  }
}

/**
 * Match exactly one value
 */
export const any = new Parser(input => {
  if (input.length === 0) {
    return new Left('expected some input')
  } else {
    return new Right([input.slice(1), input[0]])
  }
})

/**
 * Match one value satisfying predicate
 * @param {function} fn Predicate
 */
export const one = fn => new Parser(input => {
  if (input.length === 0) return new Left('expected some input')
  if (!fn(input[0])) return new Left('expected specific input')

  return new Right([input.slice(1), input[0]])
})

/**
 * Match any number of values satisfying predicate
 * @param {function} fn Predicate
 */
export const many = fn => new Parser(input => {
  const end = input.findIndex(x => !fn(x))
  if (end === -1) {
    return new Right([[], input])
  } else {
    return new Right([input.slice(end), input.slice(0, end)])
  }
})

/**
 * Match at least one value satisfying predicate
 * @param {function} fn Predicate
 */
export const some = fn => {
  const required = one(fn)
  const extra = many(fn)
  const appendExtra = extra.map(rest => first => [first, ...rest])
  return required.apply(() => appendExtra)
}

/**
 * Match exactly nothing
 */
export const end = new Parser(input => {
  if (input.length === 0) return new Right([[], null])

  return new Left('expected end of input')
})
