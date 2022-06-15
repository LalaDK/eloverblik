 const express = require('express')
const app = express()
const port = 3000
const axios = require('axios')
const expressLogging = require('express-logging');
const logger = require('logops');
app.use(expressLogging(logger))

app.get('/token', async (req, res) => {
  logger.info("Hello world!!!")
  // let token = req.params.token;
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlblR5cGUiOiJDdXN0b21lckFQSV9SZWZyZXNoIiwidG9rZW5pZCI6ImI5YWQwMDUwLTNiNGMtNDA2MS05OWExLTczOGM2MmRiY2U5NCIsIndlYkFwcCI6WyJDdXN0b21lckFwaSIsIkN1c3RvbWVyQXBwQXBpIl0sImp0aSI6ImI5YWQwMDUwLTNiNGMtNDA2MS05OWExLTczOGM2MmRiY2U5NCIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWVpZGVudGlmaWVyIjoiUElEOjkyMDgtMjAwMi0yLTcyODE3MzQ2MDA0NyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2dpdmVubmFtZSI6Ik1hZHMgRGFtIEh2aWRiamVyZyBFY2thcmR0IiwibG9naW5UeXBlIjoiS2V5Q2FyZCIsInBpZCI6IjkyMDgtMjAwMi0yLTcyODE3MzQ2MDA0NyIsInR5cCI6IlBPQ0VTIiwidXNlcklkIjoiMTU0NTQiLCJleHAiOjE2ODYzOTg2NjgsImlzcyI6IkVuZXJnaW5ldCIsInRva2VuTmFtZSI6IkFQSSIsImF1ZCI6IkVuZXJnaW5ldCJ9.eGM3JS9lZxlFebN_zUSG65RZbHb-ryBHYWpyWQyvaDc'
  await axios.get('https://api.eloverblik.dk/customerapi/api/token', {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  }).then((response) => {
    res.send(response.data.result)
  }, (ajax) => {
    res.status(500)
    res.json({ error: 'Something went wrong.' })
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
