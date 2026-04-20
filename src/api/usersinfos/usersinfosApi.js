import request from '@/utils/request';
// list
export const usersinfosList = (params) => {
    return request({
        url: '/usersinfos/page',
        method: 'post',
        data: params,
    })
};
export const usersinfosDetail = (id) => {
    return request({
        url: '/usersinfos/'+id,
        method: 'get',
    })
};
export const getByzhujian = (zhujian) => {
    return request({
        url: '/usersinfos/getByzhujian/'+zhujian,
        method: 'get',
    })
};
// add
export const usersinfosSave = (params) => {
    return request({
        url: '/usersinfos',
        method: 'post',
        data: params,
    })
};
// updt
export const usersinfosEdit = (params) => {
    return request({
        url: '/usersinfos',
        method: 'put',
        data: params,
    })
};
export const usersinfosEditByzhujian = (params) => {
    return request({
        url: '/usersinfos/updateByzhujian',
        method: 'put',
        data: params,
    })
};
// delete
export const usersinfosDelete = (id) => {
    return request({
        url: '/usersinfos/'+id,
        method: 'delete',
    })
};
// pldel
export const usersinfosDeleteList = (usersinfoss) => {
    return request({
        url: '/usersinfos/deleteList',
        data:{list:usersinfoss},
        method: 'post',
    })
};
// all
export const usersinfosAllList = () => {
    return request({
        url: '/usersinfos',
        method: 'get',
    })
};
export const usersinfosUpdatePassword = (params) =>{ return request({ url: `/usersinfos/updatePassword`, method: 'put',data: {...params,pwd:params.password}, })};

export const usersinfos_tj_zs = () => {return request({url: '/usersinfos/usersinfos_tj_zs',method: 'get',})};
