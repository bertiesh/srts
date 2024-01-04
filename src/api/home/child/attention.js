import request from '@/router/axios.js';
// 获取关注文章
export const getArticleList = (size,current) => {
 return request({
   url: '/api/articles/follow',
   method: 'get',
   params:{
    size,current
}
 })
}