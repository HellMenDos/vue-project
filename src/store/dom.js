export default {
    namespaced: false,
    state:{
        title:'CLC One Vision',
    },
    mutations: {
        SET_TITLE(state, title) {
            state.title = title;
            window.document.title = process.env.VUE_APP_DOMAIN_TITLE +
                (title !== process.env.VUE_APP_DOMAIN_TITLE ? ' | ' + title : '');
        }
    },
    actions: {},
}
