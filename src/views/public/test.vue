<template>
  <!--多图文消息-->
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
                <img :src="item.picPath" class="image">
                <div style="padding: 14px;">
                  <span>{{item.title}}</span>
                  <div class="bottom clearfix">
                    <time class="time">{{item.brief}}</time>
                  </div>
                </div>
              </div>
              <el-button type="text" class="button delete-news" @click="remove(index)">删除</el-button>
            </el-card>
            <el-card v-else :body-style="{ padding: '0px' }">
              <div @click="syncData(index)">
                <el-row :gutter="24">
                  <el-col :span="16" style="padding: 14px;">
                    <span>{{item.title}}</span>
                    <div class="bottom clearfix">
                      <time class="time">{{item.brief}}</time>
                    </div>
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

              <img v-if="multiForm.picPath" :src="multiForm.picPath" class="avatar">
              <el-button @click="uploadImage(multiForm.t)"> 上传图片</el-button>
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
              <tinymce :height="300" v-model="multiForm.description"></tinymce>
            </el-form-item>
            <el-form-item label="效果预览">
              <div class="editor-content" v-html="multiForm.description"
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
        currentNewsIndex: -1,
        filterable: true,
        singleImageUrl: '',
        multiImageUrl: '',
        uploadParams: {},
        // multTypeOptions: [{
        //   value: '1',
        //   label: '单图文'
        // }, {
        //   value: '2',
        //   label: '多图文'
        // }],
        multTypeOptions: [1, 2],
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
          picPath: 'http://qxl-online.oss-cn-shenzhen.aliyuncs.com/20180608/57504817280876544.jpg',
          t: 123432
        },
          {
            title: '副图文',
            picPath: 'http://qxl-online.oss-cn-shenzhen.aliyuncs.com/20180608/57504817280876544.jpg',
            t: 2131
          }],
        tabIndex: 2
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
      uploadImage(t){
        for(let i = 0; i< this.multiNews.length; i++){
           if (t === this.multiNews[i].t){
             const temp = Object.assign({}, this.multiNews[i])
             temp.picPath='https://wx3.sinaimg.cn/large/006tKfTcgy1fdwqcskm8rj308c06ygm5.jpg'
             this.multiNews.splice(i, 1,temp)
             this.multiForm = this.multiNews[i]
           }
        }
      },
      remove(i) {
        console.log(this.multiNews.length)
        if (this.multiNews.length == 2) {
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
        this.currentNewsIndex = i
        this.multiForm = this.multiNews[i]
      },
      save() {
        let i = this.currentNewsIndex
        if (this.multiForm !== undefined) {
          this.multiNews[i] = this.multiForm
        }
      },
      // 添加多图文的tab
      addTab() {
        const data = {
          title: '图文标题',
          multType: 2,
          t: new Date()
        }
        this.multiNews.push(data)
        this.multiForm = data
      },
      // 提交多图文数组
      submitMulti() {
        console.log(this.multiNews)
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
    width: 50px;
    height: 50px;
    margin-top: 12px;
  }

  .sub-news img {
    width: 100%;
    height: 100%;
  }

  .delete-news {
    margin: 0 20px 10px 0;
  }
</style>
