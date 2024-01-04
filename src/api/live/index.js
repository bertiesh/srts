import request from '@/router/axios.js';
// 获取直播信息
export const getLiveList = (data) => {
    return request({
      url: '/api/lives',
      method: 'get',
      params:data
    })
   }
   // 根据ID获取直播信息
export const getLiveById = (id) => {
  return request({
    url: `/api/lives/${id}`,
    method: 'get',
  })
 }
    // 根据ID获取直播信息
export const getLive = (data) => {
  return request({
    url: `/api/files/display`,
    method: 'get',
    params:data
  })
 }