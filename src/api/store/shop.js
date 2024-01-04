import request from '@/router/axios.js';
// 获取所有商品
export const getAllGoodsList = (data) => {
    return request({
        url: '/api/spu',
        method: 'get',
        params: data
    })
}
// 获取钱5个热门商品
export const getFiveGoodsList = () => {
    return request({
        url: '/api/spu',
        method: 'get',
        params: {
            current:1,
            size:5,
            type:3
        }
    })
}
// 根据id获取商品
export const getGoodsById = (id) => {
    return request({
        url: `/api/spu/${id}`,
        method: 'get',
    })
}
// 添加购物车
export const addGoodsToShop = (data) => {
    return request({
        url: '/api/shoppingCart',
        method: 'post',
        data
    })
}
// 获取省市区
export const getCityList = () => {
    return request({
        url: '/api/regions',
        method: 'get',
    })
}
// 获取用户地址
export const getUserAddressList = () => {
    return request({
        url: '/api/address',
        method: 'get',
    })
}
// 添加用户地址
export const postUserAddress = (data) => {
    return request({
        url: '/api/address',
        method: 'post',
        data
    })
}
// 获取用户所有订单
export const getUserAllGoods = (data) => {
    return request({
        url: '/api/order',
        method: 'get',
        params:data
    })
}
// 获取用户购物车
export const getUserAllShoppingList = (data) => {
    return request({
        url: '/api/shoppingCart',
        method: 'get',
        params:data
    })
}
// 操作用户购物车
export const updateUserAllShopping = (data) => {
    return request({
        url: '/api/shoppingCart',
        method: 'post',
        data
    })
}
// 根据id获取用户购物车
export const getUserShoppingById = (id) => {
    return request({
        url: `/api/shoppingCart/${id}`,
        method: 'get',
    })
}
// 用户下单(确认收货)
export const submitUserOrder = (data) => {
    return request({
        url: '/api/order',
        method: 'post',
        data
    })
}
// 用户取消订单
export const cancelUserOrder = (id) => {
    return request({
        url: `/api/order/${id}`,
        method: 'get',
    })
}
// 用户获取下单商品订单信息
export const getUserOrderNew = (data)=> {
    return request({
        url: '/api/order',
        method: 'get',
        params:data
    })
}
// // 用户获取下单商品订单物流
// export const getUserLogistics= (data)=> {
//     return request({
//         url: '/api/order',
//         method: 'get',
//         params:data
//     })
// }