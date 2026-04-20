<template>
	<div>
		<div class="card">
			<div class="card-header"><h4>法律分类列表</h4></div>
			<div class="card-body">
				<el-form :inline="true" :model="formInline"  class="form-inline" >
					<el-form-item label=""><el-input size="small"  v-model="formInline.types" placeholder="输入分类"></el-input></el-form-item>			
					<el-form-item><el-button size="small"  class="btn btn-default"  @click="search"><span class='el-icon-loading'></span>查找</el-button></el-form-item>
				</el-form>
		<div class="panel admin-panel">

			<div class="padding border-bottom">
				<button class="btn btn-danger m-r-5" type="button" style="float:right"  onClick="window.print();" ><span class="el-icon-s-goods"></span> 打印</button>
				
			</div>
			<el-table class="table table-bordered table-hover"  :data="listData" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" @selection-change="handleSelectionChange">
				<el-table-column align="center" type="selection" width="60"></el-table-column>
				<el-table-column sortable prop="types" label="分类"></el-table-column>			
				<el-table-column align="center" label="操作"  min-width="160" width="280px;">
					<template slot-scope="scope">
					<!--lianjie1-->
					</template>
				</el-table-column>
			</el-table>
		</div>
		<Pagination v-bind:child-msg="pageparm" @callFather="callFather" ></Pagination>

		
	</div>
</div>
</div>
</template>
<script>
import Pagination from "@/layout/pagination/Pagination";
import { lawtypesList, lawtypesSave, lawtypesDelete,lawtypesEdit,lawtypesDeleteList } from '@/api/lawtypes/lawtypesApi';

import {Session} from "@/utils/storage";
export default {
	name: 'user',
	data() {
		return {
			loading: false, //是显示加载
			title: '',
			editFormVisible: false, //控制编辑页面显示与隐藏
			
			editForm: {
			},
			user:[],
			username:'',
			cx:'',
			
			rules: {
				types: [{ required: true, message: '请输入分类', trigger: 'blur' },				],				memo: [{ required: true, message: '请输入备注', trigger: 'blur' },				],				
			},
			
			formInline: {
				page: 1,
				limit: 10,
			},
			
			
			listData: [],
			lawtypess:[],
			checkmenu: [],
			pageparm: {
				currentPage: 1,
				pageSize: 10,
				total: 0
			}
		};
	},
	computed:{
		headers(){
			return {"token":Session.get("token")}
		}
	},
	watch: {
			'$route' (to, from) {
				// 路由发生变化页面刷新
				this.$router.go(0);
			}
		},
	components: {
		Pagination
	},
	created() {
		
		if (!Session.get('userInfo')) return false;
		this.userInfo = Session.get('userInfo');
		this.username=localStorage.getItem("username");
		this.cx=localStorage.getItem("cx");
		
		this.getdata(this.formInline)
		
	},
	methods: {
		getdata(parameter) {
			lawtypesList(parameter)
					.then(res => {
						this.loading = false
						if (res.success == false) {
							this.$message({
								type: 'info',
								message: res.msg
							})
						} else {
							this.listData = res.data.list
							
							// 分页赋值
							this.pageparm.currentPage = this.formInline.current
							this.pageparm.pageSize = this.formInline.currentNum
							this.pageparm.total = res.data.total
						}
					})
					.catch(err => {
						this.loading = false
						this.$message.error('菜单加载失败，请稍后再试！')
					})
		},
		//qixuzhijixsuan3
		// 分页插件事件
		callFather(parm) {
			this.formInline.current = parm.currentPage
			this.getdata(this.formInline)
		},
		//xia2sui1
		// 搜索事件
		search() {
			this.getdata(this.formInline)
		},
		//显示编辑界面
		addSalary(index,row){
				this.$router.push({
					name:'xmkuaixAdd',
					params:{
						id:row.id
					}
				})
			},
		
		
		
		// 关闭编辑、增加弹出框
		
	},
};
</script>
<style scoped lang="scss">
	@import './index.scss';
	@import "../../ny/css/bootstrap.min.css";
    @import "../../ny/css/materialdesignicons.min.css";
    @import "../../ny/css/style.min.css";
    @import "../../ny/css/jquery-confirm.min.css";
	::v-deep .el-input--small .el-input__inner{
		border-block-color: #454545;
	}
	::v-deep .el-table th{
		background-color: #ddd;
		solid-color: #00feff;
	}
	::v-deep .el-table thead{
		color: #3399ff;
		font-weight: 500;
	}
	::v-deep .el-table tr{
		/*background-color: yellow;*/
	}
	::v-deep .el-table__body tr.current-row>td{
		/*background:#bd93f9;*/
	}
	::v-deep .el-table th{
		background-color: #E2FDFE;
		color: #188716;
		font-weight: bold;
	}
</style>