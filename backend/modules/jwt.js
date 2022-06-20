const jwtDecode = require('jwt-decode')

function expirationDate (jwtToken) {
  const jwt = jwtDecode(jwtToken)
  const expirationDate = new Date(0)
  expirationDate.setSeconds(expirationDate.getSeconds() + jwt.exp)
  return expirationDate
}

function expired (jwtToken) {
  const expirationDate = expirationDate(jwtToken)
  return new Date() > expirationDate
}

module.exports = { expirationDate, expired }
