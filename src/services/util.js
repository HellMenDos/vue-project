import $app from './../main';
import forEach from 'lodash/forEach';

/**
 * Create instant, which represent response object
 * @param {Object} [data] - custom data
 * @param {Object} [response] - axios response object
 * @param {String} [message] - custom message to display
 */
export class ResponseWrapper {
  constructor (response) {
    this.data = response.data.data;
    this.status = response.status;
    this.code = response.data.code;
  }
}

/**
 * Create instant, which represent error object
 * @param {Object} [error] - axios error object
 * @param {String} [message] - custom message to display
 */
export class ErrorWrapper extends Error {
  constructor (error) {
    super();

    if (error.response && error.response.status && (parseInt(error.response.status) === 401)) {
      $app.$log.warn('401 error fired');
      return $app.$router.push({name:'login'});
    }

    this.code = error.response ? error.response.status : false;
    this.errors = error.response ? error.response.data.errors : false;
    this.message = error.response ? error.response.data.message : false;
    this.name = error.response ? error.response.data.errorName: false;
  }

  apply = () => {
    if (this.code === 422) {
      return this.validate();
    } else {
      return this.alert();
    }
  };

  validate = () => {
    if (this.code !== 422) {
      this.alert();
      return [];
    }

    let result = [];
    forEach(this.errors, (error) => result.push(error.message));
    return result;
  };

  validationObject = () => {
    if (this.code !== 422) {
      this.alert();
      return {};
    }

    let o = {};
    forEach(this.errors, (error) => {
      if (error.hasOwnProperty('field') && error.field !== undefined && o[error.field] === undefined){
          o[error.field] = error.message;
      }
    });
    return o;
  };

  validationField = (field) => {
    if (this.code !== 422) {
      this.alert();
      return '';
    }

    for(let key in this.errors) {
      if (this.errors.hasOwnProperty(key) && this.errors[key].field === field){
        return this.errors[key].message;
      }
    }
    return '';
  };

  alert = () => {
    // $app.$vs.notify({
    //   color: "danger",
    //   title: this.name,
    //   text: this.message
    // });
    alert(this.message);
    return [];
  };
}
