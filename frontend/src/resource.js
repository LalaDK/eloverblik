import Axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'

class Resource {
  static requests = 0
  static onChange

  static incrementRequests () {
    this.requests++
    if (this.onChange) {
      this.onChange(this.requests)
    }
  }

  static decrementRequests () {
    this.requests--
    if (this.onChange) {
      this.onChange(this.requests)
    }
  }

  constructor (url) {
    this.url = url
  }

  query (queryParams) {
    return this.performRequest(queryParams, 'GET')
  }

  get (queryParams) {
    return this.performRequest(queryParams, 'GET')
  }

  update (queryParams, data) {
    return this.performRequest(queryParams, 'PUT', data)
  }

  save (queryParams, data) {
    return this.performRequest(queryParams, 'POST', data)
  }

  destroy (queryParams, data) {
    return this.performRequest(queryParams, 'DELETE', data)
  }

  performRequest (queryParams, method, data) {
    const url = this.prepareUrl(this.url, queryParams)
    const promise = Axios({
      url,
      method,
      data
    })

    return promise
  }

  prepareUrl (url, queryParams) {
    if (!queryParams) {
      queryParams = {}
    }
    /*
    (url.match(/:\w+/g) || []).forEach((key) => {
      key = key.replaceAll(':', '');

      url = url.replaceAll( `:${key}`, queryParams[key] );
      delete queryParams[key];
    });
*/
    const keysLeft = Object.keys(queryParams)

    if (keysLeft.length > 0) {
      return url + '?' + Object.toQueryString(queryParams)
    } else {
      return url
    }
  }
}

Axios.defaults.headers.common = {
  'X-Requested-With': 'XMLHttpRequest',
  dataType: 'application/json',
  'Content-Type': 'application/json',
  Accept: 'application/json'
}

Axios.interceptors.request.use(function (config) {
  Resource.incrementRequests()
  return config
}, function (error) {
  ElMessage({
    message: error,
    type: 'error'
  })
  return Promise.reject(error)
})

Axios.interceptors.response.use(function (response) {
  Resource.decrementRequests()
  return response.data
}, function (error) {
  ElMessage({
    message: error,
    type: 'error'
  })
  Resource.decrementRequests()
  return Promise.reject(error)
})

export default Resource
