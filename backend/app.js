const express = require('express')
require('express-async-errors');
const app = express()
const cors = require('cors')
const port = 4000
const axios = require('axios')
const expressLogging = require('express-logging');
const logger = require('logops');
const eloverblik = require('./func.js');
var token;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(expressLogging(logger))
app.use((req, res, next) => {
  token = req.query.token || req.body.token;
  next();
});

app.get('/token', (req, res, next) => {
  eloverblik.getAccessToken(token)
  .then((accessToken) => {
    res.json({accessToken});
  }, (error) => {
    next(error);
  });
})

app.get('/meteringpoints', async (req, res) => {
  let meteringPoints = await eloverblik.getMeteringPoints(token, (req.query.includeAll || req.body.includeAll) == 'true');
  res.json({meteringPoints});
})

app.post('/gettimeseries', async (req, res) => {
  console.log(req.body);
  let timeseries = await eloverblik.getTimeSeries(
    token,
    (req.query || {}).meteringPoint || req.body.meteringPoint,
    (req.query || {}).from || req.body.from,
    (req.query || {}).to || req.body.to,
    (req.query || {}).aggregation || req.body.aggregation
  );
  res.json({timeseries});
})


app.get('/getdetails', async (req, res) => {
  let details = await eloverblik.getDetails(req.query.token, req.query.meteringpoint.toString());
  res.json({details});
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
