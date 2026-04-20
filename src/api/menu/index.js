import request from '@/utils/request';

export function useMenuApi() {
	return {
		getMenuAdmins: (params) => {
			// 本地数据，路径：`/public/xxx.json`
			return request({
				url: './admins.json',
				method: 'get',
				params,
			});

		},
		getMenuUsers: (params) => {
			return request({
				url: './users.json',
				method: 'get',
				params,
			});
		},
		getMenuZhuguan: (params) => {
			return request({
				url: './zhuguan.json',
				method: 'get',
				params,
			});
		},

		
	};
}
