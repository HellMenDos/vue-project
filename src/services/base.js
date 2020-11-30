import { Http } from './http';
import { ResponseWrapper, ErrorWrapper } from './util';

export class Base {
  static get entity () {
    throw new Error('"entity" getter not defined')
  }
  /**
   * ------------------------------
   * @HELPERS
   * ------------------------------
   */

  static request (status = { auth: true }) {
    return new Http(status)
  }

  static responseWrapper (response) {
    return new ResponseWrapper(response)
  }

  static errorWrapper (response) {
    return new ErrorWrapper(response)
  }

  /**
   * ------------------------------
   * @API_CALLS_PUBLIC
   * ------------------------------
   */

  static all (parameters = {}) {
    const params = {
      ...parameters
    };
    return new Promise((resolve, reject) => {
      return this.request({ auth: true }).get(`${this.entity}`, { params })
        .then(response => resolve(this.responseWrapper(response)))
        .catch(error => reject(this.errorWrapper(error)))
    })
  }

  static one (id = window.required(), params = {}) {
    return new Promise((resolve, reject) => {
      return this.request({ auth: true }).get(`${this.entity}/${id}`, {params: params})
        .then(response => resolve(this.responseWrapper(response)))
        .catch(error => reject(this.errorWrapper(error)))
    })
  }

  static create (data = window.required()) {
    return new Promise((resolve, reject) => {
      return this.request({ auth: true }).put(`${this.entity}/create`, data)
        .then(response => resolve(this.responseWrapper(response)))
        .catch(error => reject(this.errorWrapper(error)))
    })
  }

  static update (id = window.required(), data = window.required()) {
    return new Promise((resolve, reject) => {
      return this.request({ auth: true }).patch(`${this.entity}/${id}`, data)
        .then(response => resolve(this.responseWrapper(response)))
        .catch(error => reject(this.errorWrapper(error)))
    })
  }

  static remove (id = window.required()) {
    return new Promise((resolve, reject) => {
      return this.request({ auth: true }).delete(`${this.entity}/${id}`)
        .then(response => resolve(this.responseWrapper(response)))
        .catch(error => reject(this.errorWrapper(error)))
    })
  }
}
