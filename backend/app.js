const express = require('express')
const app = express()
const port = 4000
const axios = require('axios')
const expressLogging = require('express-logging');
const logger = require('logops');
const eloverblik = require('./func.js');
var token;

app.use(expressLogging(logger))
app.use((req, res, next) => {
  token = req.query.token || req.body.token;
  next();
});

app.get('/token', (req, res, next) => {
  eloverblik.getAccessToken(token)
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
  let meteringPoints = await eloverblik.getMeteringPoints(token, req.query.includeAll == 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
  res.json({meteringPoints});
})

app.post('/gettimeseries', async (req, res) => {
  let timeseries = await eloverblik.getTimeSeries(
    token,
    req.query.meteringPoint || req.body.meteringPoint,
    req.query.from || req.body.from,
    req.query.to || req.body.to,
    req.query.aggregation || req.body.aggregation
  );
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
  res.json({timeseries});
})


app.get('/getdetails', async (req, res) => {
  let details = await eloverblik.getDetails(req.query.token, req.query.meteringpoint.toString());
  res.json({details});
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
