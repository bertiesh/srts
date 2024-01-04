import {setStore, getStore} from '@/util/store'
import {setToken,removeToken} from '@/util/auth'
import website from '@/config/website'
import {loginByUsername,registerByUsername,getUserInfo,
  logout,userVisitWebsite} from '@/api/user'
const user ={
    state: {
        userInfo: getStore({name: 'userInfo'}) || [],
        usermsg:getStore({name: 'usermsg'}) ||{},
        webmsg:getStore({name: 'webmsg'}) ||{},
        website: website,
      },
      actions: {
         //登录
    LoginByUsername({commit}, userInfo) {
      return new Promise((resolve, reject) => {
        loginByUsername(userInfo.username, userInfo.password).then(res => {
          const data = res.data;
          if (data.data.loginType==1) commit('SET_TOKEN', data.data.username);
          commit('SET_USER_INFO', data.data);
          resolve(res);
        }).catch(error => {
          reject(error);
        })
      })
    },
    // 用户访问
    UserVisitWebsite({commit}, userInfo) {
      return new Promise((resolve, reject) => {
        userVisitWebsite().then(res => {
          const data = res.data.data;
          commit('SET_WEB_MSG', data);
          resolve(res);
        }).catch(error => {
          reject(error);
        })
      })
    },
     // 登出
     LogOut({commit}) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          commit('SET_TOKEN', '');
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
        //注册
        RegisterByUsername({commit}, userInfo) {
          return new Promise((resolve, reject) => {
            registerByUsername(userInfo).then(res => {
              const data = res.data;
              resolve(res);
            }).catch(error => {
              reject(error);
            })
          })
        },
        GetUserInfo({commit},id) {
          return new Promise((resolve, reject) => {
            getUserInfo(id).then((res) => {
              const data = res.data.data;
              resolve(data);
            }).catch(err => {
              reject(err);
            })
          })
        },
      },
      mutations: {
        SET_TOKEN: (state, token) => {
          setToken(token)
          setStore({name: 'token', content: state.token, type: 'session'})
        },
        SET_USER_INFO: (state, userInfo) => {
            state.userInfo = userInfo;
            setStore({name: 'userInfo', content: state.userInfo})
          }, 
          SET_WEB_MSG: (state, webmsg) => {
            state.webmsg = webmsg;
            setStore({name: 'webmsg', content: state.webmsg})
          },
          SET_USER_MSG: (state, usermsg) => {
            state.usermsg = usermsg;
            setStore({name: 'usermsg', content: state.usermsg})
          },

      }
}
export default user