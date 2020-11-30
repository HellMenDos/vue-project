import Vue from 'vue';
import Router from 'vue-router';
import { routes } from './routes';
import $store from "../store";
// import NProgress from 'nprogress';

Vue.use(Router);

const router = new Router({
    linkActiveClass: 'is-active',
    mode: 'history',
    routes
});

router.beforeEach((to, from, next) => {
    const userId = $store.state.user.currentUser.id || 0;
    const isAuthRoute = to.matched.some(item => item.meta.isAuth);

    Vue.$log.debug('User', userId);

    if (!isAuthRoute) {
        Vue.$log.info('No need to identificate user');
        next();
    }

    if (Vue.$auth.getRefreshToken() && !userId) {
        Vue.$log.info('Refresh current user');
        return $store.dispatch('user/GET')
            .then(() => next())
            .catch(error => Vue.$log.fatal(error));
    }

    next();
});

router.beforeEach((to, from, next) => {
    const userId = $store.state.user.currentUser.id || 0;
    const isAuthRoute = to.matched.some(item => item.meta.isAuth === true);

    if (isAuthRoute && userId) {
        Vue.$log.info('User is authorized');
        return next();
    }
    if (isAuthRoute) {
        Vue.$log.info('Authorization required');
        return next({ name: 'login' });
    }

    Vue.$log.info('No need of authorization');
    next();
});

router.beforeEach((to, from, next) => {
    Vue.$log.info('Route info');
    Vue.$log.info(to);

    const pageTitle = to.matched.find(item => item.meta.title);

    if (pageTitle) {
        $store.commit('SET_TITLE', pageTitle.meta.title);
    }
    next();
});

/*router.beforeResolve((to, from, next) => {
    // If this isn't an initial page load.
    if (to.name) {
        // Start the route progress bar.
        NProgress.start()
    }
    next()
});

router.afterEach(() => {
    // Complete the animation of the route progress bar.
    NProgress.done()
});*/

export default router;
