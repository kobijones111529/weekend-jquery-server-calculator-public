export const any = str => {
  if (str.length < 1) {
    return [str, new Error('expected any character')]
  }
}
