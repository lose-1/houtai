<template>
	<div>
		<div class="card">
			<div class="card-header"><h4>用户信息列表</h4></div>
			<div class="card-body">
				<el-form :inline="true" :model="formInline"  class="form-inline" >
					<el-form-item label=""><el-input size="small"  v-model="formInline.usernames" placeholder="输入用户名"></el-input></el-form-item>			<el-form-item label=""><el-input size="small"  v-model="formInline.names" placeholder="输入姓名"></el-input></el-form-item>			
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
				<el-table-column sortable prop="usernames" label="用户名"></el-table-column>			<el-table-column sortable prop="names" label="姓名"></el-table-column>			<el-table-column align="center" sortable prop="gender" label="性别" width="100px;" ><template slot-scope="scope"><el-button style="border: 0" @click="editgender(scope.$index, scope.row)"  v-if="scope.row.gender == true"><img src="../../ny/nan.gif" /></el-button><el-button style="border: 0" @click="editgender(scope.$index, scope.row)"  v-else  ><img src="../../ny/nv.gif" /></el-button></template></el-table-column><el-table-column sortable prop="phone" label="手机"></el-table-column>			<el-table-column sortable prop="idcard" label="身份证"></el-table-column>			<el-table-column align='center' prop='touxiang' label='头像' width='100'><template slot-scope='scope'><el-image :src='scope.row.touxiang' style='height:70px'  v-if="scope.row.touxiang"/><img src="../../../static/images/guanli.jpg" style='height:70px' v-else/></template></el-table-column>			<el-table-column sortable prop="memo" label="备注"></el-table-column>			
				<el-table-column align="center" label="操作"  min-width="160" width="280px;">
					<template slot-scope="scope">
					
					<!--liangbuan-->
					<button class="btn btn-success" @click="chongzhimima(scope.$index, scope.row)" v-if="userInfo.roles[0] == 'admins'" style="cursor:pointer"><i class="el-icon-paperclip"></i>密</button>&nbsp;
					<!--zhixfuanniu-->
					
					<button class="btn btn-primary"  @click="handleEdit(scope.$index, scope.row)" v-if="userInfo.roles[0] == 'admins'  "  style="cursor:pointer"><i class="mdi mdi-delete-empty"></i>改</button>&nbsp;
					<button class="btn btn-warning" @click="deleteUsersinfos(scope.$index, scope.row)" v-if="userInfo.roles[0] == 'admins'  "  style="cursor:pointer"><i class="mdi mdi-close"></i>删</button>&nbsp;
					<button class='btn btn-info' @click="handleDetail(scope.$index, scope.row)"><i class='mdi mdi-arrow-expand-all'></i>详</button>
					
					</template>
				</el-table-column>
			</el-table>
		</div>
		<Pagination v-bind:child-msg="pageparm" @callFather="callFather" ></Pagination>

		<el-dialog :title="title" :visible.sync="editFormVisible" width="30%" @click="closeDialog">
			<el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm">
				<el-form-item  label="用户名" prop="usernames"><el-input size="small" v-model="editForm.usernames" auto-complete="off" placeholder="请输入用户名" style='width:50%'></el-input></el-form-item>		<el-form-item  label="姓名" prop="names"><el-input size="small" v-model="editForm.names" auto-complete="off" placeholder="请输入姓名" style='width:50%'></el-input></el-form-item>		<el-form-item  label="性别" prop="gender" ><el-radio v-model="editForm.gender" :label=true>男</el-radio><el-radio v-model="editForm.gender" :label=false>女</el-radio></el-form-item>				<el-form-item  label="手机" prop="phone"><el-input size="small" v-model="editForm.phone" auto-complete="off" placeholder="请输入手机" style='width:50%'></el-input></el-form-item>		<el-form-item  label="身份证" prop="idcard"><el-input size="small" v-model="editForm.idcard" auto-complete="off" placeholder="请输入身份证" style='width:50%'></el-input></el-form-item>		<el-form-item  label='头像' prop='touxiang'><el-upload class='avatar-uploader' action='http://localhost:9999/files/upload' :headers='headers' :show-file-list='false' :on-success='handleTouxiangSuccess' :before-upload='beforeTouxiangUpload'><img v-if='editForm.touxiang' :src='editForm.touxiang' class='avatar'><i v-else class='el-icon-plus avatar-uploader-icon'></i></el-upload></el-form-item>		<el-form-item  label="备注" prop="memo"><el-input size="small" v-model="editForm.memo" auto-complete="off" placeholder="请输入备注" style='width:50%'></el-input></el-form-item>		
				
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button size="small" @click="closeDialog">取消</el-button>
				<el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm('editForm')">保存</el-button>
			</div>
		</el-dialog>
			
			
			<el-dialog :title="title" :visible.sync="detailFormVisible" width="60%" @click="closeDialogdetail">
			<table width="100%" border="0"  align="center" cellpadding="3" cellspacing="1" class="table table-striped table-bordered table-hover">
								<tr>
									<td width='11%' height=44>用户名：</td><td width='39%'>{{editForm.usernames}}</td><td  rowspan=7 align=center><el-upload class='avatar-uploader'  :headers='headers' :show-file-list='false'  ><img v-if='editForm.touxiang' :src='editForm.touxiang' class='avatar'><i v-else class='el-icon-plus avatar-uploader-icon'></i></el-upload></td></tr><tr><td width='11%' height=44>姓名：</td><td width='39%'>{{editForm.names}}</td></tr><tr><td width='11%' height=44>性别：</td><td width='39%'><div v-if="editForm.gender==1">男</div><div v-else>女</div></td></tr><tr><td width='11%' height=44>密码：</td><td width='39%'>{{editForm.pwd}}</td></tr><tr><td width='11%' height=44>手机：</td><td width='39%'>{{editForm.phone}}</td></tr><tr><td width='11%' height=44>身份证：</td><td width='39%'>{{editForm.idcard}}</td></tr><tr><td width='11%' height=44>备注：</td><td width='39%'>{{editForm.memo}}</td></tr><
							</table>
			


			<div slot="footer" class="dialog-footer">
				<el-button size="small" @click="closeDialogdetail">关闭</el-button>

			</div>
		</el-dialog>
			<!--zhixfudhk-->
	</div>
</div>
</div>
</template>
<script>
import Pagination from "@/layout/pagination/Pagination";
import { usersinfosList, usersinfosSave, usersinfosDelete,usersinfosEdit,usersinfosDeleteList } from '@/api/usersinfos/usersinfosApi';


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
			detailFormVisible: false,
			
			
			editForm: {
			},
			user:[],
			username:'',
			cx:'',
			
			rules: {
				usernames: [{ required: true, message: '请输入用户名', trigger: 'blur' },				],				names: [{ required: true, message: '请输入姓名', trigger: 'blur' },				],				idcard: [{ pattern:/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,required: true,message: '请输入正确身份证号',trigger: 'blur'}				],				
			},
			
			formInline: {
				page: 1,
				limit: 10,
			},
			
			
			listData: [],
			usersinfoss:[],
			
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
		chongzhimima(index, row) {
				usersinfosEdit({ id: row.id, pwd: "dc5c7986daef50c1e02ab09b442ee34f" }).then(res => {
					if (res.code === "0") {
						this.$message.success("操作成功,重置密码为001");
					} else {
						this.$message.error("操作失败!");
					}
				});
			},
		
		//yyriqibjdx
		//zxhifuff
		handleShenheList(){
				const usersinfoss = this.usersinfoss;
				if(usersinfoss.length == 0){
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
						usersinfoss.forEach(item=> {
							let data = {...item, issh: 1}
							usersinfosEdit(data).then(res => {})
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
			usersinfosList(parameter)
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
				this.title = '修改用户信息'
				this.editForm = row
				//yxixaoduo
			} else {
				this.title = '添加用户信息'
				this.editForm = {}
				
				
				//zixdonxgbianxhao1
			}
		},
		daochu(){
			axios.get('/usersinfos/getExcel', {
				responseType: 'blob',
				headers: { token: Session.get("token"), 'Content-Type': 'application/x-download' }
			}).then((res) => {
				if (res.status === 200) {
					var a = document.createElement('a')
					var blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
					var href = window.URL.createObjectURL(blob)
					a.href = href
					a.download = '用户信息.xlsx'
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
		
		handleDetail: function (index, row) {
			this.detailFormVisible = true
			if (row != undefined && row != 'undefined') {
				this.title = '用户信息详细'
				this.editForm = row
			}
			
		},
		closeDialogdetail() {
				this.getdata(this.formInline)
				this.detailFormVisible = false
			},
		//liangbuedit
		// 编辑、增加页面保存方法
		submitForm(editData) {
			
			//xiaduxxo
			
			
			this.$refs[editData].validate(valid => {
				if (valid) {
					if(this.editForm.id){
						usersinfosEdit(this.editForm).then(res => {
							this.editFormVisible = false
							
							this.loading = false
							if (res.code == '0') {
								this.getdata(this.formInline)
								this.$message({
									type: 'success',
									message: '用户信息修改成功！'
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
						usersinfosSave(this.editForm).then(res => {
							this.editFormVisible = false
							this.loading = false
							if (res.code == '0') {
								
								this.getdata(this.formInline)
								this.$message({
									type: 'success',
									message: '用户信息添加成功！'
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
		deleteUsersinfos(index, row) {
			this.$confirm('确定要删除吗?', '信息', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				usersinfosDelete(row.id).then(res => {
					if (res.code == '0') {
						this.$message({
								type: 'success',
							message: '用户信息已删除!'
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
			this.usersinfoss = val;
		},
		handleDeleteList(){
			const usersinfoss = this.usersinfoss;
			if(usersinfoss.length == 0){
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
					usersinfosDeleteList(usersinfoss).then(res => {
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
		editgender(index,row){
			let data = {...row,gender:!row.gender}
			usersinfosEdit(data).then(res => {
				this.editFormVisible = false
				this.loading = false
				if (res.code == '0') {
					this.getdata(this.formInline)
					this.$message({
						type: 'success',
						message: '性别修改成功！'
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
		},		//xuaxnzeshxifou
		
		
		
		handleTouxiangSuccess(res, file) {
				if(res.code == "0") {
					this.editForm.touxiang = "/files/download/"+res.data.id
					this.$forceUpdate()
				}
			},
			beforeTouxiangUpload(file) {
				const isJPG = file.type === 'image/jpeg';
				const isLt2M = file.size / 1024 / 1024 < 2;

				if (!isJPG) {
					this.$message.error('上传图片只能是 JPG 格式!');
				}
				if (!isLt2M) {
					this.$message.error('上传图片大小不能超过 2MB!');
				}
				return isJPG && isLt2M;
			},				
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