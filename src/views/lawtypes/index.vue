<template>
	<div>
		<div class="card">
			<div class="card-header"><h4>票据分类列表</h4></div>
			<div class="card-body">
				<el-form :inline="true" :model="formInline"  class="form-inline" >
					<el-form-item label=""><el-input size="small"  v-model="formInline.types" placeholder="输入分类"></el-input></el-form-item>
			
					<el-form-item><el-button size="small"  class="btn btn-default"  @click="search"><span class='el-icon-loading'></span>查找</el-button></el-form-item>
				</el-form>
		<div class="panel admin-panel">

			<div class="padding border-bottom">
				<button class="btn btn-danger m-r-5" type="button" style="float:right"  onClick="window.print();" ><span class="el-icon-s-goods"></span> 打印</button>
				<button class="btn btn-success m-r-5" style="float:right"  @click="handleDeleteList()" v-if="userInfo.roles[0] == 'admins'" ><span class="el-icon-delete"></span> 批量删除</button>
				<button class="btn btn-warning m-r-5" style="float:right"  @click="daochu()"><span class="el-icon-setting"></span> 导出excel</button>
				<button class="btn btn-info m-r-5" style="float:right" @click="handleEdit()"  ><span class="el-icon-star-on"></span>添加新数据</button>
			</div>
			<el-table class="table table-bordered table-hover"  :data="listData" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" @selection-change="handleSelectionChange">
				<el-table-column align="center" type="selection" width="60"></el-table-column>
				<el-table-column sortable prop="types" label="分类"></el-table-column>
			
				<el-table-column align="center" label="操作"  min-width="160" width="280px;">
					<template slot-scope="scope">
					
					<!--liangbuan-->
					
					<!--zhixfuanniu-->

					<button class="btn btn-primary"  @click="handleEdit(scope.$index, scope.row)" v-if="userInfo.roles[0] == 'admins'  "  style="cursor:pointer"><i class="mdi mdi-delete-empty"></i>改</button>&nbsp;
					<button class="btn btn-warning" @click="deleteLawtypes(scope.$index, scope.row)" v-if="userInfo.roles[0] == 'admins'  "  style="cursor:pointer"><i class="mdi mdi-close"></i>删</button>&nbsp;
					
					
					</template>
				</el-table-column>
			</el-table>
		</div>
		<Pagination v-bind:child-msg="pageparm" @callFather="callFather" ></Pagination>

		<el-dialog :title="title" :visible.sync="editFormVisible" width="30%" @click="closeDialog">
			<el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm">
				<el-form-item  label="分类" prop="types"><el-input size="small" v-model="editForm.types" auto-complete="off" placeholder="请输入分类" style='width:50%'></el-input></el-form-item>
		<el-form-item  label="备注" prop="memo"><el-input type="textarea" size="small" v-model="editForm.memo" auto-complete="off" placeholder="请输入备注" style='width:100%'></el-input></el-form-item>
		
				
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button size="small" @click="closeDialog">取消</el-button>
				<el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm('editForm')">保存</el-button>
			</div>
		</el-dialog>
			
			
			<!--xiangxidhk-->
			<!--zhixfudhk-->
	</div>
</div>
</div>
</template>
<script>
import Pagination from "@/layout/pagination/Pagination";
import { lawtypesList, lawtypesSave, lawtypesDelete,lawtypesEdit,lawtypesDeleteList } from '@/api/lawtypes/lawtypesApi';


import {Session} from "@/utils/storage";
import axios from 'axios';
export default {
	name: 'user',
	data() {
		return {
			loading: false, //是显示加载
			title: '',
			
			editFormVisible: false, //控制编辑页面显示与隐藏
			payVisible: false,
			tempdingdanxinxi: '',
			id: '',
			radio: '',
			//detaitFormVsisisble
			
			
			editForm: {
			},
			user:[],
			username:'',
			cx:'',
			
			rules: {
				types: [{ required: true, message: '请输入分类', trigger: 'blur' },
				],
				memo: [{ required: true, message: '请输入备注', trigger: 'blur' },
				],
				
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
		
		
		//yyriqibjdx
		//zxhifuff
		handleShenheList(){
				const lawtypess = this.lawtypess;
				if(lawtypess.length == 0){
					this.$message({
						type: 'error',
						message: '请至少选择一项'
					})
				}else {
					this.$confirm('确定要批量审核吗?', '信息', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						lawtypess.forEach(item=> {
							let data = {...item, issh: 1}
							lawtypesEdit(data).then(res => {})
						})
						this.getdata(this.formInline)
						this.$message({
							type: 'success',
							message: '批量审核成功！'
						})
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消批量审核'
						})
					})
				}
			},
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
		
		// 分页插件事件
		callFather(parm) {
			this.formInline.current = parm.currentPage;
			this.formInline.currentNum = parm.pageSize;
			this.getdata(this.formInline)
		},
		
		// 搜索事件
		search() {
			this.getdata(this.formInline)
		},
		//显示编辑界面
		handleEdit: function (index, row) {
			this.editFormVisible = true
			if (row != undefined && row != 'undefined') {
				this.title = '修改票据分类'
				this.editForm = row
				//yxixaoduo
			} else {
				this.title = '添加票据分类'
				this.editForm = {}
				
				
				//zixdonxgbianxhao1
			}
		},
		daochu(){
			axios.get('/lawtypes/getExcel', {
				responseType: 'blob',
				headers: { token: Session.get("token"), 'Content-Type': 'application/x-download' }
			}).then((res) => {
				if (res.status === 200) {
					var a = document.createElement('a')
					var blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
					var href = window.URL.createObjectURL(blob)
					a.href = href
					a.download = '票据分类.xlsx'
					document.body.appendChild(a)
					a.click() 
					document.body.removeChild(a) 
					window.URL.revokeObjectURL(href)
				}
			}).catch((err) => {
				console.log(err)
			})
		},
		handleDaoruSuccess(res, file) {
				if(res.code == "0") {
					this.$message({
						type: 'success',
						message: '导入成功!'
					})
					this.getdata(this.formInline);
				}
			},
		beforeDaoruUpload(file) {
			const isJPG = file.type === 'application/vnd.ms-excel';
			if (!isJPG) {
				this.$message.error('上传只能是 excel 格式!');
			}
			return isJPG;
		},
		//zixdonxgbianxhao2
		
		
		//liangbuedit
		// 编辑、增加页面保存方法
		submitForm(editData) {
			
			//xiaduxxo
			
			
			this.$refs[editData].validate(valid => {
				if (valid) {
					if(this.editForm.id){
						lawtypesEdit(this.editForm).then(res => {
							this.editFormVisible = false
							
							this.loading = false
							if (res.code == '0') {
								this.getdata(this.formInline)
								this.$message({
									type: 'success',
									message: '票据分类修改成功！'
								})
							} else {
								this.$message({
									type: 'info',
									message: res.msg
								})
							}
						}).catch(err => {
							this.editFormVisible = false
							this.loading = false
							this.getdata(this.formInline)
						if(err){
								this.$message.error(err)
							}else {
								this.$message.error('操作失败，请稍后再试！')
							}
						})
					}else {
						lawtypesSave(this.editForm).then(res => {
							this.editFormVisible = false
							this.loading = false
							if (res.code == '0') {
								
								this.getdata(this.formInline)
								this.$message({
									type: 'success',
									message: '票据分类添加成功！'
								})
							} else {
								this.$message({
									type: 'info',
									message: res.msg
								})
							}
						}).catch(err => {
							this.editFormVisible = false
							this.loading = false
						if(err){
								this.$message.error(err)
							}else {
								this.$message.error('操作失败，请稍后再试！')
							}
						})
					}
				} else {
					return false
				}
			})
		},
		// 删除公司
		deleteLawtypes(index, row) {
			this.$confirm('确定要删除吗?', '信息', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				lawtypesDelete(row.id).then(res => {
					if (res.code == '0') {
						this.$message({
								type: 'success',
							message: '票据分类已删除!'
						})
						this.getdata(this.formInline)
					} else {
						this.$message({
							type: 'info',
							message: res.msg
						})
					}
				}).catch(err => {
					this.loading = false
					this.$message.error('操作失败，请稍后再试')
				})
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				})
			})
		},
		handleSelectionChange(val){
			this.lawtypess = val;
		},
		handleDeleteList(){
			const lawtypess = this.lawtypess;
			if(lawtypess.length == 0){
				this.$message({
					type: 'error',
					message: '请至少选择一项进行删除'
				})
			}else {
				this.$confirm('确定要批量删除吗?', '信息', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					lawtypesDeleteList(lawtypess).then(res => {
						if (res.code == '0') {
							this.$message({
								type: 'success',
								message: '批量删除成功!'
							})
							this.getdata(this.formInline)
						} else {
							this.$message({
								type: 'info',
								message: res.msg
							})
						}
					}).catch(err => {
						this.loading = false
						this.$message.error('操作失败，请稍后再试')
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					})
				})
			}
		},
		//xuaxnzeshxifou
		
		
		
		
		//youscwexnjiaxn
		// 关闭编辑、增加弹出框
		closeDialog() {
			this.getdata(this.formInline)
			this.editFormVisible = false
		}
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