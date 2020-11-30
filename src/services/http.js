/**
 * HTTP request layer
 * if auth is required return patched axios instance(with access token in headers)
 * else return clear axios instance
 */

import axios from 'axios';
import Vue from 'vue';

export class Http {
  constructor (status) {
    this.isAuth = (status && status.auth) ? status.auth : false;
    this.instance = axios.create({
      baseURL: process.env.VUE_APP_API_URL
    });
    return this.init();
  }

  init () {
    this.instance.interceptors.request.use( request => {
      Vue.$log.info('Http ' + request.method + ' request to ' + request.url );
      return request;
    });

    this.instance.interceptors.response.use( response => {
      Vue.$log.info('Response status: ' + response.status);
      Vue.$log.debug('Response:', response);
      return response;
    });

    if (this.isAuth) {
      this.instance.interceptors.request.use(request => {
        // if access token expired and refreshToken exists >> go to API and get new access token
        if (Vue.$auth.isExpired() && Vue.$auth.getRefreshToken()) {
          Vue.$log.info('Refresh access token');
          return Vue.$auth.refreshTokens()
              .then(() => {
                request.headers.Authorization = Vue.$auth.getBearer();
                return request;
              }).catch(error => Promise.reject(error));
        } else {
          request.headers.Authorization = Vue.$auth.getBearer();
          return request;
        }
      }, error => {
        return Promise.reject(error);
      });
    }
    return this.instance;
  }
}
