const express = require('express')
const app = express()
const port = 4000
const axios = require('axios')
const expressLogging = require('express-logging');
const logger = require('logops');
const eloverblik = require('./func.js');
app.use(expressLogging(logger))

app.get('/token', (req, res, next) => {
  eloverblik.getAccessToken(req.query.token)
  .then((accessToken) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
    res.json({accessToken});
  }, (error) => {
    next(error);
  });
})

app.get('/meteringpoints', async (req, res) => {
  let meteringPoints = await eloverblik.getMeteringPoints(req.query.token, req.query.includeAll == 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
  res.json({meteringPoints});
})


app.get('/getdetails', async (req, res) => {
  let details = await eloverblik.getDetails(req.query.token, req.query.meteringpoint.toString());
  res.json({details});
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
