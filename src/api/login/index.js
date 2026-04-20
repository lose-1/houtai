import request from '@/utils/request';

export const login =(params) => {
	if(params.role == '管理员'){return request({url: '/admins/login',method: 'post',data: {yonghuming:params.username,pwd:params.password},});}
	else if(params.role == '用户'){return request({url: '/usersinfos/login',method: 'post',data: {usernames:params.username,pwd:params.password},});}
	else if(params.role == '老师'){return request({url: '/zhuguan/login',method: 'post',data: {zhuguanhao:params.username,mima:params.password},});}

	
	
}
export const register =(params) => {return request({url: '/usersinfos/register',method: 'post',data: {usernames:params.username,pwd:params.password},})}