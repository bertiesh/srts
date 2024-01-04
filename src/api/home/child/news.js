import request from '@/router/axios.js';
// 页面右边获取最新咨询
export const getLatestNewsList = () => {
    return request({
      url: '/api/articles/archives',
      method: 'get',
      params:{
       size:5,
       current:1,
       status:1,
       isReview:3,
       categoryId:1
   }
    })
   }
   // 获取所有咨询
export const getAllNewsList = (size,current) => {
    return request({
      url: '/api/articles/archives',
      method: 'get',
      params:{
       size,
       current,
       status:1,
       isReview:3,
       categoryId:1
   }
    })
   }