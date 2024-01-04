import router from './router'
import NProgress from 'nprogress' // progress bar
import {getToken} from '@/util/auth'
import 'nprogress/nprogress.css' // progress bar style
NProgress.configure({ showSpinner: false }) //禁用进度环
router.beforeEach((to, from, next) => {
  // console.log(to.path);
  if (to.meta.title) { // 判断是否有标题
    document.title = to.meta.title;
  }
  if (getToken()&& to.path !== '/user/login') {
    // console.log("有token不去登录页1");
    next()
  } else if (getToken()&&to.path === '/user/login') { //如果登录成功访问登录页跳转到主页
    next({path: '/'})
  }else if (!getToken()&&to.path !== '/user/login'){
    // console.log("没有token不去登录页面转去登录页面");
    if (to.path == '/user/register') {
      next()
    }else{
      next('/user/login')
    }
    
  }else {
    // 剩下最后一种 没有token 但是去 login页面 通过
    // console.log("没有token 但是去 login页面通过");
    next()
    }
})