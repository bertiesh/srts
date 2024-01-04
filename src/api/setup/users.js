
import request from '@/router/axios.js';
   // 修改个人信息
   export const update = (data) => {
    return request({
      url: '/api/users/info',
      method: 'put',
      data
    })
  }
   // 根据id获取我关注的人
   export const getUserFocusById = ( size,current,userInfoId) => {
    return request({
      url: '/api/users/follow',
      method: 'get',
      params:{
        size,current,userInfoId
    }
    })
  }
  // 根据id获取关注我的人
  export const getFocusMeById = ( size,current,userInfoId) => {
    return request({
      url: '/api/users/followed',
      method: 'get',
      params:{
        size,current,userInfoId
    }
    })
  }
    //  关注作者
    export const giveUserAttention = (data) => {
      return request({
        url: '/api/users/info',
        method: 'put',
        data
      })
     }
     
        //  获取我的积分
    export const giveUserIntegral = () => {
      return request({
        url: '/api/rewardPoints',
        method: 'get',
      })
     }