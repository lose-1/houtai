import request from '@/utils/request';
// list
export const wenjiantijiaoList = (params) => {
    return request({
        url: '/wenjiantijiao/page',
        method: 'post',
        data: params,
    })
};
export const wenjiantijiaoDetail = (id) => {
    return request({
        url: '/wenjiantijiao/'+id,
        method: 'get',
    })
};
export const getByzhujian = (zhujian) => {
    return request({
        url: '/wenjiantijiao/getByzhujian/'+zhujian,
        method: 'get',
    })
};
// add
export const wenjiantijiaoSave = (params) => {
    return request({
        url: '/wenjiantijiao',
        method: 'post',
        data: params,
    })
};
// updt
export const wenjiantijiaoEdit = (params) => {
    return request({
        url: '/wenjiantijiao',
        method: 'put',
        data: params,
    })
};
export const wenjiantijiaoEditByzhujian = (params) => {
    return request({
        url: '/wenjiantijiao/updateByzhujian',
        method: 'put',
        data: params,
    })
};
// delete
export const wenjiantijiaoDelete = (id) => {
    return request({
        url: '/wenjiantijiao/'+id,
        method: 'delete',
    })
};
// pldel
export const wenjiantijiaoDeleteList = (wenjiantijiaos) => {
    return request({
        url: '/wenjiantijiao/deleteList',
        data:{list:wenjiantijiaos},
        method: 'post',
    })
};
// all
export const wenjiantijiaoAllList = () => {
    return request({
        url: '/wenjiantijiao',
        method: 'get',
    })
};

export const wenjiantijiao_tj_leixing = () => {return request({url: '/wenjiantijiao/wenjiantijiao_tj_leixing',method: 'get',})};
export const wenjiantijiao_tj_zs = () => {return request({url: '/wenjiantijiao/wenjiantijiao_tj_zs',method: 'get',})};
