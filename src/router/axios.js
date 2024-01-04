/**
 * 全站http配置
 *
 * axios参数说明
 * isSerialize是否开启form表单提交
 * isToken是否需要token
 */
import axios from 'axios'
import store from '@/store/';
import router from '@/router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
// 网络请求超时
axios.defaults.timeout = 10000;
//返回其他状态吗
axios.defaults.validateStatus = function (status) {
  return status >= 200 && status <= 500; // 默认的
};
//跨域请求，允许保存cookie
axios.defaults.withCredentials = true;
// NProgress Configuration
NProgress.configure({
  showSpinner: false
});
//HTTPrequest拦截
axios.interceptors.request.use(config => {
  NProgress.start() // start progress bar
  const meta = (config.meta || {});
  const isToken = meta.isToken === false;
  if (config.method === 'post' && meta.isSerialize === true) {
    config.data = serialize(config.data);
  }
  return config
}, error => {
  return Promise.reject(error)
});
//HTTPresponse拦截

axios.interceptors.response.use(res => {
  NProgress.done();
  const config = res.config
  const status = res.data.code || 200
  const message = res.data.message || '未知错误';
  // 如果请求为非200否者默认统一处理
  if (status !== 200) { 
    // console.log("!200",res);
    if (status == 400) {
      store.dispatch('LogOut').then(() => {
        router.push({ path: '/user/login' })
        this.$router.$avueRouter.routerList=[];
    });
    }
    return Promise.reject(new Error(message))
  }
  return res;
}, error => {
  console.log("let me see",error);
  NProgress.done();
  return Promise.reject(new Error(error));
})

export default axios;
