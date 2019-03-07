<template>
  <div class="app-container">
    <span slot="title">添加单图文</span>
    <el-row :gutter="20" style="padding-top: 40px;">
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <div style="position: relative;">
            <!--<img class="img_pic" :src="img_pic" alt="" v-model="form.name">-->
            <img v-bind:class="img_pic" v-if="imageUrl" :src="imageUrl" class="avatar"
                 style="width: 320px;height: 180px;background-image: url(img_pic);">
            <input class="img_title" v-if="imageUrl" v-model="form.name">
          </div>
        </div>
      </el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple">
          <el-form ref="form" :model="form" label-width="120px">
            <el-form-item label="标题">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="封面">
              <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <div slot="tip" class="el-upload__tip">建议比例：（900 * 500） | 只能上传jpg/png文件，且不超过500k</div>
              </el-upload>
            </el-form-item>
            <el-form-item label="作者">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="原文链接">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="留言">
              <el-switch v-model="form.delivery"></el-switch>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <el-radio v-model="radio" label="1">所有人可留言</el-radio>
              <el-radio v-model="radio" label="2">仅粉丝可留言</el-radio>
            </el-form-item>
            <!--内容编辑器-->
            <el-form-item label="内容">
              <!--<el-input type="textarea" v-model="form.desc"></el-input>-->
              <tinymce :height="300" v-model="content"></tinymce>
            </el-form-item>
            <el-form-item label="效果预览">
              <div class="editor-content" v-html="content"
                   style="padding-bottom: 60px;border: 1px solid lightgray;"></div>
            </el-form-item>
            <el-form-item>
              <el-button @click="onCancel">取消</el-button>
              <el-button type="primary" @click="onSubmit">提交</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
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

  .bg-purple {
    /*background: #faf5ff;*/
    border: 1px solid rgba(250, 250, 250, 0);
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .img_pic {
    width: 320px;
    height: 180px;
  }

  .img_title {
    width: 280px;
    position: absolute;
    left: 8px;
    bottom: 8px;
    background-color: rgba(0, 0, 0, 0);
    border: rgba(0, 0, 0, 0);
  }

</style>
<script>
  import img_pic from '@/assets/document/pic.png'
  import Tinymce from '@/components/Tinymce'

  export default {
    components: { Tinymce },
    data() {
      return {
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: true,
          type: [],
          resource: '',
          desc: ''
        },
        radio: '1',
        img_pic,
        content:
          `<p style="text-align: center;">请在此处编辑</p>`
      }
    },
    methods: {
      onSubmit() {
        this.$message('submit!')
      },
      onCancel() {
        this.$message({
          message: 'cancel!',
          type: 'warning'
        })
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw)
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg'
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
      }
    }
  }
</script>
