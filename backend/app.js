const express = require('express')
const app = express()
const port = 3000
const axios = require('axios')
const expressLogging = require('express-logging');
const logger = require('logops');
const eloverblik = require('./func.js');
app.use(expressLogging(logger))

app.get('/token', async (req, res) => {
  let accessToken = await eloverblik.getAccessToken(req.query.token);
  if(accessToken) {
    res.json({accessToken});
  } else {
    res.status(500);
    res.json({error: "Unable to fetch token."});
  }
})

app.get('/meteringpoints', async (req, res) => {
  let meteringpoints = await eloverblik.getMeteringPoints(req.query.token, req.query.includeAll == 'true');
  if(meteringpoints) {
    res.json({meteringpoints});
  } else {
    res.status(500);
    res.json({error: "Unable to fetch meteringspoints."});
  }
})


app.get('/getdetails', async (req, res) => {
  let details = await eloverblik.getDetails(req.query.token, req.query.meteringpoint.toString());
  if(details) {
    res.json({details});
  } else {
    res.status(500);
    res.json({error: "Unable to fetch details."});
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
