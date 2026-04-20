<template>
	<div>
		<el-form :inline="true" :model="formInline" class="user-search">
			<el-form-item label=""><el-input size="small" v-model="formInline.biaoti" placeholder="输入标题"></el-input></el-form-item>
			<el-form-item label=""><el-input size="small" v-model="formInline.leibie" placeholder="输入类别"></el-input></el-form-item>
			
			<el-form-item>
				<el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
				<el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit()" >添加</el-button>
				
				<el-button size="small" type="danger" icon="el-icon-delete" @click="handleDeleteList()" v-if="userInfo.roles[0] == 'admins'">批量删除</el-button>
			</el-form-item>
		</el-form>
		<el-table size="small" :data="listData" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" @selection-change="handleSelectionChange">
			<el-table-column align="center" type="selection" width="60"></el-table-column>
			<el-table-column sortable prop="biaoti" label="标题"></el-table-column>
			<el-table-column sortable prop="leibie" label="类别"></el-table-column>
			<el-table-column sortable prop="beizhu" label="状态"></el-table-column>

			<el-table-column sortable prop="addtime" label="添加时间" width="160">
				<template slot-scope="scope">
					<div>{{scope.row.addtime|datePipe('yyyy-MM-dd hh:mm:ss')}}</div>
				</template>
			</el-table-column>
			
			<el-table-column align="center" label="操作" min-width="160">
				<template slot-scope="scope">
					
					<!--liangbuan-->
					<el-button size="mini" type="success" @click="handleEdit(scope.$index, scope.row)" v-if="userInfo.roles[0] == 'users' ">编辑</el-button>
					<el-button size="mini" type="danger" @click="deleteXinwentongzhi(scope.$index, scope.row)" v-if="userInfo.roles[0] == 'users' ">删除</el-button>
					<el-button size='mini' type='primary' @click="handleDetail(scope.$index, scope.row)">详细</el-button>
					<el-button size="mini" type="info" @click="handleContent(scope.$index, scope.row)" v-if="userInfo.roles[0] == 'users'">内容设置</el-button>
          <el-dropdown trigger="click" v-if="userInfo.roles[0] == 'admins'" style="margin-left: 10px;">
            <el-button size="mini" type="warning">
              状态处理<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button size="mini" type="warning" @click="handleStatusUpdate(scope.row, '处理中')">处理中</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button size="mini" type="success" @click="handleStatusUpdate(scope.row, '已修复')">已修复</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
			</el-table-column>
		</el-table>
		<Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
		
		<el-dialog :title="title" :visible.sync="editFormVisible" width="30%" @click="closeDialog">
			<el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm">
				<el-form-item  label="标题" prop="biaoti"><el-input size="small" v-model="editForm.biaoti" auto-complete="off" placeholder="请输入标题" style='width:100%'></el-input></el-form-item>
		<el-form-item  label="类别" prop="leibie"><el-input size="small" v-model="editForm.leibie" auto-complete="off" placeholder="请输入类别" style='width:50%'></el-input></el-form-item>
		<el-form-item  label="状态" prop="beizhu"><el-input size="small" v-model="editForm.beizhu" auto-complete="off" placeholder="请输入状态" style='width:50%'></el-input></el-form-item>


				
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button size="small" @click="closeDialog">取消</el-button>
				<el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm('editForm')">保存</el-button>
			</div>
		</el-dialog>
    <el-card v-if="isDetailVisible" class="detail-card">
      <div slot="header" class="clearfix">
        <span>异常上报详情</span>
      </div>
      <div><strong>标题:</strong> {{ detailData.biaoti }}</div>
      <div><strong>类别:</strong> {{ detailData.leibie }}</div>
      <div><strong>添加时间:</strong> {{ detailData.addtime | datePipe('yyyy-MM-dd hh:mm:ss') }}</div>
      <div><strong>内容:</strong> <div v-html="detailData.neirong"></div></div>
    </el-card>
			
			<!--xiangxidhk-->
	</div>
</template>

<script>
import Pagination from "@/layout/pagination/Pagination";
import { xinwentongzhiList, xinwentongzhiSave, xinwentongzhiDelete,xinwentongzhiEdit,xinwentongzhiDeleteList } from '@/api/xinwentongzhi/xinwentongzhiApi';


import {Session} from "@/utils/storage";
export default {
	name: 'user',
	data() {
		return {
			loading: false, //是显示加载
			title: '',
			
			editFormVisible: false, //控制编辑页面显示与隐藏
			//detaitFormVsisisble
			 isDetailVisible: false, // 控制详情区域是否可见
                    detailData: null,       // 存储当前选中的详情数据
			
			editForm: {
			},
			user:[],
			
			rules: {
				biaoti: [{ required: true, message: '请输入标题', trigger: 'blur' },
				],
				leibie: [{ required: true, message: '请输入类别', trigger: 'blur' },
				],
				dianjilv: [{ type: 'number', message: '点击率必须为数字'},
				],
				
			},
			
			formInline: {
				page: 1,
				limit: 10,
			},
			
			
			listData: [],
			xinwentongzhis:[],
			
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
		
		this.getdata(this.formInline)
		
	},
	methods: {
    handleStatusUpdate(row, status) {
      this.$confirm(`确定要将状态更改为"${status}"吗?`, '状态更新', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // Create a copy of the row data and update the status
        const updatedData = {...row, beizhu: status};

        // Call API to update the record
        xinwentongzhiEdit(updatedData).then(res => {
          if (res.code == '0') {
            this.$message({
              type: 'success',
              message: '状态更新成功!'
            });
            this.getdata(this.formInline); // Refresh the data
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            });
          }
        }).catch(err => {
          this.$message.error('状态更新失败，请稍后再试!');
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    },
    closeDetail() {
      this.isDetailVisible = false; // 关闭详情区域
    },
		getdata(parameter) {
			xinwentongzhiList(parameter)
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
				this.title = '修改异常上报'
				this.editForm = row
			} else {
				this.title = '添加异常上报'
				this.editForm = {}
				
				
			}
		},
		handleContent: function (index, row) {this.$router.push('/xinwentongzhi/tinymceEditor/'+row.id)},
handleDetail(index, row) {
    this.isDetailVisible = true; // 显示详情区域
    this.detailData = row;       // 设置当前行数据为详情数据
},		//liangbuedit
		// 编辑、增加页面保存方法
		submitForm(editData) {
			this.$refs[editData].validate(valid => {
				if (valid) {
					if(this.editForm.id){
						xinwentongzhiEdit(this.editForm).then(res => {
							this.editFormVisible = false
							
							this.loading = false
							if (res.code == '0') {
								this.getdata(this.formInline)
								this.$message({
									type: 'success',
									message: '异常上报修改成功！'
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
						xinwentongzhiSave(this.editForm).then(res => {
							this.editFormVisible = false
							this.loading = false
							if (res.code == '0') {
								
								this.getdata(this.formInline)
								this.$message({
									type: 'success',
									message: '异常上报添加成功！'
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
		deleteXinwentongzhi(index, row) {
			this.$confirm('确定要删除吗?', '信息', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				xinwentongzhiDelete(row.id).then(res => {
					if (res.code == '0') {
						this.$message({
								type: 'success',
							message: '异常上报已删除!'
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
			this.xinwentongzhis = val;
		},
		// handleDetail(index, row) {const w = window.open("about:blank");w.location.href = 'http://localhost:8080/#/xinwentongzhidetail/'+row.id;},
		handleDeleteList(){
			const xinwentongzhis = this.xinwentongzhis;
			if(xinwentongzhis.length == 0){
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
					xinwentongzhiDeleteList(xinwentongzhis).then(res => {
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
