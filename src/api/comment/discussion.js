import request from '@/router/axios.js';
// 获取最近动态
export const getRecentlyTalk = (size,current) => {
 return request({
   url: '/api/talks',
   method: 'get',
   params:{
    size,current
}
 })
}
//根据用户id获取动态（个人主页用）
export const getTalkByUserId = (size,current,userInfoId) => {
  return request({
    url: '/api/talks',
    method: 'get',
    params:{
     size,current,userInfoId
 }
  })
 }
// 给动态点赞
export const giveDiscussionLike = (id) => {
  return request({
    url: `/api/talks/${id}/like`,
    method: 'post',
  })
 }
 // 给评论点赞
export const giveCommentLike = (id) => {
  return request({
    url: `/api/comments/${id}/like`,
    method: 'post',
  })
 }
 // 获取评论
export const getCommentList= (id) => {
  return request({
    url: '/api/comments',
    method: 'get',
    params:{
      type:3,
      topicId:id
    }
  })
 }
 // 发布评论
export const postComment = (data) => {
  return request({
    url: '/api/comments',
    method: 'post',
    data
  })
 }
//  根据讨论id获取动态
export const getCommentById = (id) => {
  return request({
    url: `/api/talks/${id}`,
    method: 'get'
  })
 }
 //  上传动态图片
export const postDynamicImg = (file) => {
  return request({
    url: '/api/admin/talks/images',
    method: 'post',
    data:file,
    headers: {
      // 表示上传的是文件,而不是普通的表单数据
      'Content-Type': 'multipart/form-data'
    }
  })
 }
 //  发布动态
export const postDynamic = (data) => {
  return request({
    url: '/api/admin/talks',
    method: 'post',
    data
  })
 }
  //  删除动态
export const daleteDynamic = (data) => {
  return request({
    url: '/api/admin/talks',
    method: 'post',
    data
  })
 }