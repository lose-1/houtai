<template>
	<div>
		<el-form :inline="true" :model="formInline" class="user-search">
			<el-form-item label=""><el-input size="small" v-model="formInline.biaoti" placeholder="输入标题"></el-input></el-form-item>
			<el-form-item label=""><el-input size="small" v-model="formInline.neirong" placeholder="输入内容"></el-input></el-form-item>
			
			<el-form-item>
				<el-button size="small" type="warning" icon="el-icon-search" @click="search">搜索</el-button>
				<el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit()" v-if="userInfo.roles[0] == 'users'">添加</el-button>
				<el-button size="small" type="success" icon="el-icon-s-data" @click="daochu()" v-if="userInfo.roles[0] == 'admins'">导出</el-button>
				<el-button size="small" type="danger" icon="el-icon-delete" @click="handleDeleteList()" v-if="userInfo.roles[0] == 'admins'">批量删除</el-button>
				
			</el-form-item>
			<el-form-item>
				<el-upload class="upload-demo" style="float: left; padding-right: 10px;" action='http://localhost:9999/wenjiantijiao/upload' :headers='headers' :show-file-list='false' :on-success='handleDaoruSuccess' :before-upload='beforeDaoruUpload' ><el-button size="small" type="info" icon="el-icon-sell" v-if="userInfo.roles[0] == 'admins'">导入</el-button></el-upload>
			</el-form-item>
		</el-form>
		
		<el-table size="small" :data="listData" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" @selection-change="handleSelectionChange">
			<el-table-column align="center" type="selection" width="60"></el-table-column>
			<el-table-column sortable prop="biaoti" label="标题"></el-table-column>
			<el-table-column sortable prop="leixing" label="类型"></el-table-column>
			<el-table-column align='center' sortable prop='wenjian' label='文件' width='110'><template slot-scope='scope'><el-button size="mini" v-if="scope.row.wenjian" @click="download(scope.row.wenjian)">下载</el-button></template></el-table-column>
			<el-table-column sortable prop="yonghuming" label="用户名"></el-table-column>
			<el-table-column sortable prop="xingming" label="姓名"></el-table-column>
			<el-table-column sortable prop="shouji" label="手机"></el-table-column>
			<el-table-column sortable prop="issh" label="是否审核" width="110"></el-table-column>
			<el-table-column sortable prop="shhf" label="收审进度" min-width="110"></el-table-column>
			
			<el-table-column sortable prop="addtime" label="添加时间" width="140">
				<template slot-scope="scope">
					<div>{{scope.row.addtime|datePipe('yyyy-MM-dd hh:mm:ss')}}</div>
				</template>
			</el-table-column>
			
			<el-table-column align="center" label="操作" min-width="300">
				<template slot-scope="scope">
					<el-button size='mini' type='primary' @click='hsgshenhe(scope.$index, scope.row)' v-if="userInfo.roles[0] == 'admins'">审核</el-button>
					<!--liangbuan-->
					
					<el-button size="mini" type="success" @click="handleEdit(scope.$index, scope.row)" v-if="userInfo.roles[0] == 'admins'  || userInfo.roles[0] == 'users'">编辑</el-button>
					<el-button size="mini" type="danger" @click="deleteWenjiantijiao(scope.$index, scope.row)" v-if="userInfo.roles[0] == 'admins'  || userInfo.roles[0] == 'users'">删除</el-button>
					<el-button size='mini' type='primary' @click="handleDetail(scope.$index, scope.row)">详细</el-button>
					<!--zhixfuanniu-->
					
				</template>
			</el-table-column>
		</el-table>
		<Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
		
		<el-dialog :title="title" :visible.sync="editFormVisible" width="30%" @click="closeDialog">
			<el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm">
				<el-form-item  label="标题" prop="biaoti"><el-input size="small" v-model="editForm.biaoti" auto-complete="off" placeholder="请输入标题" style='width:50%'></el-input></el-form-item>
		<el-form-item  label="内容" prop="neirong"><el-input type="textarea" size="small" v-model="editForm.neirong" auto-complete="off" placeholder="请输入内容" style='width:100%'></el-input></el-form-item>
		<el-form-item  label="类型" prop="leixing"><el-input size="small" v-model="editForm.leixing" auto-complete="off" placeholder="请输入类型" style='width:50%'></el-input></el-form-item>
		<el-form-item  label='文件' prop='wenjian'><el-upload class='avatar-uploader' action='http://localhost:9999/files/uploadwenjian' :headers='headers' :show-file-list='false' :on-success='handleWenjianSuccess' ><el-button>上传</el-button></el-upload></el-form-item>
		<el-form-item  label="用户名" prop="yonghuming"><el-input size="small" v-model="editForm.yonghuming" auto-complete="off" placeholder="请输入用户名" style='width:50%' disabled></el-input></el-form-item>
		<el-form-item  label="姓名" prop="xingming"><el-input size="small" v-model="editForm.xingming" auto-complete="off" placeholder="请输入姓名" style='width:50%'></el-input></el-form-item>
		<el-form-item  label="手机" prop="shouji"><el-input size="small" v-model="editForm.shouji" auto-complete="off" placeholder="请输入手机" style='width:50%'></el-input></el-form-item>
		
				
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button size="small" @click="closeDialog">取消</el-button>
				<el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm('editForm')">保存</el-button>
			</div>
		</el-dialog>
			<el-dialog :title="titleissh" :visible.sync="isshdialog" width="30%" @click="closeisshdialog">
			<el-form label-width="120px" :model="editForm" :rules="rulesissh" ref="editFormissh">
				<el-form-item label="审核状态" prop="shenqingStatus">
					<el-radio v-model="editForm.issh" label="待审核">待审核</el-radio>
					<el-radio v-model="editForm.issh" label="已通过">已通过</el-radio>
					<el-radio v-model="editForm.issh" label="未通过">未通过</el-radio>
				</el-form-item>
				<el-form-item label="收审进度" prop="shhf"><el-input type="textarea" size="small" v-model="editForm.shhf" auto-complete="off" placeholder="请输入收审进度"></el-input></el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button size="small" @click="closeisshdialog">取消</el-button>
				<el-button size="small" type="primary" :loading="loading" class="title" @click="shenhe('editFormissh')">保存</el-button>
			</div>
		</el-dialog>
			
			<el-dialog :title="title" :visible.sync="detailFormVisible" width="60%" @click="closeDialogdetail">
			<table width="100%" border="0"  align="center" cellpadding="3" cellspacing="1" class="table table-striped table-bordered table-hover">
								<tr>
									<td width='11%' height='40px'>标题：</td><td width='39%'>{{editForm.biaoti}}</td>
     <td width='11%' height='40px'>内容：</td><td width='39%'>{{editForm.neirong}}</td></tr><tr>
     <td width='11%' height='40px'>类型：</td><td width='39%'>{{editForm.leixing}}</td>
     <td width='11%' height='40px'>文件：</td><td width='39%' height='40px'><el-button size="small" @click="download(editForm)">点此下载</el-button></td></tr><tr>
     <td width='11%' height='40px'>用户名：</td><td width='39%'>{{editForm.yonghuming}}</td>
     <td width='11%' height='40px'>姓名：</td><td width='39%'>{{editForm.xingming}}</td></tr><tr>
     <td width='11%' height='40px'>手机：</td><td width='39%'>{{editForm.shouji}}</td>
     <td>&nbsp;</td><td>&nbsp;</td></tr>
							</table>
			


			<div slot="footer" class="dialog-footer">
				<el-button size="small" @click="closeDialogdetail">关闭</el-button>

			</div>
		</el-dialog>
			<!--zhixfudhk-->
	</div>
</template>

<script>
import Pagination from "@/layout/pagination/Pagination";
import { wenjiantijiaoList, wenjiantijiaoSave, wenjiantijiaoDelete,wenjiantijiaoEdit,wenjiantijiaoDeleteList } from '@/api/wenjiantijiao/wenjiantijiaoApi';


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
			
			isshdialog: false, 
			
			editForm: {
			},
			user:[],
			username:'',
			cx:'',
			
			rules: {
				biaoti: [{ required: true, message: '请输入标题', trigger: 'blur' },
				],
				neirong: [{ required: true, message: '请输入内容', trigger: 'blur' },
				],
				
			},
			rulesissh: {shhf: [{ required: true, message: '请填写回复原因', trigger: 'blur' }],},
			formInline: {
				page: 1,
				limit: 10,
			},
			
			
			listData: [],
			wenjiantijiaos:[],
			
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
		if(this.userInfo.roles[0] == 'users'){this.formInline.yonghuming= this.username;}
		
		this.getdata(this.formInline)
		
	},
	methods: {
		
		
		//yyriqibjdx
		//zxhifuff
		handleShenheList(){
				const wenjiantijiaos = this.wenjiantijiaos;
				if(wenjiantijiaos.length == 0){
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
						wenjiantijiaos.forEach(item=> {
							let data = {...item, issh: 1}
							wenjiantijiaoEdit(data).then(res => {})
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
			wenjiantijiaoList(parameter)
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
				this.title = '修改票据提交'
				this.editForm = row
				//yxixaoduo
			} else {
				this.title = '添加票据提交'
				this.editForm = {}
				this.editForm.yonghuming= this.username;
				this.editForm.xingming= this.userInfo.names;
				this.editForm.shouji= this.userInfo.phone;
				
				//zixdonxgbianxhao1
			}
		},
		daochu(){
			axios.get('/wenjiantijiao/getExcel', {
				responseType: 'blob',
				headers: { token: Session.get("token"), 'Content-Type': 'application/x-download' }
			}).then((res) => {
				if (res.status === 200) {
					var a = document.createElement('a')
					var blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
					var href = window.URL.createObjectURL(blob)
					a.href = href
					a.download = '票据提交.xlsx'
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
				this.title = '票据提交详细'
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
						wenjiantijiaoEdit(this.editForm).then(res => {
							this.editFormVisible = false
							
							this.loading = false
							if (res.code == '0') {
								this.getdata(this.formInline)
								this.$message({
									type: 'success',
									message: '票据提交修改成功！'
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
						wenjiantijiaoSave(this.editForm).then(res => {
							this.editFormVisible = false
							this.loading = false
							if (res.code == '0') {
								
								this.getdata(this.formInline)
								this.$message({
									type: 'success',
									message: '票据提交添加成功！'
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
		deleteWenjiantijiao(index, row) {
			this.$confirm('确定要删除吗?', '信息', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				wenjiantijiaoDelete(row.id).then(res => {
					if (res.code == '0') {
						this.$message({
								type: 'success',
							message: '票据提交已删除!'
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
			this.wenjiantijiaos = val;
		},
		handleDeleteList(){
			const wenjiantijiaos = this.wenjiantijiaos;
			if(wenjiantijiaos.length == 0){
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
					wenjiantijiaoDeleteList(wenjiantijiaos).then(res => {
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
		hsgshenhe(index,row){
			this.isshdialog = true
			if (row != undefined && row != 'undefined') {
				this.titleissh = '审核'
				this.editForm = row
			} else {
				this.titleissh = '审核'
				this.editForm = {}
			}
			if(this.userInfo.roles[0] == 'user') {
				this.editForm.userId = this.userInfo.id;
			}
			//this.editForm.type = '审核'
		},
		closeisshdialog() {
			this.getdata(this.formInline)
			this.isshdialog = false
		},
		shenhe(editData) {
			this.$refs[editData].validate(valid => {
				if (valid) {
					if(this.editForm.id){
						wenjiantijiaoEdit(this.editForm).then(res => {
							this.isshdialog = false
							this.loading = false
							if (res.code == '0') {
								this.getdata(this.formInline)
								this.$message({
									type: 'success',
									message: '审核操作成功！'
								})
							} else {
								this.$message({
									type: 'info',
									message: res.msg
								})
							}
						}).catch(err => {
							this.isshdialog = false
							this.loading = false
							this.getdata(this.formInline)
							if(err){
								this.$message.error(err)
							}else {
								this.$message.error('操作失败，请 稍后再试！')
							}
						})
					}else {
						wenjiantijiaoSave(this.editForm).then(res => {
							this.isshdialog = false
							this.loading = false
							if (res.code == '0') {
								this.getdata(this.formInline)
								this.$message({
									type: 'success',
									message: '申请添加成功！'
								})
							} else {
								this.$message({
									type: 'info',
									message: res.msg
								})
							}
						}).catch(err => {
							this.isshdialog = false
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
		
		
		
		handleWenjianSuccess(res, file) {
				if(res.code == "0") {
					this.editForm.wenjian = "/files/download/"+res.data.id
					this.$message({
						type: 'success',
						message: '文件上传成功！'
					})
				}
				else {
					this.$message({
						type: 'info',
						message: res.msg
					})
				}
			},
			download(xx){
			location.href = xx;
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
</style>
