<template>
  <div class="app-container">
    <div class="filter-container" style="padding-bottom: 20px;">
      <el-select clearable style="width: 90px" class="filter-item" v-model="listQuery.multType" placeholder="请选择图文类型">
        <el-option v-for="item in multTypeOptions" :key="item" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="请输入标题"
                v-model="listQuery.title" filterable>
      </el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="请输入作者"
                v-model="listQuery.author" filterable>
      </el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                 @click="singleCreate">添加单图文
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                 @click="multiCreate">添加多图文
      </el-button>
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
          <el-tag>{{scope.row.multType | statusFilter}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="原文链接">
        <template slot-scope="scope">
          <el-tag>{{scope.row.fromUrl}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="查看详情" align="center">
        <template slot-scope="scope">
          <el-button type="success" size="mini">
            <a :href="scope.row.url" target="_blank">预览文章</a>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="封面地址" align="center">
        <template slot-scope="scope">
          <el-tag>
            <a :href="scope.row.picPath" target="_blank"> {{scope.row.picPath}}</a>
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="created_at" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)"><i
            class="el-icon-edit"></i> 编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)" class=""><i
            class="el-icon-delete"></i> 删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @current-change="handleCurrentChange"
                     :current-page="listQuery.pageNo"
                     layout="total, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>


    <!--单图文消息-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="singleFormDialog" fullscreen width="80%">
      <span slot="title">编辑单图文</span>
      <el-form :model="singleForm" label-position="left" label-width="70px" style='margin-left:50px;'>
        <el-row :gutter="24" style="padding-top: 40px;">
          <el-col :span="8">
            <div class="img" v-if="singleImageUrl">
              <div style="position: relative;">
                <img v-bind:class="img_pic" v-if="singleImageUrl" :src="singleImageUrl" class="avatar"
                     style="width: 320px;height: 180px;background-image: url(img_pic);margin-left: -20px;">
                <input class="img_title" v-model="singleForm.title">
              </div>
            </div>
            <div class="img" v-else>
              <div class="img_default"><img :src="img_default" alt=""></div>
            </div>
          </el-col>
          <el-col :span="16">
            <el-form-item label="封面">
              <el-upload
                class="avatar-uploader"
                :action="singleImageUrl"
                :show-file-list="false"
                :before-upload="singlePicUpload">
                <img v-if="singleImageUrl" :src="singleImageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <el-tip>建议尺寸：900*500像素</el-tip>
              <br>
              <el-checkbox v-model="showpic">封面图片显示在正文中</el-checkbox>
            </el-form-item>
            <el-form-item label="标题">
              <el-input v-model="singleForm.title" :maxlength="64"></el-input>
            </el-form-item>
            <el-form-item label="作者">
              <el-input v-model="singleForm.author"></el-input>
            </el-form-item>
            <el-form-item label="摘要">
              <el-input v-model="singleForm.brief"></el-input>
            </el-form-item>
            <el-form-item label="原文链接">
              <el-input v-model="singleForm.fromUrl"></el-input>
            </el-form-item>
            <el-form-item label="留言">
              <el-switch
                v-model="singleForm.open_comment"
                inactive-text="否"
                active-text="是">
              </el-switch>
              &nbsp;
              <el-radio label="1" v-model="singleForm.fans_can_comment" v-show="singleForm.open_comment">所有人可留言
              </el-radio>
              <el-radio label="0" v-model="singleForm.fans_can_comment" v-show="singleForm.open_comment">仅粉丝可留言
              </el-radio>
            </el-form-item>
            <!--内容编辑器-->
            <el-form-item label="内容">
              <tinymce :height="300" v-model="singleForm.description"></tinymce>
            </el-form-item>
            <el-form-item label="效果预览">
              <div class="editor-content" v-html="singleForm.description"
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
        <el-row :gutter="24">
          <el-col :span="8">
            <el-button
              size="small"
              @click="addTab()" type="primary" style="margin-bottom: 10px;">
              添加图文消息
            </el-button>
            <el-row v-for="item, index in multiNews">

              <el-card v-if="index == 0" :body-style="{ padding: '0px' }">
                <div @click="syncData(index)">
                  <div class="img" v-if="singleImageUrl">
                    <div style="padding: 14px;">
                      <img v-if="item.picPath" :src="item.picPath" class="image">
                      <img  v-else :src="img_default" class="image">
                      <span class="main-title">{{item.title}}</span>
                    </div>
                  </div>


                  <div style="padding: 14px;">
                    <img v-if="item.picPath" :src="item.picPath" class="image">
                    <img  v-else :src="img_default" class="image">
                    <span class="main-title">{{item.title}}</span>
                    <!--<div class="bottom clearfix">-->
                      <!--<time class="time">{{item.brief}}</time>-->
                    <!--</div>-->
                  </div>
                </div>
                <el-button type="text" class="button delete-news" @click="remove(index)">删除</el-button>
              </el-card>

              <el-card v-else :body-style="{ padding: '0px' }">
                <div @click="syncData(index)">
                  <el-row :gutter="24">
                    <el-col :span="16" style="padding: 14px;">
                      <span style="margin-left: 30px;font-size: 16px;">{{item.title}}</span>

                    </el-col>
                    <el-col :span="8">
                      <div class="sub-news">
                        <img :src="item.picPath" class="image">
                      </div>
                    </el-col>
                  </el-row>
                </div>
                <el-button type="text" class="button delete-news" @click="remove(index)">删除</el-button>
              </el-card>

            </el-row>
          </el-col>
          <el-col :span="16">
            <el-form label-position="left" label-width="70px" style='margin-left:50px;'>
              <el-form-item label="标题">
                <el-input v-model="multiForm.title"></el-input>
              </el-form-item>
              <el-form-item label="封面">
                <el-upload v-model="multiForm.picPath"
                           class="avatar-uploader"
                           :action="multiImageUrl"
                           :before-upload="multiPicUpload"
                           :show-file-list="false">
                  <img v-if="multiForm.picPath" :src="multiForm.picPath" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <el-checkbox v-model="multiForm.showpic">封面图片显示在正文中</el-checkbox>
                <div slot="tip" class="el-upload__tip">建议比例：（900 * 500） | 只能上传jpg/png文件，且不超过500k</div>
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
                <tinymce ref="tinymce" :height="300" v-model="multiContent" :minlength="2"></tinymce>
              </el-form-item>
              <el-form-item label="效果预览">
              <div class="editor-content" v-html="multiContent"
              style="padding-bottom: 60px;border: 1px solid lightgray;"></div>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>

        <div slot="footer" class="dialog-footer" pull="4">
          <el-button @click="multiForm = false">取消</el-button>
          <el-button type="primary" @click="submitMulti">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>


<script>
  import {addMulti, addSingle, deleteNews, getNewsList} from '@/api/news'
  import {addImage} from '@/api/image'
  import {getUploadParams} from '@/api/upload'
  import Tinymce from '@/components/Tinymce'
  import img_pic from '@/assets/news/pic.png'
  import img_add from '@/assets/news/add.png'
  import img_default from '@/assets/news/default.png'
  import axios from 'axios'
  // import {getCookieAccount} from '@/utils/auth'

  export default {
    components: {Tinymce},
    data() {
      return {
        multiContent: '',
        currentNewsIndex: 0,
        filterable: true,
        singleImageUrl: '',
        multiImageUrl: '',
        uploadParams: {},
        multTypeOptions: [{
          value: '1',
          label: '单图文'
        }, {
          value: '2',
          label: '多图文'
        }],
        showpic: true,
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
          update: '编辑多图文',
          create: '添加多图文'
        },
        tabPosition: ' left',
        img_pic,
        img_add,
        img_default,
        listQuery: {
          pageNo: 1,
          title: '',
          type: '',
          // account: getCookieAccount()
        },
        singleForm: {
          title: '',
          author: '',
          picPath: '',
          open_comment: 1,
          fans_can_comment: 1,
          brief: '',
          fromUrl: '',
          multType: '',
          description: '',
          showpic: true
        },
        // tab栏切换
        multiForm: {},
        multiNews: [{
          title: '主图文',
          multiType: 2,
          showpic: 1,
          brief: '',
          author: '',
          thumbMediaId: '',
          picPath: '',
          fromUrl: '',
          openComment: 0,
          fansCanComment: 0,
          description: ''
        }, {
          title: '副图文',
          multiType: 2,
          showpic: 1,
          brief: '',
          author: '',
          thumbMediaId: '',
          picPath: '',
          fromUrl: '',
          openComment: 0,
          fansCanComment: 0,
          description: ''
        }]
      }
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          1: '单图文',
          2: '多图文'
        }
        return statusMap[status]
      }
    },
    created() {
      this.getConfig()
      this.fetchData()
    },
    methods: {
      remove(i) {
        console.log(this.multiNews.length)
        if (this.multiNews.length === 2) {
          this.$notify({
            title: '多图文至少有两篇文章',
            type: 'failure',
            duration: 1000
          })
          return false
        }
        this.multiNews.splice(i, 1)
      },
      syncData(i) {
        // 保存富文本内容到currentNewsIndex里面
        this.multiNews[this.currentNewsIndex].description = this.multiContent
        // console.log(this.multiNews)
        this.currentNewsIndex = i
        this.multiForm = this.multiNews[i]
        // 点击一次设置一次富文本显示内容
        this.$refs.tinymce.setContent(this.multiNews[i].description)
      },
      save() {
        let i = this.currentNewsIndex
        if (this.multiForm !== undefined) {
          this.multiNews[i] = this.multiForm
        }
      },
      // 获取列表
      fetchData() {
        this.listLoading = true
        getNewsList(this.listQuery).then(response => {
          this.list = response.data.list
          this.total = response.data.totalCount
          this.listLoading = false
        })
      },
      showPic(e) {
        if (e === 1) {
          return '是'
        } else if (e === 0) {
          return '否'
        }
      },
      // 添加的时候清空表单数据
      resetMultiForm() {
        this.multiForm = this.multiNews[0]
      },
      handleDelete(row) {
        deleteNews(row.id).then(() => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 1000
          })
        })
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
      },
      // 点击添加弹出对话框
      singleCreate() {
        // this.resetTemp()
        this.dialogStatus = 'create'
        this.singleFormDialog = true
      },
      // 添加多图文
      multiCreate() {
        // 首先重置temp存储的数据
        this.resetMultiForm()
        this.multiFormDialog = true
      },
      // 编辑列表图文素材（回显temp存储的数据）
      handleUpdate(news) {
        if (news.multType == 1) {
          this.singleForm = Object.assign({}, news)
          this.singleFormDialog = true
        } else {
          this.multiNews = Object.assign({}, news.articles)
          this.multiFormDialog = true
        }
      },
      handleCurrentChange(val) {
        this.listQuery.pageNo = val
        this.fetchData()
      },
      handleFilter() {
        this.fetchData()
      },
      // 获取图片上传参数
      getConfig() {
        getUploadParams().then(response => {
          this.uploadParams = response.data
          console.log(response.data)
          console.log('          console.lo\n')
        }).catch(err => {
          // console.log(err)
        })
      },
      // 通用图片上传
      picUpload(image, type) {
        console.log(this.uploadParams)
        // const isJPG = image.type === 'image/jpeg' || 'image/png' || 'image/gif'
        // const isLt2M = image.size / 1024 / 1024 < 2
        // if (!isJPG) {
        //   this.$message.error('上传头像图片只能是 JPG/png/gif 格式!')
        // }
        // if (!isLt2M) {
        //   this.$message.error('上传头像图片大小不能超过 2MB!')
        // }
        const param = new FormData()
        const data = this.uploadParams
        // key就代表文件层级和阿里云上的文件名
        param.append('key', data.dir + image.name)
        param.append('policy', data.policy)
        param.append('callback', data.callback)
        param.append('OSSAccessKeyId', data.accessid)
        param.append('callback', data.callback)
        // 阿里云正常返回204，然后返回信息是空的，想看到返回信息强制让它返回201，返回一个xml文件可以提取有用的信息
        param.append('success_action_status', 201)
        param.append('signature', data.signature)
        param.append('file', image, image.name)
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
        let url = ''
        axios.post('http://qxl-online.oss-cn-shenzhen.aliyuncs.com', param, config)
          .then(response => {
            url = 'http://qxl-online.oss-cn-shenzhen.aliyuncs.com/' + response.data.data.url
            const img = {}
            img.url = url
            img.fileName = image.name
            addImage(img).then(response => {
              console.log(response)
              if (type === 1) {
                this.singleForm.thumbMediaId = response.data.mediaId
                this.singleForm.picPath = response.data.url
                this.singleImageUrl = url
              }
              if (type === 2) {
                for (let i = 0; i < this.multiNews.length; i++) {
                  if (this.multiForm.title === this.multiNews[i].title) {
                    const temp = Object.assign({}, this.multiNews[i])
                    temp.picPath = response.data.url
                    temp.thumbMediaId = response.data.mediaId
                    this.multiNews.splice(i, 1, temp)
                    this.multiForm = this.multiNews[i]
                  }
                }
              }
            }).catch(err => {
              console.log(err)
            })
          })
        return url
      },
      // 单图文图片上传
      singlePicUpload(image) {
        this.picUpload(image, 1)
        return false
      },
      // 多图文图片上传
      multiPicUpload(image) {
        this.picUpload(image, 2)
        return false
      },
      // 添加多图文的tab
      addTab() {
        const data = {
          title: '新增图文',
          multiType: 2,
          showpic: 1,
          brief: '',
          author: '',
          thumbMediaId: '',
          fromUrl: '',
          description: ''
        }
        this.multiNews.push(data)
        this.multiForm = data
      },
      removeTab(targetName) {
        const tabs = this.multiNews
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
        this.multiNews = tabs.filter(tab => tab.name !== targetName)
      },
      // 提交单图文数据
      submitSingle() {
        this.singleForm.multType = 1
        // 获取当前选中公众号的account
        // this.singleForm.account = getCookieAccount()
        console.log(this.singleForm)
        addSingle(this.singleForm).then(() => {
          this.list.unshift(this.singleForm)
          this.singleFormDialog = false
          this.$notify({
            title: '成功',
            message: '添加成功',
            type: 'success',
            duration: 1000
          })
        })
      },
      // 提交多图文数组
      submitMulti() {
        console.log(this.multiNews)
        addMulti(this.multiNews).then(() => {
          this.multiFormDialog = false
          this.$notify({
            title: '成功',
            message: '添加成功',
            type: 'success',
            duration: 1000
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
    font-size: 18px;
    position: absolute;
    bottom: 18px;
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

  .filter-item {
    display: inline-block;
    vertical-align: middle;
    margin-bottom: 10px;
  }

  .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .sub-news {
    width: 60px;
    height: 60px;
    margin-top: 26px;
  }

  .sub-news img {
    width: 100%;
    height: 100%;
  }

  .delete-news {
    margin: 0 20px 10px 0;
  }
  .main-title{
    position: absolute;
    bottom: 60px;
    left: 40px;
    font-size: 18px;
  }
</style>
