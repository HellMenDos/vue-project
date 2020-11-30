import { Http } from './http';
import { ErrorWrapper } from './util';
import * as Fingerprint2 from 'fingerprintjs2';
import $store from './../store';
import $router from './../router/index';
import Vue from 'vue';
import moment from "moment";

export default class {
    getAccessToken() {
        return localStorage.getItem('accessToken') || '';
    }

    getRefreshToken() {
        return localStorage.getItem('refreshToken') || '';
    }

    getExpiresAt() {
        return localStorage.getItem('expiresAt') || 0;
    }

    isExpired() {
        return this.getExpiresAt() < moment().unix();
    }

    getBearer() {
        return 'Bearer ' + this.getAccessToken();
    }

    setAuth(data) {
        this.setRefreshToken(data.refreshToken);
        this.setAccessToken(data.accessToken);
        this.setExpiresAt(data.expiresAt, data.createdAt);
    }

    setAccessToken(accessToken) {
        if (accessToken) {
            localStorage.setItem('accessToken', accessToken);
        } else {
            localStorage.removeItem('accessToken');
        }
    }

    setRefreshToken(refreshToken) {
        if(refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
        } else {
            localStorage.removeItem('refreshToken');
        }
    }

    setExpiresAt(expiresAt, createdAt) {
        if (!expiresAt) {
            localStorage.removeItem('expiresAt');
            return ;
        }

        const duration = expiresAt - createdAt - process.env.VUE_APP_IDLE_TIME;
        expiresAt = moment().add(duration, 's').unix();

        Vue.$log.debug('New access token expires at ' + expiresAt + ' in ' + duration + ' seconds');
        localStorage.setItem('expiresAt', expiresAt);
    }

    clear() {
        this.setAccessToken('');
        this.setRefreshToken('');
        this.setExpiresAt(0);
    }

    async makeLogin ({ username, password, rememberme }) {
        const fingerprint = await _getFingerprint();
        if (!rememberme) rememberme = false;
        Vue.$log.info('Making log in');
        return new Promise((resolve, reject) => {
            new Http().post('auth/login', { username, password, fingerprint, rememberme })
                .then(response => {
                    this.setAuth(response.data.data);
                    return resolve(response.data.data);
                })
                .catch(error => reject(new ErrorWrapper(error)));
        });
    }

    // async makeSignup( {username, password, name}) {
    //     return new Promise((resolve, reject) => {
    //         new Http().post('auth/signup', { username, password, name })
    //             .then(response => {
    //                 return resolve(response.data.data);
    //             })
    //             .catch(error => reject(new ErrorWrapper(error)));
    //     });
    // }

    async makeRestore( token, password ) {
        const fingerprint = await _getFingerprint();
        return new Promise((resolve, reject) => {
            new Http().post('auth/restore-password', { token, password, fingerprint })
                .then(response => {
                    this.setAuth(response.data.data);
                    return resolve(response.data.data);
                })
                .catch(error => reject(new ErrorWrapper(error)));
        });
    }

    // async makeSocial( profile ) {
    //     const fingerprint = await _getFingerprint();
    //     return new Promise((resolve, reject) => {
    //         new Http().post( 'auth/social', {
    //             accessToken: profile.access_token,
    //             fingerprint: fingerprint
    //         })
    //             .then(response => {
    //                 this.setAuth(response.data.data);
    //                 return resolve(response.data.data);
    //             })
    //             .catch(error => reject(new ErrorWrapper(error)));
    //     });
    // }

    // async makeConfirm(token) {
    //     const fingerprint = await _getFingerprint();
    //     return new Promise((resolve, reject) => {
    //         new Http().post('auth/confirm', {token, fingerprint})
    //             .then(response => {
    //                 this.setAuth(response.data.data);
    //                 return resolve(response.data.data);
    //             })
    //             .catch(error => reject(new ErrorWrapper(error)));
    //     })
    // }

    async makeReset(username) {
        return new Promise((resolve, reject) => {
            new Http().post('auth/reset-password', {username})
                .then(response => {
                    return resolve(response.data.data);
                })
                .catch(error => reject(new ErrorWrapper(error)));
        })
    }

    async makeLogout () {
        Vue.$log.info('Making log out');
        return new Promise((resolve, reject) => {
            new Http({ auth: true }).post('auth/logout')
                .then(response => {
                    this.clear();
                    $router.push({ name: 'login' });
                    return resolve(response.data.data);
                })
                .catch(error => reject(new ErrorWrapper(error)));
        })
    }

    async refreshTokens () {
        const fingerprint = await _getFingerprint();
        Vue.$log.info('Making tokens refresh');
        return new Promise((resolve) => {
            new Http().post('auth/token', {
                refreshToken: this.getRefreshToken(),
                fingerprint
            }).then(response => {
                this.setAuth(response.data.data);
                Vue.$log.info('Token is successfully refreshed');
                return resolve(response.data.data);
            }).catch(() => {
                Vue.$log.info('Token refreshing failed');
                this.clear();
                $store.dispatch('user/CLEAR');
                return $router.push({name: 'login'});
            });
        });
    }
}

/**
 ******************************
 * @private_methods
 ******************************
 */

function _getFingerprint () {
    return new Promise((resolve, reject) => {
        async function getHash () {
            const options = {
                excludes: {
                    plugins: true,
                    localStorage: true,
                    adBlock: true,
                    screenResolution: true,
                    availableScreenResolution: true,
                    enumerateDevices: true,
                    pixelRatio: true,
                    doNotTrack: true
                }
            };

            try {
                const components = await Fingerprint2.getPromise(options)
                const values = components.map(component => component.value)
                return String(Fingerprint2.x64hash128(values.join(''), 31))
            } catch (e) {
                reject(e)
            }
        }

        if (window.requestIdleCallback) {
            requestIdleCallback(async () => resolve(await getHash()))
        } else {
            setTimeout(async () => resolve(await getHash()), 500)
        }
    })
}
