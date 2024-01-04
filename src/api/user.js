import request from '@/router/axios.js';
// 登录
export const loginByUsername = ( username, password) => request({
    url: '/api/login',
    method: 'post',
    headers: {
      "content-type"  : "application/x-www-form-urlencoded" 
    },
    data: {
      username,
      password,
    }
  });
  //   登出
  export const logout = (data) => request({
    url: '/api/logout',
    method: 'get',
    data
  });
//   注册
  export const registerByUsername = (data) => request({
    url: '/api/register',
    method: 'post',
    data
  });
  //   激活
  export const activateUserId = (data) => request({
    url: '/api/users/email',
    method: 'post',
    data
  });
//   邮箱验证码
export const getUserCode = (username) => request({
    url: '/api/users/code',
    method: 'get',
    params:{
        username
    
      }
  });
  // 获取个人信息
export const getUserInfo = (userInfoId) => request({
  url:'/api/',
  method: 'get',
  params:{
    userInfoId
  }
})
// 获取个人积分
export const getUserIntegral = () => request({
  url:'/api/rewardPoints',
  method: 'get',
})
// 获取文档
export const getDocxFlie = (filePath) => request({
  url:'/api/files/display',
  method: 'post',
  params:{
    filePath
  },
  responseType: "blob",
})
// 用户访问网站
export const userVisitWebsite = () => request({
  url:'/api/report',
  method: 'get',
})
// 获取相关网站链接
export const getRelevanceLink = () => request({
  url:'/api/links',
  method: 'get',
})