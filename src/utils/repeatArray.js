/*
 *   Repeat Array n times
 */

const repeat = (input, times) => {

  if (!Array.isArray(input)) {
    throw new Error("Input is not an array")
  }

  let result = []
  for (let i = 0; i <= times; i++) {
    input.forEach((obj) => {
      result.push(obj)
    })
  }
  return result
}

module.exports = repeat
