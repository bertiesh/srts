import request from '@/router/axios.js';
// 获取最近文章
export const getArticleList = (size,current) => {
 return request({
   url: '/api/articles/archives',
   method: 'get',
   params:{
    size,current,
    status:1,
    isReview:3
}
 })
}
// 通过作者id获取文章
export const getArticleByUserId = (size,current,userInfoId) => {
  return request({
    url: '/api/articles/archives',
    method: 'get',
    params:{
     size,current,
     userInfoId,
     status:1,
    isReview:3
 }
  })
 }
 // 获取文章评论
 export const getCommentList= (id) => {
    return request({
      url: '/api/comments',
      method: 'get',
      params:{
        type:1,
        topicId:id
      }
    })
   }
    // 获取wendang评论
 export const getDocumentList= (id) => {
  return request({
    url: '/api/comments',
    method: 'get',
    params:{
      type:2,
      topicId:id
    }
  })
 }
   // 给文章点赞
export const giveArticleLike = (id) => {
    return request({
      url: `/api/articles/${id}/like`,
      method: 'post',
    })
   }
  //  根据id查看文件详情
  export const getArticleById= (id) => {
    return request({
      url: `/api/articles/${id}`,
      method: 'get',
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
  