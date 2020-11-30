import { User } from '@/services/user'

export default {
    namespaced: true,
    state: {
        currentUser:{},
    },
    mutations: {
        SET_USER (state, userData) {
            state.currentUser = userData
        },
    },
    actions: {
        GET ({ commit }) {
            return User.getCurrent()
                .then(user => commit('SET_USER', user))
                .catch(error => error.alert())
        },

        CLEAR ({ commit }) {
            commit('SET_USER', {});
        }
    },
    getters: {

    }
}
