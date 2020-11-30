import { Base } from './base'

export class User extends Base {

  static get entity () {
    return 'users'
  }

  static getCurrent () {
    return new Promise((resolve, reject) => {
      return this.request().get(`${this.entity}/current`)
        .then(response => resolve(response.data.data))
        .catch(error => reject(this.errorWrapper(error)))
    })
  }
}
