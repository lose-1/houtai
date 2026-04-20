import request from '@/utils/request';
// list
export const zhanneixinList = (params) => {
    return request({
        url: '/zhanneixin/page',
        method: 'post',
        data: params,
    })
};
export const zhanneixinDetail = (id) => {
    return request({
        url: '/zhanneixin/'+id,
        method: 'get',
    })
};
// add
export const zhanneixinSave = (params) => {
    return request({
        url: '/zhanneixin',
        method: 'post',
        data: params,
    })
};
// updt
export const zhanneixinEdit = (params) => {
    return request({
        url: '/zhanneixin',
        method: 'put',
        data: params,
    })
};
// delete
export const zhanneixinDelete = (id) => {
    return request({
        url: '/zhanneixin/'+id,
        method: 'delete',
    })
};
// pldel
export const zhanneixinDeleteList = (zhanneixins) => {
    return request({
        url: '/zhanneixin/deleteList',
        data:{list:zhanneixins},
        method: 'post',
    })
};
// all
export const zhanneixinAllList = () => {
    return request({
        url: '/zhanneixin',
        method: 'get',
    })
};

