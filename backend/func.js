const axios = require('axios')
// const jwt = require('./modules/jwt.js')
const BASE_API_URL = 'https://api.eloverblik.dk/customerapi/api'

function request (url, data, method, refreshToken) {
  return new Promise((resolve, reject) => {
    axios({
      url,
      data,
      method,
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${refreshToken}`
      }
    }).then((response) => {
      resolve(response.data.result)
    },
    (error) => {
      if (error.response) {
        reject(new Error(
          `${error.response.status} ${error.response.statusText}
        Data: ${error.response.data}`
        ))
      } else if (error.request) {
        reject(new Error(`${error.request}`))
      } else {
        reject(new Error(`${error.message}`))
      }
    })
  })
}

function get (url, refreshToken) {
  return request(url, {}, 'get', refreshToken)
}

function post (url, data, refreshToken) {
  return request(url, data, 'post', refreshToken)
}

function getAccessToken (refreshToken) {
  return get(BASE_API_URL + '/token', refreshToken)
}

function getMeteringPoints (accessToken, includeAll) {
  return get(BASE_API_URL + `/meteringpoints/meteringpoints?includeAll=${!!includeAll}`, accessToken)
}

async function getDetails (accessToken, meteringPoint) {
  const data = {
    meteringPoints: {
      meteringPoint: [meteringPoint.toString()]
    }
  }
  post(BASE_API_URL + '/meteringpoints/meteringpoint/getdetails', data, accessToken)
}

module.exports = {
  getAccessToken, getDetails, getMeteringPoints
}
