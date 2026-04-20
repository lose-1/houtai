import request from '@/utils/request';
// list
export const adminsList = (params) => {
    return request({
        url: '/admins/page',
        method: 'post',
        data: params,
    })
};
export const adminsDetail = (id) => {
    return request({
        url: '/admins/'+id,
        method: 'get',
    })
};
// add
export const adminsSave = (params) => {
    return request({
        url: '/admins',
        method: 'post',
        data: params,
    })
};
// updt
export const adminsEdit = (params) => {
    return request({
        url: '/admins',
        method: 'put',
        data: params,
    })
};
// delete
export const adminsDelete = (id) => {
    return request({
        url: '/admins/'+id,
        method: 'delete',
    })
};
// pldel
export const adminsDeleteList = (adminss) => {
    return request({
        url: '/admins/deleteList',
        data:{list:adminss},
        method: 'post',
    })
};
// all
export const adminsAllList = () => {
    return request({
        url: '/admins',
        method: 'get',
    })
};
export const adminsUpdatePassword = (params) =>{ return request({ url: `/admins/updatePassword`, method: 'put',data: {...params,pwd:params.password}, })};