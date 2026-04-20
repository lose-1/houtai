<template>
	<div class="personal">
		<el-form label-width="80px" ref="editForm" :model="editForm" :rules="rules">
			<el-form-item  label="用户名" prop="usernames"><el-input size="small" v-model="editForm.usernames" auto-complete="off" placeholder="请输入用户名" style='width:25%'></el-input></el-form-item>		<el-form-item  label="姓名" prop="names"><el-input size="small" v-model="editForm.names" auto-complete="off" placeholder="请输入姓名" style='width:25%'></el-input></el-form-item>		<el-form-item  label="性别" prop="gender" ><el-radio v-model="editForm.gender" :label=true>男</el-radio><el-radio v-model="editForm.gender" :label=false>女</el-radio></el-form-item>				<el-form-item  label="手机" prop="phone"><el-input size="small" v-model="editForm.phone" auto-complete="off" placeholder="请输入手机" style='width:25%'></el-input></el-form-item>		<el-form-item  label="身份证" prop="idcard"><el-input size="small" v-model="editForm.idcard" auto-complete="off" placeholder="请输入身份证" style='width:25%'></el-input></el-form-item>		<el-form-item  label='头像' prop='touxiang'><el-upload class='avatar-uploader' action='http://localhost:9999/files/upload' :headers='headers' :show-file-list='false' :on-success='handleTouxiangSuccess' :before-upload='beforeTouxiangUpload'><img v-if='editForm.touxiang' :src='editForm.touxiang' class='avatar'><i v-else class='el-icon-plus avatar-uploader-icon'></i></el-upload></el-form-item>		<el-form-item  label="备注" prop="memo"><el-input size="small" v-model="editForm.memo" auto-complete="off" placeholder="请输入备注" style='width:25%'></el-input></el-form-item>		
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm('editForm')">更新</el-button>
		</div>
	</div>
</template>

<script>
	import {usersinfosEdit, usersinfosSave,usersinfosDetail} from "@/api/usersinfos/usersinfosApi";
	import {Session} from "@/utils/storage";

export default {
	name: 'personal',
	data() {
		return {
			rules: {
				usernames: [{ required: true, message: '请输入用户名', trigger: 'blur' },				],				names: [{ required: true, message: '请输入姓名', trigger: 'blur' },				],				idcard: [{ pattern:/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,required: true,message: '请输入正确身份证号',trigger: 'blur'}				],				
			},
			editForm: {
				avater:''
			},
		};
	},
	created() {
		this.getDetail()
	},
	computed: {
		headers(){
			return {"token":Session.get("token")}
		},
	},
	methods:{
		getDetail(){
			if (!Session.get('userInfo')) return false;
			this.userInfo = Session.get('userInfo');
			console.log(this.userInfo);
			usersinfosDetail(this.userInfo.id).then(res=>{
				if (res.code == '0') {
					this.editForm = res.data;
				}
			}).catch(err => {
				if(err){
					this.$message.error(err)
				}else {
					this.$message.error('操作失败，请稍后再试！')
				}
			})
		},
		
		// 编辑、增加页面保存方法
		submitForm(editData) {
			this.$refs[editData].validate(valid => {
				if (valid) {
					if(this.editForm.id){
						usersinfosEdit(this.editForm).then(res => {
							if (res.code == '0') {
								this.getDetail()
								this.$message({
									type: 'success',
									message: '个人信息修改成功！'
								})
								this.$store.dispatch('userInfos/setUserInfos',this.editForm);
							} else {
								this.$message({
									type: 'info',
									message: res.msg
								})
							}
						}).catch(err => {
							if(err){
								this.$message.error(err)
							}else {
								this.$message.error('操作失败，请稍后再试！')
							}
						})
					}else {
						usersinfosSave(this.editForm).then(res => {
							if (res.code == '0') {
								this.getDetail()
								this.$message({
									type: 'success',
									message: '个人信息添加成功！'
								})
							} else {
								this.$message({
									type: 'info',
									message: res.msg
								})
							}
						}).catch(err => {
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
	}
};
</script>

<style scoped lang="scss">
	@import './index.scss';
</style>
