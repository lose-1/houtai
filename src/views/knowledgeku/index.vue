<template>
  <div>
    <div class="card">
      <div class="card-header"><h4>报销流程列表</h4></div>
      <div class="card-body">
        <el-form :inline="true" :model="formInline" class="form-inline">
          <el-form-item label="">
            <el-input size="small" v-model="formInline.title" placeholder="输入标题"></el-input>
          </el-form-item>
          <el-form-item prop="types">
            <el-select isxiaduo size="small" v-model="formInline.types" placeholder="请选择">
              <el-option selected label="请选择" value=""></el-option>
              <el-option v-for="item in lawtypess" :key="item.types" :label="item.types"
                         :value="item.types"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button size="small" class="btn btn-default" @click="search"><span class='el-icon-loading'></span>查找
            </el-button>
          </el-form-item>
        </el-form>
        <div class="panel admin-panel">

          <div class="padding border-bottom">
            <button class="btn btn-danger m-r-5" type="button" style="float:right" onClick="window.print();"><span
                class="el-icon-s-goods"></span> 打印
            </button>
            <button class="btn btn-success m-r-5" style="float:right" @click="handleDeleteList()"
                    v-if="userInfo.roles[0] == 'admins'"><span class="el-icon-delete"></span> 批量删除
            </button>
            <button class="btn btn-warning m-r-5" style="float:right" @click="daochu()"><span
                class="el-icon-setting"></span> 导出excel
            </button>
            <button class="btn btn-info m-r-5" style="float:right" @click="handleEdit()" v-if="userInfo.roles[0] == 'admins'"><span
                class="el-icon-star-on"></span>添加新数据
            </button>
          </div>
          <el-table class="table table-bordered table-hover" :data="listData" highlight-current-row v-loading="loading"
                    border element-loading-text="拼命加载中" @selection-change="handleSelectionChange">
            <el-table-column align="center" type="selection" width="60"></el-table-column>
            <el-table-column sortable prop="title" label="标题"></el-table-column>
            <el-table-column sortable prop="types" label="分类"></el-table-column>
            <el-table-column align='center' prop='pic' label='图片' width='100'>
              <template slot-scope='scope'>
                <el-image :src='scope.row.pic' style='height:70px' v-if="scope.row.pic"/>
                <img src="../../../static/images/guanli.jpg" style='height:70px' v-else/></template>
            </el-table-column>
            <el-table-column align='center' sortable prop='xiangguanvideos' label='相关视频' width='110'>
              <template slot-scope='scope'>
                <el-button size="mini" v-if="scope.row.xiangguanvideos" @click="download(scope.row.xiangguanvideos)">
                  下载
                </el-button>
              </template>
            </el-table-column>
            <el-table-column sortable prop="lawtiaowen" label="注意事项"></el-table-column>

            <el-table-column align="center" label="操作" min-width="160" width="400;">
              <template slot-scope="scope">

                <!--liangbuan-->

                <!--zhixfuanniu-->
                <el-button class='btn btn-info' style="margin-right: 10px"
                           @click="handleContent(scope.$index, scope.row)" v-if="userInfo.roles[0] == 'admins'">内容设置
                </el-button>
                <button class="btn btn-primary" @click="handleEdit(scope.$index, scope.row)"
                        v-if="userInfo.roles[0] == 'admins'  " style="cursor:pointer"><i
                    class="mdi mdi-delete-empty"></i>改
                </button>&nbsp;
                <button class="btn btn-warning" @click="deleteKnowledgeku(scope.$index, scope.row)"
                        v-if="userInfo.roles[0] == 'admins'  " style="cursor:pointer"><i class="mdi mdi-close"></i>删
                </button>&nbsp;
                <button class='btn btn-info' @click="handleDetail(scope.$index, scope.row)"><i
                    class='mdi mdi-arrow-expand-all'></i>详
                </button>

              </template>
            </el-table-column>
          </el-table>
        </div>
        <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>

        <el-dialog :title="title" :visible.sync="editFormVisible" width="30%" @click="closeDialog">
          <el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm">
            <el-form-item label="标题" prop="title">
              <el-input size="small" v-model="editForm.title" auto-complete="off" placeholder="请输入标题"
                        style='width:100%'></el-input>
            </el-form-item>
            <el-form-item label='分类' prop="types">
              <el-select size="small" v-model="editForm.types" placeholder="请选择">
                <el-option selected label="请选择" value=""></el-option>
                <el-option v-for="item in lawtypess" :key="item.types" :label="item.types"
                           :value="item.types"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label='图片' prop='pic'>
              <el-upload class='avatar-uploader' action='http://localhost:9999/files/upload' :headers='headers'
                         :show-file-list='false' :on-success='handlePicSuccess' :before-upload='beforePicUpload'><img
                  v-if='editForm.pic' :src='editForm.pic' class='avatar'><i v-else
                                                                            class='el-icon-plus avatar-uploader-icon'></i>
              </el-upload>
            </el-form-item>
            <el-form-item label='相关视频' prop='xiangguanvideos'>
              <el-upload class='avatar-uploader' action='http://localhost:9999/files/uploadwenjian' :headers='headers'
                         :show-file-list='false' :on-success='handleXiangguanvideosSuccess'>
                <el-button>上传</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item label="内容" prop="contents">
              <el-input type="textarea" size="small" v-model="editForm.contents" auto-complete="off" placeholder="请输入内容"
                        style='width:100%'></el-input>
            </el-form-item>
            <el-form-item label="注意事项" prop="lawtiaowen">
              <el-input size="small" v-model="editForm.lawtiaowen" auto-complete="off" placeholder="请输入注意事项"
                        style='width:100%'></el-input>
            </el-form-item>


          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button size="small" @click="closeDialog">取消</el-button>
            <el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm('editForm')">保存
            </el-button>
          </div>
        </el-dialog>


        <el-dialog :title="title" :visible.sync="detailFormVisible" width="85%" @click="closeDialogdetail">
          <div class="detail-container">
            <!-- 基本信息区域 - 网格布局 -->
            <el-row :gutter="15" class="detail-grid">
              <el-col :span="12">
                <div class="detail-cell">
                  <div class="cell-label">标题</div>
                  <div class="cell-value">{{ editForm.title || '暂无' }}</div>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="detail-cell">
                  <div class="cell-label">分类</div>
                  <div class="cell-value">{{ editForm.types || '暂无' }}</div>
                </div>
              </el-col>
            </el-row>
            
            <el-row :gutter="15" class="detail-grid">
              <el-col :span="24">
                <div class="detail-cell">
                  <div class="cell-label">注意事项</div>
                  <div class="cell-value">{{ editForm.lawtiaowen || '暂无' }}</div>
                </div>
              </el-col>
            </el-row>

            <!-- 视频和图片 - 左右网格 -->
            <el-row :gutter="15" class="detail-grid">
              <el-col :span="12">
                <div class="detail-cell media-cell">
                  <div class="cell-label">相关视频</div>
                  <div class="cell-media">
                    <video v-if="editForm.xiangguanvideos" 
                           :src="'http://localhost:9999' + editForm.xiangguanvideos" 
                           controls 
                           class="media-video">
                      Your browser does not support the video tag.
                    </video>
                    <div v-else class="no-data">暂无视频</div>
                  </div>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="detail-cell media-cell">
                  <div class="cell-label">图片</div>
                  <div class="cell-media">
                    <img v-if="editForm.pic" 
                         :src="editForm.pic" 
                         class="media-image"/>
                    <div v-else class="no-data">暂无图片</div>
                  </div>
                </div>
              </el-col>
            </el-row>

            <!-- 内容区域 - 独立网格 -->
            <el-row :gutter="15" class="detail-grid">
              <el-col :span="24">
                <div class="detail-cell content-cell">
                  <div class="cell-label">内容</div>
                  <div class="cell-content">{{ editForm.contents || '暂无内容' }}</div>
                </div>
              </el-col>
            </el-row>

            <!-- 模板展示 - 独立网格，居中显示 -->
            <el-row :gutter="15" class="detail-grid">
              <el-col :span="24">
                <div class="detail-cell template-cell">
                  <div class="cell-label">模板展示</div>
                  <div class="cell-template" v-html="editForm.jingdiancases || '暂无模板'"></div>
                </div>
              </el-col>
            </el-row>
          </div>

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
import {
  knowledgekuList,
  knowledgekuSave,
  knowledgekuDelete,
  knowledgekuEdit,
  knowledgekuDeleteList
} from '@/api/knowledgeku/knowledgekuApi';
import {lawtypesAllList, lawtypesList} from "@/api/lawtypes/lawtypesApi";


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


      editForm: {},
      user: [],
      username: '',
      cx: '',
      lawtypess: [],

      rules: {
        title: [{required: true, message: '请输入标题', trigger: 'blur'},
        ],
        types: [{required: true, message: '请输入分类', trigger: 'blur'},
        ],

      },

      formInline: {
        page: 1,
        limit: 10,
      },


      listData: [],
      knowledgekus: [],

      checkmenu: [],
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    };
  },
  computed: {
    headers() {
      return {"token": Session.get("token")}
    }
  },
  watch: {
    '$route'(to, from) {
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
    this.username = localStorage.getItem("username");
    this.cx = localStorage.getItem("cx");

    this.getdata(this.formInline)
    this.getAlllawtypes({currentNum: 100});

  },
  methods: {


    //yyriqibjdx
    //zxhifuff
    handleShenheList() {
      const knowledgekus = this.knowledgekus;
      if (knowledgekus.length == 0) {
        this.$message({
          type: 'error',
          message: '请至少选择一项'
        })
      } else {
        this.$confirm('确定要批量审核吗?', '信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          knowledgekus.forEach(item => {
            let data = {...item, issh: 1}
            knowledgekuEdit(data).then(res => {
            })
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
      knowledgekuList(parameter)
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
        this.title = '修改报销流程'
        this.editForm = row
        //yxixaoduo
      } else {
        this.title = '添加报销流程'
        this.editForm = {}


        //zixdonxgbianxhao1
      }
    },
    daochu() {
      axios.get('/knowledgeku/getExcel', {
        responseType: 'blob',
        headers: {token: Session.get("token"), 'Content-Type': 'application/x-download'}
      }).then((res) => {
        if (res.status === 200) {
          var a = document.createElement('a')
          var blob = new Blob([res.data], {type: 'application/vnd.ms-excel'})
          var href = window.URL.createObjectURL(blob)
          a.href = href
          a.download = '报销流程.xlsx'
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
      if (res.code == "0") {
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
    handleContent: function (index, row) {
      this.$router.push('/knowledgeku/tinymceEditor/' + row.id)
    },
    handleDetail: function (index, row) {
      this.detailFormVisible = true
      if (row != undefined && row != 'undefined') {
        this.title = '报销流程详细'
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
          if (this.editForm.id) {
            knowledgekuEdit(this.editForm).then(res => {
              this.editFormVisible = false

              this.loading = false
              if (res.code == '0') {
                this.getdata(this.formInline)
                this.$message({
                  type: 'success',
                  message: '报销流程修改成功！'
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
              if (err) {
                this.$message.error(err)
              } else {
                this.$message.error('操作失败，请稍后再试！')
              }
            })
          } else {
            knowledgekuSave(this.editForm).then(res => {
              this.editFormVisible = false
              this.loading = false
              if (res.code == '0') {

                this.getdata(this.formInline)
                this.$message({
                  type: 'success',
                  message: '报销流程添加成功！'
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
              if (err) {
                this.$message.error(err)
              } else {
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
    deleteKnowledgeku(index, row) {
      this.$confirm('确定要删除吗?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        knowledgekuDelete(row.id).then(res => {
          if (res.code == '0') {
            this.$message({
              type: 'success',
              message: '报销流程已删除!'
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
    handleSelectionChange(val) {
      this.knowledgekus = val;
    },
    handleDeleteList() {
      const knowledgekus = this.knowledgekus;
      if (knowledgekus.length == 0) {
        this.$message({
          type: 'error',
          message: '请至少选择一项进行删除'
        })
      } else {
        this.$confirm('确定要批量删除吗?', '信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          knowledgekuDeleteList(knowledgekus).then(res => {
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


    getAlllawtypes(parameter) {
      lawtypesList(parameter).then(res => {
        if (res.code == '0') {
          this.lawtypess = res.data.list
        }
      })
    },

    handlePicSuccess(res, file) {
      if (res.code == "0") {
        this.editForm.pic = "/files/download/" + res.data.id
        this.$forceUpdate()
      }
    },
    beforePicUpload(file) {
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

    handleXiangguanvideosSuccess(res, file) {
      if (res.code == "0") {
        this.editForm.xiangguanvideos = "/files/download/" + res.data.id
        this.$message({
          type: 'success',
          message: '文件上传成功！'
        })
      } else {
        this.$message({
          type: 'info',
          message: res.msg
        })
      }
    },
    download(xx) {
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
@import "../../ny/css/bootstrap.min.css";
@import "../../ny/css/materialdesignicons.min.css";
@import "../../ny/css/style.min.css";
@import "../../ny/css/jquery-confirm.min.css";

::v-deep .el-input--small .el-input__inner {
  border-block-color: #454545;
}

::v-deep .el-table th {
  background-color: #ddd;
  solid-color: #00feff;
}

::v-deep .el-table thead {
  color: #3399ff;
  font-weight: 500;
}

::v-deep .el-table tr {
  /*background-color: yellow;*/
}

::v-deep .el-table__body tr.current-row > td {
  /*background:#bd93f9;*/
}

::v-deep .el-table th {
  background-color: #E2FDFE;
  color: #188716;
  font-weight: bold;
}

// 详情页样式 - 网格布局
.detail-container {
  padding: 20px;
  background-color: #f5f7fa;
  
  .detail-grid {
    margin-bottom: 15px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  .detail-cell {
    background-color: #fff;
    border: 1px solid #dcdfe6;
    border-radius: 6px;
    padding: 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    transition: all 0.3s;
    
    &:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    
    .cell-label {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
      font-weight: bold;
      font-size: 14px;
      padding: 12px 15px;
      border-radius: 6px 6px 0 0;
      text-align: center;
      letter-spacing: 1px;
    }
    
    .cell-value {
      padding: 15px;
      color: #303133;
      font-size: 14px;
      line-height: 1.6;
      word-break: break-word;
      min-height: 40px;
    }
    
    .cell-content {
      padding: 15px;
      color: #303133;
      font-size: 14px;
      line-height: 1.8;
      word-break: break-word;
      white-space: pre-wrap;
      min-height: 60px;
    }
    
    &.media-cell {
      .cell-media {
        padding: 15px;
        text-align: center;
        min-height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
        
        .media-video {
          width: 100%;
          max-width: 100%;
          height: auto;
          border-radius: 4px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
        
        .media-image {
          max-width: 100%;
          height: auto;
          max-height: 300px;
          border-radius: 4px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
        
        .no-data {
          color: #909399;
          font-style: italic;
          font-size: 14px;
        }
      }
    }
    
    &.content-cell {
      .cell-content {
        background-color: #fafafa;
        border-radius: 0 0 6px 6px;
      }
    }
    
    &.template-cell {
      .cell-label {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      }
      
      .cell-template {
        padding: 25px;
        background-color: #fff;
        border-radius: 0 0 6px 6px;
        text-align: center;
        overflow-x: auto;
        min-height: 150px;
        
        ::v-deep img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 15px auto;
          border-radius: 4px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        ::v-deep table {
          margin: 15px auto;
          max-width: 100%;
          border-collapse: collapse;
        }
        
        ::v-deep * {
          max-width: 100%;
          box-sizing: border-box;
        }
        
        ::v-deep p {
          text-align: left;
          margin: 10px 0;
          line-height: 1.8;
        }
        
        ::v-deep div {
          text-align: center;
        }
      }
    }
  }
}
</style>