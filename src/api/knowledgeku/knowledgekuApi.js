import request from '@/utils/request';
// list
export const knowledgekuList = (params) => {
    return request({
        url: '/knowledgeku/page',
        method: 'post',
        data: params,
    })
};
export const knowledgekuDetail = (id) => {
    return request({
        url: '/knowledgeku/'+id,
        method: 'get',
    })
};
export const getByzhujian = (zhujian) => {
    return request({
        url: '/knowledgeku/getByzhujian/'+zhujian,
        method: 'get',
    })
};
// add
export const knowledgekuSave = (params) => {
    return request({
        url: '/knowledgeku',
        method: 'post',
        data: params,
    })
};
// updt
export const knowledgekuEdit = (params) => {
    return request({
        url: '/knowledgeku',
        method: 'put',
        data: params,
    })
};
export const knowledgekuEditByzhujian = (params) => {
    return request({
        url: '/knowledgeku/updateByzhujian',
        method: 'put',
        data: params,
    })
};
// delete
export const knowledgekuDelete = (id) => {
    return request({
        url: '/knowledgeku/'+id,
        method: 'delete',
    })
};
// pldel
export const knowledgekuDeleteList = (knowledgekus) => {
    return request({
        url: '/knowledgeku/deleteList',
        data:{list:knowledgekus},
        method: 'post',
    })
};
// all
export const knowledgekuAllList = () => {
    return request({
        url: '/knowledgeku',
        method: 'get',
    })
};


export const knowledgeku_tj_zs = () => {return request({url: '/knowledgeku/knowledgeku_tj_zs',method: 'get',})};
