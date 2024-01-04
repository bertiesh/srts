
export default [
    {
        path: '/user',
        component: () =>
            import( /* webpackChunkName: "page" */ '@/views/login.vue'),
        name: 'user',
        redirect: '/user/login',
        children: [
            // 讨论首页-discussion
            {
              path: 'login',
              name: 'login',
              component: () => import(/* webpackChunkName: "about" */ '@/components/loginpage.vue'),
            },
            {
                path: 'register',
                name: 'register',
                component: () => import(/* webpackChunkName: "about" */ '@/components/register.vue'),
              }]
    },
    {
        path: '/404',
        component: () =>
            import( /* webpackChunkName: "page" */ '@/components/error-page/404'),
        name: '404',
    
    },
    {
        path: '/403',
        component: () =>
            import( /* webpackChunkName: "page" */ '@/components/error-page/403'),
        name: '403',
    },
    {
        path: '/500',
        component: () =>
            import( /* webpackChunkName: "page" */ '@/components/error-page/500'),
        name: '500',
    },
    {
        path: '*',
        redirect: '/404'
    }
    ]