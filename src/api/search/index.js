import request from '@/router/axios.js';
// 搜索文章
export const searchArticle = (keywords) => {
 return request({
   url: '/api/articles/search',
   method: 'get',
   params:{
    keywords
   }
 })
}