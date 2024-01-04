import request from '@/router/axios.js';
// 删除文章
export const deleteArticle= (id) => {
  return request({
    url: '/api/articles',
    method: 'post',
    data:{
      isDelete:1,
      id
    }
  })
 }
// 获取创作者中心首页内容
export const getCreatorHome= () => {
  return request({
    url: '/api/compose/home',
    method: 'get',
  })
 }
 // 通过作者id获取全部文章
export const getAllArticle = (data) => {
  return request({
    url: '/api/articles/archives',
    method: 'get',
    params:data
  })
 }
//  获取文章管理页面所有统计
export const getAllStatistics= () => {
  return request({
    url: '/api/articles',
    method: 'get',
  })
 }
      // 获取文章分类
export const getArticleClass = () => {
  return request({
    url: '/api/categories',
    method: 'get',
  })
 }
       // 获取文章标签
export const getArticleTags = () => {
  return request({
    url: '/api/tags',
    method: 'get',
  })
 }
//  上传文章图片
export const uploadArticlePicture= (file) => {
  return request({
    url: '/api/admin/articles/images',
    method: 'post',
    data:{
      file
    },
    headers: {
      // 表示上传的是文件,而不是普通的表单数据
      'Content-Type': 'multipart/form-data'
    }
  })
 }
 //  上传文章
export const uploadArticle= (data) => {
  return request({
    url: '/api/articles',
    method: 'post',
    data
    
  })
 }
  //   常见问题
export const getCommonProblem= () => {
  return request({
    url: '/api/helps',
    method: 'get',
  })
 }
