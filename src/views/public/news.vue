<template>
  <div class="app-container">
    <div class="filter-container" style="padding-bottom: 20px;">
      <el-input style="width: 200px;" class="filter-item" v-model="listQuery.title">
      </el-input>
      <el-select clearable class="filter-item" style="width: 160px"
                 allow-create
                 placeholder="请选择图文类型">
        <el-option
          v-for="item in multTypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                 @click="singleCreate">添加单图文
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                 @click="multiCreate">添加多图文
      </el-button>
      <!--<el-button class="filter-item" type="primary" v-waves icon="el-icon-download">导出</el-button>-->
      <!--<el-checkbox class="filter-item" style='margin-left:15px;'>审核人</el-checkbox>-->
    </div>

    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label='序号' width="95">
        <template slot-scope="scope">
          {{scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column label="图文标题">
        <template slot-scope="scope">
          {{scope.row.title}}
        </template>
      </el-table-column>
      <el-table-column label="作者">
        <template slot-scope="scope">
          {{scope.row.author}}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="图文类型" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.multType | statusFilter">{{multType(scope.row.multType)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="url">
        <template slot-scope="scope">
          <el-tag :type="scope.row.url | statusFilter">{{scope.row.url}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="原文链接">
        <template slot-scope="scope">
          <el-tag :type="scope.row.fromurl | statusFilter">{{scope.row.fromurl}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="封面展示到正文">
        <template slot-scope="scope">
          {{showPic(scope.row.showpic)}}
        </template>
      </el-table-column>

      <el-table-column align="center" prop="created_at" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)"><i class="el-icon-edit"></i> 编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)"><i class="el-icon-delete"></i> 删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>


    <!--单图文消息-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="singleFormDialog" fullscreen="true" width="80%">
      <span slot="title">添加单图文</span>
      <el-form :model="temp" label-position="left" label-width="70px" style='margin-left:50px;'>
        <el-row :gutter="20" style="padding-top: 40px;">
          <el-col :span="8">
            <div class="img_default"><img :src="img_default" alt=""></div>
            <div style="position: relative;">
              <img v-bind:class="img_pic" v-if="imageUrl" :src="imageUrl" class="avatar"
                   style="width: 320px;height: 180px;background-image: url(img_pic);margin-left: -20px;">
              <input class="img_title" v-model="temp.title">
            </div>
          </el-col>
          <el-col :span="16">
            <el-form-item label="封面">
              <el-upload
                class="avatar-uploader"
                :show-file-list="false"
                :headers="headers"
                :on-success="singleAvatarSuccess"
                :before-upload="picUpload">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <el-checkbox v-model="showpic">封面图片显示在正文中</el-checkbox>
            </el-form-item>
            <el-form-item label="标题">
              <el-input v-model="temp.title"></el-input>
            </el-form-item>
            <el-form-item label="作者">
              <el-input v-model="temp.author"></el-input>
            </el-form-item>
            <el-form-item label="摘要">
              <el-input v-model="temp.brief"></el-input>
            </el-form-item>
            <el-form-item label="原文链接">
              <el-input v-model="temp.fromurl"></el-input>
            </el-form-item>
            <el-form-item label="留言">
              <el-switch
                v-model="temp.open_comment"
                inactive-text="否"
                active-text="是">
              </el-switch>
              &nbsp;
              <el-radio label="1" v-model="temp.fans_can_comment" v-show="temp.open_comment">所有人可留言</el-radio>
              <el-radio label="0" v-model="temp.fans_can_comment" v-show="temp.open_comment">仅粉丝可留言</el-radio>
            </el-form-item>
            <!--内容编辑器-->
            <el-form-item label="内容">
              <tinymce :height="300" v-model="temp.description"></tinymce>
            </el-form-item>
            <el-form-item label="效果预览">
              <div class="editor-content" v-html="temp.description"
                   style="padding-bottom: 60px;border: 1px solid lightgray;"></div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="singleFormDialog = false">取消</el-button>
        <el-button type="primary" @click="submitSingle">确定</el-button>
      </div>
    </el-dialog>


    <!--多图文消息-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="multiFormDialog" fullscreen width="80%">
      <div class="special_item">
        <!--<span slot="title">添加多图文</span>-->
        <el-button
          size="small"
          @click="addTab(multiForm)" type="primary" style="margin-bottom: 10px;">
          添加图文消息
        </el-button>

        <el-tabs v-model="multiForm" type="card" closable @tab-remove="removeTab" tabPosition="left">
          <el-tab-pane
            v-for="(multiForm, index) in multiFormTab"
            :key="multiForm.name"
            :label="multiForm.title"
            :name="multiForm.name">
            <el-form label-position="left" label-width="70px" style='margin-left:50px;'>
              <el-form-item label="标题">
                <el-input v-model="multiForm.title"></el-input>
              </el-form-item>
              <el-form-item label="封面">
                <el-upload v-model="multiForm.imageUrl"
                           class="avatar-uploader"
                           :show-file-list="false">
                  <img v-if="imageUrl" :src="imageUrl" class="">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  <div slot="tip" class="el-upload__tip">建议比例：（900 * 500） | 只能上传jpg/png文件，且不超过500k</div>
                </el-upload>
                <el-checkbox v-model="showpic">封面图片显示在正文中</el-checkbox>
              </el-form-item>
              <el-form-item label="作者">
                <el-input v-model="multiForm.author"></el-input>
              </el-form-item>
              <el-form-item label="摘要">
                <el-input v-model="multiForm.brief"></el-input>
              </el-form-item>
              <el-form-item label="原文链接">
                <el-input v-model="multiForm.fromurl"></el-input>
              </el-form-item>

              <el-form-item label="留言">
                <el-switch
                  v-model="multiForm.open_comment"
                  inactive-text="否"
                  active-text="是">
                </el-switch>

                <el-radio label="1" v-model="multiForm.fans_can_comment" v-show="multiForm.open_comment">所有人可留言
                </el-radio>
                <el-radio label="0" v-model="multiForm.fans_can_comment" v-show="multiForm.open_comment">仅粉丝可留言
                </el-radio>
              </el-form-item>

              <!--内容编辑器-->
              <el-form-item label="内容">
                <tinymce :height="300" v-model="multiForm.description"></tinymce>
              </el-form-item>
              <el-form-item label="效果预览">
                <div class="editor-content" v-html="multiForm.description"
                     style="padding-bottom: 60px;border: 1px solid lightgray;"></div>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
        <div slot="footer" class="dialog-footer" pull="4">
          <el-button @click="multiForm = false">取消</el-button>
          <el-button type="primary" @click="submitMulti">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>


<script>
  import { addMulti, addSingle, getNewsList } from '@/api/news'
  import Tinymce from '@/components/Tinymce'
  import img_pic from '@/assets/news/pic.png'
  import img_add from '@/assets/news/add.png'
  import img_default from '@/assets/news/default.png'
  import axios from 'axios'

  export default {
    components: { Tinymce },
    data() {
      return {
        typeOption: '',
        multTypeOptions: [{
          value: '1',
          label: '单图文'
        }, {
          value: '2',
          label: '多图文'
        }],
        title: '',
        fullscreen: true,
        imageUrl: '',
        content: '',
        list: null,
        listLoading: true,
        singleFormDialog: false,
        multiFormDialog: false,
        dialogStatus: '',
        textMap: {
          update: 'Edit',
          create: '添加多图文'
        },
        tabPosition: ' left',
        img_pic,
        img_add,
        img_default,
        listQuery: {
          page: 1,
          limit: 30,
          importance: undefined,
          title: undefined,
          type: undefined,
          sort: '+id'
        },
        temp: {
          title: '',
          author: '',
          picpath: '',
          open_comment: 1,
          fans_can_comment: 1,
          brief: '',
          fromurl: '',
          multType: '',
          description: '',
          showpic: true
        },
        // tab栏切换
        multiForm: '1',
        multiFormTab: [{
          title: '主图文',
          name: '1',
          content: ''
        }],
        tabIndex: 2
      }
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'gray',
          deleted: 'danger'
        }
        return statusMap[status]
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      // 获取列表
      getList() {
        this.listLoading = true
        getNewsList(this.listQuery).then(response => {
          this.list = response.data.list
          this.total = response.data.totalCount
          this.listLoading = false
        })
      },
      fetchData() {
        this.listLoading = true
        getNewsList(this.listQuery).then(response => {
          this.list = response.data.list
          this.total = response.data.totalCount
          this.listLoading = false
        })
      },
      multType(e) {
        if (e === 1) {
          return '单图文'
        } else if (e === 2) {
          return '多图文'
        }
      },
      showPic(e) {
        if (e === 1) {
          return '是'
        } else if (e === 0) {
          return '否'
        }
      },
      // 添加的时候清空表单数据
      resetTemp() {
        this.temp = {
          title: '',
          author: '',
          picpath: '',
          open_comment: 1,
          fans_can_comment: 1,
          brief: '',
          fromurl: '',
          multType: '',
          description: '',
          showpic: true
        }
      },
      // 点击添加弹出对话框
      singleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.singleFormDialog = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      // 添加多图文
      multiCreate() {
        // 首先重置temp存储的数据
        this.resetTemp()
        this.dialogStatus = 'create'
        this.multiFormDialog = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      // 编辑列表图文素材（回显temp存储的数据）
      handleUpdate(row) {
        this.temp = Object.assign({}, row)
        this.temp.timestamp = new Date(this.temp.timestamp)
        this.singleFormDialog = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      // 分页功能
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      // 删除列表
      handleDelete(row) {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
      },
      // 单图片上传
      singleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw)
      },
      picUpload(image) {
        console.log(image)
        console.log(this.headers)
        const isJPG = image.type === 'image/jpeg'
        const isLt2M = image.size / 1024 / 1024 < 2

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        const param = new FormData()
        // var date = new Date()
        // var s = date.getTime()
        // var y = date.getFullYear()
        // var m = date.getMonth() + 1
        // var d = date.getDate()
        param.append('name', image.name)
        // key就代表文件层级和阿里云上的文件名
        param.append('key', 'temp/1527218857903/' + image.name)
        param.append('policy', 'eyJleHBpcmF0aW9uIjoiMjAxOC0wNS0yNVQwMzozNzozNy45MDNaIiwiY29uZGl0aW9ucyI6W1siY29udGVudC1sZW5ndGgtcmFuZ2UiLDAsMTA0ODU3NjAwMF0sWyJzdGFydHMtd2l0aCIsIiRrZXkiLCJ0ZW1wLzE1MjcyMTg4NTc5MDMvIl1dfQ==')
        param.append('OSSAccessKeyId', 'LTAI1oC0hI4rXpjO')
        // 阿里云正常返回204，然后返回信息是空的，想看到返回信息强制让它返回201，返回一个xml文件可以提取有用的信息
        param.append('success_action_status', 201)
        param.append('signature', 'vaTrWjV1GnIkOc4GB+qPTWnZ3sY=')
        param.append('file', image, image.name)
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
        console.log(config)
        axios.post('http://qxl-online.oss-cn-shenzhen.aliyuncs.com', param, config)
          .then(response => {
            console.log(response.data)
          })
        return false
      },
      // 添加多图文的tab
      addTab(targetName) {
        const newTabName = ++this.tabIndex + ''
        this.multiFormTab.push({
          title: '图文标题',
          name: newTabName,
          author: '',
          fromurl: '',
          message: '',
          showpic: true,
          open_comment: '',
          fans_can_comment: '',
          imageUrl: '',
          multType: 2,
          description: ''
        })
        this.multiForm = newTabName
      },
      removeTab(targetName) {
        const tabs = this.multiFormTab
        let activeName = this.multiForm
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              const nextTab = tabs[index + 1] || tabs[index - 1]
              if (nextTab) {
                activeName = nextTab.name
              }
            }
          })
        }

        this.multiForm = activeName
        this.multiFormTab = tabs.filter(tab => tab.name !== targetName)
      },
      // 提交单图文数据
      submitSingle() {
        this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
        this.temp.multType = 1
        this.temp.thumbMediaId = 'dKtXfQrx7ExTqZMMY2ka6qsYv-NI6ChRoxV-VQ14tHI'
        console.log(this.temp)
        addSingle(this.temp).then(() => {
          this.list.unshift(this.temp)
          this.singleFormDialog = false
          this.$notify({
            title: '成功',
            message: '添加成功',
            type: 'success',
            duration: 2000
          })
        })
      },
      // 提交多图文数组
      submitMulti() {
        this.news = []
        for (let i = 0; i < this.multiFormTab.length; i++) {
          const temp = {}
          temp.newsIndex = this.multiFormTab[i].name
          temp.title = this.multiFormTab[i].title
          temp.author = this.multiFormTab[i].author
          temp.fromurl = this.multiFormTab[i].fromurl
          temp.picPath = this.multiFormTab[i].imageUrl
          temp.description = this.multiFormTab[i].description
          temp.showpic = this.multiFormTab[i].showpic
          temp.multType = 2
          this.news.push(temp)
        }
        console.log(this.news)

        addMulti(this.temp).then(() => {
          this.list.unshift(this.temp)
          this.multiFormDialog = false
          this.$notify({
            title: '成功',
            message: '添加成功',
            type: 'success',
            duration: 2000
          })
        })
      }

    }
  }
</script>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .img_default {
    width: 340px;
    height: 180px;
    background-color: red;
    margin-left: -50px;
  }

  .img_title {
    width: 280px;
    left: -22px;
    font-size: 16px;
    position: absolute;
    background-color: rgba(0, 0, 0, 0);
    border: rgba(0, 0, 0, 0);
    outline: none;
  }

  .img_default img {
    width: 100%;
  }

  .add_newtab {
    width: 320px;
    height: 80px;
  }

  .add_newtab img {
    width: 14%;
    padding-top: 10%;
  }

  .special_item .el-tabs__item {
    width: 350px;
    height: 100px;
    background-color: rgba(253, 253, 253, 0.9);
    text-align: left !important;
    padding-top: 30px;
    position: relative;
  }

  .special_item .el-tabs__item .el-icon-close {
    position: absolute !important;
    top: 10px !important;
    right: 10px !important;
  }
</style>
