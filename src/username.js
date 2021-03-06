export const isUsername = str => {
  if (typeof str !== 'string') {
    return false
  }

  if (!str) {
    return false
  }

  if (!(/^[A-Za-z0-9_]{2,16}$/.test(str))) {
    return false
  }

  return true
}

export const assertUsername = str => {
  if (!isUsername(str)) {
    throw new Error(`Invalid username: ${str}. Must be between 2 and 16 characters and only contains letters, numbers and underscores.`)
  }
}
