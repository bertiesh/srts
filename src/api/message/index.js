import request from '@/router/axios.js';
// 获取所有未读消息
export const getAllNotices = () => {
  return request({
    url: '/api/notices',
    method: 'get',
  })
 }
// 获取收到的点赞
export const getMylike = (data) => {
    return request({
      url: '/api/notices/点赞',
      method: 'get',
      params:data
    })
   }
   // 获取收到的关注
export const getMyFocus = (data) => {
  return request({
    url: '/api/notices/关注',
    method: 'get',
    params:data
  })
 }
    // 获取收到的评论
export const getMyComment = (data) => {
  return request({
    url: '/api/notices/评论',
    method: 'get',
    params:data
  })
 }
//  获取用户对话框
export const getUserMessages = () => {
  return request({
    url: '/api/messages',
    method: 'get',
  })
 }
 //  获取用户单个对话
export const getUserMessageList = (data) => {
  return request({
    url: '/api/messages/info',
    method: 'post',
    data
  })
 }
  //  发送私信
export const postMessageToUser = (data) => {
  return request({
    url: '/api/messages',
    method: 'post',
    data
  })
 }
   //  发送私信
export const postMessageToHelp = (data) => {
  return request({
    url: '/api/helps',
    method: 'post',
    data
  })
 }