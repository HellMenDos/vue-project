export const routes = [
    // Blank Layout
    {
        path: '/site',
        component: () => import('@/layout/blank/Layout'),

        children: [
            {
                name: 'login',
                path: 'login',
                meta: {
                    title: 'Welcome to CLC One Vision',
                    isAuth: false,
                },
                component: () => import('@/views/auth/Login')
            },
            {
                path: 'forgot-password',
                name: 'forgotpassword',
                meta: {
                    title: `Reset Password`,
                    isAuth: false
                },
                component: () => import('@/views/auth/ResetPassword.vue'),
            },
            {
                path: 'change-password/:token',
                name: 'changepassword',
                meta: {
                    title: `Change Password`,
                    isAuth: false
                },
                component: () => import('@/views/auth/ChangePassword.vue'),
            }
        ]
    },

    // Full Layout
    {
        path: '',
        meta: {isAuth: true},
        component: () => import('@/layout/full/Layout'),

        children: [
            {
                name: '404',
                path: '404',
                component: () => import('@/views/site/404'),
                meta: {
                    isAuth: false,
                    title: 'Page not found'
                }
            }
        ]
    },

    // Redirect to 404 page, if no match found
    {
        path: '*',
        redirect: '/404',
        meta: {
            isAuth: false
        }
    }
];
