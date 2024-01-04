import request from '@/router/axios.js';
// 获取热榜文章
export const getHotArticle = () => {
    return request({
      url: '/api/articles/rank',
      method: 'get',
    })
   }