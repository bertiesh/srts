import request from '@/router/axios.js';
   // 获取文档数据
   export const getDocumentList = (current,size) => {
    return request({
      url: '/api/files/collections',
      method: 'get',
      params:{
        type:1,
        current,
        size
      }
    })
  }
     // 根据id文档详情
     export const getDocumentDetails = (id) => {
      return request({
        url: `/api/collections/${id}/files`,
        method: 'get'
      })
    }
   // 获取视频数据
   export const getVideoList = (current,size) => {
    return request({
      url: '/api/files/collections',
      method: 'get',
      params:{
        type:2,
        current,
        size
      }
    })
  }
     // 获取热榜数据
     export const getHotList = () => {
      return request({
        url: '/api/files/collections/rank',
        method: 'get',
      })
    }
    // 最近在看
    export const getLastList = () => {
      return request({
        url: '/api/files/collections/last',
        method: 'get',
      })
    }
    // 根据习题id获取习题
    export const getExerciseById= (id) => {
      return request({
        url: `/api/project/${id}/info`,
        method: 'get',
      })
    }
    // 发送做完的习题
    export const postExercise= (data) => {
      return request({
        url: `/api/projects/post`,
        method: 'post',
        data
      })
    }
     // 积分兑换文档
    export const exchangeDocument= (data) => {
      return request({
        url: `/api/users/collection`,
        method: 'put',
        data
      })
    }
     // 积分兑换文档
     export const haveDoneExercise= (id) => {
      return request({
        url: `/api/project/${id}/history`,
        method: 'get',
      })
    }