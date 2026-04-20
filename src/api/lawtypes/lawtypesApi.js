import request from '@/utils/request';
// list
export const lawtypesList = (params) => {
    return request({
        url: '/lawtypes/page',
        method: 'post',
        data: params,
    })
};
export const lawtypesDetail = (id) => {
    return request({
        url: '/lawtypes/'+id,
        method: 'get',
    })
};
export const getByzhujian = (zhujian) => {
    return request({
        url: '/lawtypes/getByzhujian/'+zhujian,
        method: 'get',
    })
};
// add
export const lawtypesSave = (params) => {
    return request({
        url: '/lawtypes',
        method: 'post',
        data: params,
    })
};
// updt
export const lawtypesEdit = (params) => {
    return request({
        url: '/lawtypes',
        method: 'put',
        data: params,
    })
};
export const lawtypesEditByzhujian = (params) => {
    return request({
        url: '/lawtypes/updateByzhujian',
        method: 'put',
        data: params,
    })
};
// delete
export const lawtypesDelete = (id) => {
    return request({
        url: '/lawtypes/'+id,
        method: 'delete',
    })
};
// pldel
export const lawtypesDeleteList = (lawtypess) => {
    return request({
        url: '/lawtypes/deleteList',
        data:{list:lawtypess},
        method: 'post',
    })
};
// all
export const lawtypesAllList = () => {
    return request({
        url: '/lawtypes',
        method: 'get',
    })
};


export const lawtypes_tj_zs = () => {return request({url: '/lawtypes/lawtypes_tj_zs',method: 'get',})};
