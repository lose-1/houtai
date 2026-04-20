<template>
	<div>
		<el-form :inline="true" :model="formInline" class="user-search">
			<el-form-item label=""><el-input size="small" v-model="formInline.shoujianren" placeholder="输入收件人"></el-input></el-form-item>
			<el-form-item label=""><el-input size="small" v-model="formInline.fajianren" placeholder="输入发件人"></el-input></el-form-item>
			
			<el-form-item>
				<el-button size="small" type="warning" icon="el-icon-search" @click="search">搜索</el-button>
<!--				<el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit()" >添加</el-button>-->
				<el-button size="small" type="success" icon="el-icon-s-data" @click="daochu()">导出</el-button>
				<el-button size="small" type="danger" icon="el-icon-delete" @click="handleDeleteList()">批量删除</el-button>
				<el-button size="small" type="warning" icon="el-icon-finished" @click="handleShenheList()" >批量已读</el-button>
			</el-form-item>

		</el-form>
		 
		<el-table size="small" :data="listData" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" @selection-change="handleSelectionChange">
			<el-table-column align="center" type="selection" width="60"></el-table-column>
			<el-table-column sortable prop="shoujianren" label="收件人"></el-table-column>
			<el-table-column sortable prop="fajianren" label="发件人"></el-table-column>
			<el-table-column sortable prop="fasongjuese" label="发送角色">
				<template slot-scope="scope">
					<span>{{
						scope.row.fasongjuese === 'admins' ? '管理员' :

						scope.row.fasongjuese === 'users' ? '用户' :
						scope.row.fasongjuese
					}}</span>
				</template>
			</el-table-column>
			<el-table-column sortable prop="biaoti" label="标题"></el-table-column>
			<el-table-column sortable prop="jieshoujuese" label="接收角色">
				<template slot-scope="scope">
					<span>{{
						scope.row.jieshoujuese === 'admins' ? '管理员' :

						scope.row.jieshoujuese === 'users' ? '用户' :
						scope.row.jieshoujuese
					}}</span>
				</template>
			</el-table-column>
			<el-table-column align='center' sortable prop='fujian' label='附件' width='120'><template slot-scope='scope'><el-button @click="download(scope.row)">下载</el-button></template></el-table-column>
			<el-table-column  align="center" sortable prop="issh" label="是否已读" >
				<template slot-scope="scope" >
					<el-switch   v-model="scope.row.issh ? true : false" active-color="#13ce66" active-text="是" inactive-text="否" inactive-color="#ff4949" @change="editissh(scope.$index, scope.row)" ></el-switch>
				</template>
			</el-table-column>

			
			<el-table-column sortable prop="addtime" label="添加时间" width="160">
				<template slot-scope="scope">
					<div>{{scope.row.addtime|datePipe('yyyy-MM-dd hh:mm:ss')}}</div>
				</template>
			</el-table-column>
			
			<el-table-column align="center" label="操作" min-width="160">
				<template slot-scope="scope">
					
					<!--liangbuan-->
<!--					<el-button size="mini" type="success" @click="handleEdit(scope.$index, scope.row)" v-if="userInfo.roles[0] == 'admins'  || userInfo.roles[0] == 'yuangong' || userInfo.roles[0] == 'yuangong'">编辑</el-button>-->
					<el-button size="mini" type="danger" @click="deleteZhanneixin(scope.$index, scope.row)" v-if="userInfo.roles[0] == 'admins'  || userInfo.roles[0] == 'yuangong' || userInfo.roles[0] == 'yuangong'">删除</el-button>
					<el-button size='mini' type='primary' @click="handleDetail(scope.$index, scope.row)">详细</el-button>
					<!--zhixfuanniu-->
					
				</template>
			</el-table-column>
		</el-table>
		<Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
		
		<el-dialog :title="title" :visible.sync="editFormVisible" width="30%" @click="closeDialog">
			<el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm">
				<el-form-item  label="收件人" prop="shoujianren"><el-input size="small" v-model="editForm.shoujianren" auto-complete="off" placeholder="请输入收件人" style='width:50%'></el-input></el-form-item>
		<el-form-item  label="发件人" prop="fajianren"><el-input size="small" v-model="editForm.fajianren" auto-complete="off" placeholder="请输入发件人" style='width:50%'></el-input></el-form-item>
		<el-form-item  label="标题" prop="biaoti"><el-input size="small" v-model="editForm.biaoti" auto-complete="off" placeholder="请输入标题" style='width:50%'></el-input></el-form-item>
		<el-form-item  label="内容" prop="neirong"><el-input type="textarea" size="small" v-model="editForm.neirong" auto-complete="off" placeholder="请输入内容" style='width:100%'></el-input></el-form-item>
		<el-form-item  label='附件' prop='fujian'><el-upload class='avatar-uploader' action='http://localhost:9999/files/uploadwenjian' :headers='headers' :show-file-list='false' :on-success='handleFujianSuccess' ><el-button>上传</el-button></el-upload></el-form-item>
		
				
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button size="small" @click="closeDialog">取消</el-button>
				<el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm('editForm')">保存</el-button>
			</div>
		</el-dialog>

		<el-dialog :title="title" :visible.sync="detailFormVisible" width="60%" @click="closeDialogdetail">
			<table width="100%" border="1"  align="center" cellpadding="0" cellspacing="0" bordercolor="#FFCCFF" class="table table-striped table-bordered table-hover">
				<tr>
					<td width='11%' height='40px'>收件人：</td><td width='39%'>{{editForm.shoujianren}}</td>
					<td width='11%' height='40px'>发件人：</td><td width='39%'>{{editForm.fajianren}}</td></tr><tr>
				<td width='11%' height='40px'>发送角色：</td>
				<td width='39%'>{{
					editForm.fasongjuese === 'admins' ? '管理员' :

					editForm.fasongjuese === 'users' ? '用户' :
					editForm.fasongjuese
				}}</td>
				<td width='11%' height='40px'>接收角色：</td>
				<td width='39%'>{{
					editForm.jieshoujuese === 'admins' ? '管理员' :

					editForm.jieshoujuese === 'users' ? '用户' :
					editForm.jieshoujuese
				}}</td>
			</tr><tr>
				<td width='11%' height='40px'>标题：</td><td width='39%'>{{editForm.biaoti}}</td>
				<td width='11%' height='40px'>附件：</td>
				<td width='39%'><el-button size="small" @click="download(editForm)">点此下载</el-button></td>
			</tr><tr>
				<td width='11%' height='40px'>是否已读：</td><td width='39%'>{{editForm.issh == 1 ? '是' : '否'}}</td>
			</tr><tr>
				<td width='11%' height='151'>内容：</td>
				<td height='151' colspan="3">{{editForm.neirong}}</td>
			</tr>
			</table>





			<div slot="footer" class="dialog-footer">
				<el-button size="small" @click="closeDialogdetail">关闭</el-button>

			</div>
		</el-dialog>
			<!--xiangxidhk-->
			<!--zhixfudhk-->
	</div>
</template>

<script>
import Pagination from "@/layout/pagination/Pagination";
import { zhanneixinList, zhanneixinSave, zhanneixinDelete,zhanneixinEdit,zhanneixinDeleteList } from '@/api/zhanneixin/zhanneixinApi';


import {Session} from "@/utils/storage";
import axios from 'axios';
export default {
	name: 'user',
	data() {
		return {
			loading: false, //是显示加载
			title: '',
			detailFormVisible: false,
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
				shoujianren: [{ required: true, message: '请输入收件人', trigger: 'blur' },
				],
				fajianren: [{ required: true, message: '请输入发件人', trigger: 'blur' },
				],
				biaoti: [{ required: true, message: '请输入标题', trigger: 'blur' },
				],
				
			},
			
			formInline: {
				page: 1,
				limit: 10,
			},
			
			
			listData: [],
			zhanneixins:[],
			
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
		this.formInline.shoujianren= this.username;

		
		this.getdata(this.formInline)
		
	},
	methods: {
		handleDetail: function (index, row) {
			this.detailFormVisible = true
			if (row != undefined && row != 'undefined') {
				this.title = '在线留言详细'
				this.editForm = row
			}

		},
		closeDialogdetail() {
			this.getdata(this.formInline)
			this.detailFormVisible = false
		},
		//zxhifuff
		handleShenheList(){
				const zhanneixins = this.zhanneixins;
				if(zhanneixins.length == 0){
					this.$message({
						type: 'error',
						message: '请至少选择一项'
					})
				}else {
					this.$confirm('确定要批量已读吗?', '信息', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						zhanneixins.forEach(item=> {
							let data = {...item, issh: 1}
							zhanneixinEdit(data).then(res => {})
						})
						this.getdata(this.formInline)
						this.$message({
							type: 'success',
							message: '批量已读成功！'
						})
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消批量已读'
						})
					})
				}
			},
		getdata(parameter) {
			// 非管理员需要同时匹配收件人和角色
			if (this.userInfo.roles[0] !== 'admins') {
				parameter.shoujianren = this.username; // 已有的收件人匹配条件
				parameter.jieshoujuese = this.userInfo.roles[0]; // 添加角色匹配条件
			}
			
			zhanneixinList(parameter)
					.then(res => {
						this.loading = false
						if (res.success == false) {
							this.$message({
								type: 'info',
								message: res.msg
							})
						} else {
							this.listData = res.data.list

							let tixing3 = 0;
							this.listData.forEach(item=>{


								if(  item.issh=='0')
								{tixing3=tixing3+1;}
							});


							if(tixing3>0 ){this.$message.warning('您有'+tixing3+'封邮件未读!')}
							
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
			this.formInline.current = parm.currentPage
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
				this.title = '修改在线留言'
				this.editForm = row
			} else {
				this.title = '添加在线留言'
				this.editForm = {}
				
				
				//zixdonxgbianxhao1
			}
		},
		daochu(){
			axios.get('/zhanneixin/getExcel', {
				responseType: 'blob',
				headers: { token: Session.get("token"), 'Content-Type': 'application/x-download' }
			}).then((res) => {
				if (res.status === 200) {
					var a = document.createElement('a')
					var blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
					var href = window.URL.createObjectURL(blob)
					a.href = href
					a.download = '在线留言.xlsx'
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
			
			this.$refs[editData].validate(valid => {
				if (valid) {
					if(this.editForm.id){
						zhanneixinEdit(this.editForm).then(res => {
							this.editFormVisible = false
							
							this.loading = false
							if (res.code == '0') {
								this.getdata(this.formInline)
								this.$message({
									type: 'success',
									message: '在线留言修改成功！'
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
						zhanneixinSave(this.editForm).then(res => {
							this.editFormVisible = false
							this.loading = false
							if (res.code == '0') {
								
								this.getdata(this.formInline)
								this.$message({
									type: 'success',
									message: '在线留言添加成功！'
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
		deleteZhanneixin(index, row) {
			this.$confirm('确定要删除吗?', '信息', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				zhanneixinDelete(row.id).then(res => {
					if (res.code == '0') {
						this.$message({
								type: 'success',
							message: '在线留言已删除!'
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
			this.zhanneixins = val;
		},
		handleDeleteList(){
			const zhanneixins = this.zhanneixins;
			if(zhanneixins.length == 0){
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
					zhanneixinDeleteList(zhanneixins).then(res => {
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
		
		editissh(index,row){
				let data = {...row,issh:!row.issh}
				zhanneixinEdit(data).then(res => {
					this.editFormVisible = false
					this.loading = false
					if (res.code == '0') {
						this.getdata(this.formInline)
						this.$message({
							type: 'success',
							message: '状态修改成功！'
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
			},
		
		
		handleFujianSuccess(res, file) {
				if(res.code == "0") {
					this.editForm.fujian = "/files/download/"+res.data.id
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
			download(data){
			location.href = data.fujian;
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
