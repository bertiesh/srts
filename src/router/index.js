import Vue from 'vue'
import VueRouter from 'vue-router'
import PageRouter from './views/home'
import ViewsRouter from './views/public'
Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
const router = new VueRouter({
});
[...PageRouter, ...ViewsRouter].forEach(element => {
  router.addRoute(element)
});

export default router
