const axios = require('axios')

async function retrieveShortLivedToken(api_token) {
  await axios.get(
    'https://api.eloverblik.dk/customerapi/api/token', {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${api_token}`
    }
  }).then((response) => {
    console.log(res)
}, (res) => {
    console.log(res)
  })
}

retrieveShortLivedToken()
