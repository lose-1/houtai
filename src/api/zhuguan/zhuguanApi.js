import request from '@/utils/request';
// list
export const zhuguanList = (params) => {
    return request({
        url: '/zhuguan/page',
        method: 'post',
        data: params,
    })
};
export const zhuguanDetail = (id) => {
    return request({
        url: '/zhuguan/' + id,
        method: 'get',
    })
};
// add
export const zhuguanSave = (params) => {
    return request({
        url: '/zhuguan',
        method: 'post',
        data: params,
    })
};
// updt
export const zhuguanEdit = (params) => {
    return request({
        url: '/zhuguan',
        method: 'put',
        data: params,
    })
};
// delete
export const zhuguanDelete = (id) => {
    return request({
        url: '/zhuguan/' + id,
        method: 'delete',
    })
};
// pldel
export const zhuguanDeleteList = (zhuguans) => {
    return request({
        url: '/zhuguan/deleteList',
        data: { list: zhuguans },
        method: 'post',
    })
};
// all
export const zhuguanAllList = () => {
    return request({
        url: '/zhuguan',
        method: 'get',
    })
};
export const zhuguanUpdatePassword = (params) => { return request({ url: `/zhuguan/updatePassword`, method: 'put', data: { ...params, mima: params.password }, }) };

