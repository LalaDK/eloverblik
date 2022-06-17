const axios = require('axios');
const fs = require('fs');
const jwtDecode = require('jwt-decode');
const BASE_API_URL = 'https://api.eloverblik.dk/customerapi/api';
const ACCESS_TOKEN_FILENAME = 'access-token';
const DEV_REFRESH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlblR5cGUiOiJDdXN0b21lckFQSV9SZWZyZXNoIiwidG9rZW5pZCI6ImI5YWQwMDUwLTNiNGMtNDA2MS05OWExLTczOGM2MmRiY2U5NCIsIndlYkFwcCI6WyJDdXN0b21lckFwaSIsIkN1c3RvbWVyQXBwQXBpIl0sImp0aSI6ImI5YWQwMDUwLTNiNGMtNDA2MS05OWExLTczOGM2MmRiY2U5NCIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWVpZGVudGlmaWVyIjoiUElEOjkyMDgtMjAwMi0yLTcyODE3MzQ2MDA0NyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2dpdmVubmFtZSI6Ik1hZHMgRGFtIEh2aWRiamVyZyBFY2thcmR0IiwibG9naW5UeXBlIjoiS2V5Q2FyZCIsInBpZCI6IjkyMDgtMjAwMi0yLTcyODE3MzQ2MDA0NyIsInR5cCI6IlBPQ0VTIiwidXNlcklkIjoiMTU0NTQiLCJleHAiOjE2ODYzOTg2NjgsImlzcyI6IkVuZXJnaW5ldCIsInRva2VuTmFtZSI6IkFQSSIsImF1ZCI6IkVuZXJnaW5ldCJ9.eGM3JS9lZxlFebN_zUSG65RZbHb-ryBHYWpyWQyvaDc'
var DEV_ACCESS_TOKEN;

function post(url, data) {
    return new Promise((resolve, reject) => {
    axios({
      url,
      data,
      method: 'post',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${ refresh_token }`
      }
    }).then((response) => {
    resolve({
      status: 'ok',
      data: response.data
    });
    },
    (error) => {
      if(error.response) {
        reject({
          status: 'error',
          data: {
            data: error.response.data,
            headers: error.response.headers,
            status: error.response.status
          }
        });
      } else if (error.request) {
        reject({
          status: 'error',
          data: error.request
        });
      } else {
        reject({
          status: 'error',
          data: error.message
        });
      }
    });
    });
}

function get(url) {

}

function jwtExpirationDate(jwt_token) {
  let jwt = jwtDecode(jwt_token);
  let expirationDate = new Date(0);
  expirationDate.setSeconds(expirationDate.getSeconds() + jwt.exp);
  return expirationDate;
}

function jwtExpired(jwt_token) {
  let expirationDate = jwtExpirationDate(jwt_token);
  return new Date() > expirationDate;
}

function writeAccessTokenToFile(access_token) {
  fs.writeFileSync(ACCESS_TOKEN_FILENAME, access_token);
}

function readAccessTokenFromFile() {
  try {
    if(fs.existsSync(ACCESS_TOKEN_FILENAME)) {
      return fs.readFileSync(ACCESS_TOKEN_FILENAME);
    }
  } catch(error) {
    return null;
  }
}

async function getAccessToken(refresh_token) {
let access_token = readAccessTokenFromFile()
  if(false && access_token) {
    console.info("Access token read from file");
    DEV_ACCESS_TOKEN = access_token;
    return access_token;
  }

  refresh_token = refresh_token || DEV_REFRESH_TOKEN;
  try {
    const response = await axios.get(
      BASE_API_URL + '/token', {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${ refresh_token }`
      }
    });
    DEV_ACCESS_TOKEN = response.data.result;
    writeAccessTokenToFile(response.data.result);
    return response.data.result;

  } catch(error) {
    throw `Could not retrieve token. ${error}
    ${ error.response.status } ${ error.response.statusMessage }
    ${ error.response.data }
    `;
  }
}

async function getMeteringPoints(access_token, includeAll) {
  access_token = access_token || DEV_ACCESS_TOKEN;
  try {
    const response= await axios.get(
      BASE_API_URL + `/meteringpoints/meteringpoints?includeAll=${ !!includeAll }`, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${ access_token }`
      }
    });
    return response.data.result;
  } catch(error) {
    console.error(error)
    throw `Could not retrieve metering points.
    ${ error.response.status } ${ error.response.statusMessage }
    ${ error.response.data}`;
  }
}

async function getDetails(access_token, meteringPoint) {
  access_token = access_token || DEV_ACCESS_TOKEN;
  try {
    const response= await axios({
      url: BASE_API_URL + `/meteringpoints/meteringpoint/getdetails`,
      method: 'post',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${ access_token }`
      },
      data: {
         "meteringPoints": {
            "meteringPoint": [meteringPoint.toString()]
        }
      }
    });
    console.log("RESPONSE", response)
    return response.data.result;
  } catch(error) {
    console.error(error)
    throw `Could not retrieve metering points.
    ${ error.response.status } ${ error.response.statusMessage }
    ${ error.response.data}`;
  }
}

module.exports = {
  getAccessToken, getDetails, getMeteringPoints
}
