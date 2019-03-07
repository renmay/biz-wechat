<template>
  <div class="app-container">
    <span slot="title">菜单管理</span>
    <el-row :gutter="20" style="padding-top: 40px;">
      <el-col :span="8">
        <div class="wechat_box" style="position: relative;">
          <img class="img_header" :src="img_header" alt="img_header">
          <div>
            <img class="img_footer" :src="img_footer" alt="img_footer" style="position: absolute;bottom: 0;">

            <div class="footer_box">


              <div class="menu" style="float: left;" v-for="menu,index in menus">

                <div class="add_submenu" v-show="currentMenuIndex == index">
                  <!--子菜单-->
                  <div class="subbutton" v-for="submenu,subIndex in menu.subButton">
                    <div @click="syncSubData(index,subIndex)" class="submenu-name"
                         v-bind:class="{'active':isActive == subIndex && hiddenMenuIndex == -1}">
                      {{submenu.name}}
                    </div>
                  </div>
                  <!--添加子菜单按钮-->
                  <div @click="addSubMenu(index)" v-show="menu.subButton.length < 5">
                    <img :src="img_grayadd" alt="" class="img_add">
                  </div>
                </div>
                <div @click="syncData(index)" class="menu_name"
                     v-bind:class="{'active':isActive == index && currentSubIndex== -1}">
                  {{menu.name}}
                </div>
              </div>
              <!--添加menu的按钮-->
              <div class="add_menu" style="float: left;" @click="addMenu()" v-show="menus.length < 3">
                <img :src="img_grayadd" alt="" class="img_add">
              </div>
            </div>
          </div>
        </div>
      </el-col>


      <el-col :span="16">
        <div class="grid-content bg-purple">
          <el-form :model="form" label-width="120px" v-show="currentMenuIndex != -1">
            <div class="delete-menu">
              <span v-if="currentSubIndex == -1" @click="delDialog = true">删除菜单</span>
              <span v-if="hiddenMenuIndex== -1" @click="delDialog = true">删除子菜单</span>
            </div>
            <el-form-item label="菜单标题" v-if="currentSubIndex == -1">
              <el-input v-model="form.name" :maxlength="4"></el-input>
              <el-tip>字数不超过4个汉字或8个字母</el-tip>
            </el-form-item>
            <el-form-item label="菜单标题" v-if="hiddenMenuIndex== -1">
              <el-input v-model="form.name" :maxlength="6"></el-input>
              <el-tip>字数不超过6个汉字或12个字母</el-tip>
            </el-form-item>
            <el-form-item label="菜单内容">
              <el-tabs type="border-card" v-model="form.type">
                <el-tab-pane name="click">
                  <span slot="label">发送消息</span>
                  <div>
                    <div class="imgbox">
                      <a @click="openDialog" href="javascript:void(0);"><img class="img_add"
                                                                             :src="img_add"
                                                                             alt="img_wechat">
                        <span class="img_title" v-show="form.msgId == undefined">从素材库选取</span>
                        <el-tag class="msg-name" v-show="form.msgId">{{msgName}}</el-tag>
                      </a>
                    </div>

                  </div>
                  <!-- 素材打开的界面 -->
                  <el-dialog title="选择素材" :visible.sync="dialogTableVisible" width="60%">
                    <el-tabs v-model="msgType">
                      <el-tab-pane @click="msgType='news'" label="图文素材" name="news">
                        <el-table :data="newsList" v-loading.body="listLoading" element-loading-text="Loading" border
                                  fit highlight-current-row>
                          <el-table-column align="center" label='序号' width="95">
                            <template slot-scope="scope">
                              {{scope.$index + 1}}
                            </template>
                          </el-table-column>
                          <el-table-column label="类型" align="center">
                            <template slot-scope="scope">
                              图文素材
                            </template>
                          </el-table-column>
                          <el-table-column label="图文标题" align="center">
                            <template slot-scope="scope">
                              {{scope.row.title}}
                            </template>
                          </el-table-column>
                          <el-table-column label="图片路径" align="center">
                            <template slot-scope="scope">
                              <el-tag>{{scope.row.picPath}}</el-tag>
                            </template>
                          </el-table-column>
                          <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                              <el-button type="primary" size="mini" @click="getBaseId(scope.row)">
                                选择
                              </el-button>
                            </template>
                          </el-table-column>
                        </el-table>
                        <!--分页-->
                        <div class="pagination-container">
                          <el-pagination background @current-change="handleCurrentChange"
                                         :current-page="newsListQuery.page" :page-sizes="[10,20,30, 50]"
                                         :page-size="newsListQuery.limit"
                                         layout="total, prev, pager, next, jumper" :total="newsTotal">
                          </el-pagination>
                        </div>
                      </el-tab-pane>

                      <el-tab-pane @click="msgType='text'" label="文本素材" name="text">
                        <el-table :data="textList" v-loading.body="listLoading" element-loading-text="Loading"
                                  border
                                  fit highlight-current-row>
                          <el-table-column align="center" label='序号' width="95">
                            <template slot-scope="scope">
                              {{scope.$index + 1}}
                            </template>
                          </el-table-column>
                          <el-table-column label="类型" align="center">
                            <template slot-scope="scope">
                              文本素材
                            </template>
                          </el-table-column>
                          <el-table-column label="标题" align="center">
                            <template slot-scope="scope">
                              <el-tag>{{scope.row.title}}</el-tag>
                            </template>
                          </el-table-column>
                          <el-table-column label="内容" align="center">
                            <template slot-scope="scope">
                              {{scope.row.content}}
                            </template>
                          </el-table-column>
                          <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                              <el-button type="primary" size="mini" @click="getBaseId(scope.row)">
                                选择
                              </el-button>
                            </template>
                          </el-table-column>
                        </el-table>
                        <!--分页-->
                        <div class="pagination-container">
                          <el-pagination background @current-change="handleCurrentChange"
                                         :current-page="textListQuery.page" :page-sizes="[10,20,30, 50]"
                                         :page-size="textListQuery.limit"
                                         layout="total, prev, pager, next, jumper" :total="textTotal">
                          </el-pagination>
                        </div>
                      </el-tab-pane>

                      <el-tab-pane @click="msgType='image'" label="图片素材" name="image">
                        <el-table :data="imageList" v-loading.body="listLoading" element-loading-text="Loading"
                                  border
                                  fit highlight-current-row>
                          <el-table-column align="center" label='序号' width="95">
                            <template slot-scope="scope">
                              {{scope.$index + 1}}
                            </template>
                          </el-table-column>
                          <el-table-column label="类型" align="center">
                            <template slot-scope="scope">
                              图片素材
                            </template>
                          </el-table-column>
                          <el-table-column label="标题" align="center">
                            <template slot-scope="scope">
                              {{scope.row.name}}
                            </template>
                          </el-table-column>
                          <el-table-column label="url" align="center">
                            <template slot-scope="scope">
                              <el-tag>
                                {{scope.row.httpUrl}}
                              </el-tag>
                            </template>
                          </el-table-column>
                          <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                              <el-button type="primary" size="mini" @click="getBaseId(scope.row)">
                                选择
                              </el-button>
                            </template>
                          </el-table-column>
                        </el-table>
                        <!--分页-->
                        <div class="pagination-container">
                          <el-pagination background @current-change="handleCurrentChange"
                                         :current-page="imageListQuery.page" :page-sizes="[10,20,30, 50]"
                                         :page-size="imageListQuery.limit"
                                         layout="total, prev, pager, next, jumper" :total="imageTotal">
                          </el-pagination>
                        </div>
                      </el-tab-pane>

                    </el-tabs>
                  </el-dialog>
                </el-tab-pane>

                <el-tab-pane name="view" label="跳转网页">
                  <div style="color:#606266;padding-bottom: 20px;">
                    点击该子菜单会跳到以下链接
                  </div>
                  <el-form-item label="页面地址">
                    <div>
                      <el-input v-model="form.url" placeholder="http://"></el-input>
                    </div>
                  </el-form-item>
                </el-tab-pane>
                <el-tab-pane name="miniprogram" label="跳转小程序">
                  <div style="color:#606266;padding-bottom: 20px;">
                    点击该菜单跳转到关联的小程序
                  </div>
                  <el-form-item label="APPID" style="color:#606266;padding-bottom: 18px;">
                    <el-input v-model="form.appId" placeholder="请确保小程序与公众号已关联"></el-input>
                  </el-form-item>
                  <el-form-item label="页面地址" style="color:#606266;padding-bottom: 18px;">
                    <el-input v-model="form.pagePath" placeholder=""></el-input>
                  </el-form-item>
                  <el-form-item label="备用页面" style="color:#606266;padding-bottom: 18px;">
                    <el-input v-model="form.url" placeholder="旧版微信客户端不支持小程序，用户点击菜单时会打开该网页"></el-input>
                  </el-form-item>
                </el-tab-pane>

              </el-tabs>
            </el-form-item>
            <el-form-item>
              <el-button @click="submit">保存</el-button>
              <el-button type="primary" @click="publish">发布</el-button>
            </el-form-item>
          </el-form>
        </div>

      </el-col>
    </el-row>
    <!--选择素材弹出框-->
    <el-dialog
      title="提示"
      :visible.sync="centerDialogVisible"
      width="30%"
      center>
      <span>需要注意的是内容是默认不居中的</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="centerDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>

    <!--删除提示-->
    <el-dialog
      title="温馨提示"
      :visible.sync="delDialog"
      width="40%"
      left>
      <span>删除后此菜单下设置的内容将被删除</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="delDialog = false">取 消</el-button>
    <el-button type="danger" @click="deleteMenu">确 定</el-button>
  </span>
    </el-dialog>


  </div>
  </div>
</template>

<script>
  import img_header from '@/assets/menu/header.png'
  import img_footer from '@/assets/menu/footer.png'
  import img_grayadd from '@/assets/menu/grayadd.png'
  import img_add from '@/assets/menu/add.png'
  import img_menu from '@/assets/menu/menu.png'
  import {fetchList, getMsgByMsgId, publish, save} from '@/api/menu'
  import {getNewsList} from '@/api/news'
  import {getTextList} from '@/api/text'
  import {getImageList} from '@/api/image'

  export default {
    data() {
      return {
        msgName: '',
        isActive: 10,
        currentSubIndex: -1,
        msgId: '',
        currentMenuIndex: -1,
        hiddenMenuIndex: -1,
        textList: [],
        imageList: [],
        newsList: [],
        currentSubMenuId: '',
        currentMenuId: '',
        messages: [],
        dialogTableVisible: false,
        dialogFormVisible: false,
        delDialog: false,
        formLabelWidth: '120px',
        form: {
          type: 'click'
        },
        newForm: {},
        radio: '1',
        img_header,
        img_footer,
        img_add,
        img_grayadd,
        img_menu,
        newsTotal: 0,
        textTotal: 0,
        imageTotal: 0,
        msgType: 'news',
        centerDialogVisible: false,
        menus: [],
        newsListQuery: {
          pageNo: 1,
          pageSize: 10
        },
        textListQuery: {
          pageNo: 1,
          pageSize: 10
        },
        imageListQuery: {
          pageNo: 1,
          pageSize: 10
        }
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      //type,素材类型，1-图文，2-文字，3-图片
      handleCurrentChange(val) {
        if (this.msgType === 'news') {
          this.newsListQuery.pageNo = val
          this.fetchNews()
        } else if (this.msgType === 'text') {
          this.textListQuery.pageNo = val
          this.fetchText()
        } else if (this.msgType === 'image') {
          this.imageListQuery.pageNo = val
          this.fetchImage()
        }
      },
      submit() {
        console.log(this.menus)
        if (!this.validateMenu()) {
          this.$notify({
            title: '失败',
            message: '保存失败,请填写完整菜单项目',
            type: 'failure',
            duration: 2000
          })
          return false
        }
        save(this.menus).then(response => {
          this.$notify({
            title: '成功',
            message: '保存成功',
            type: 'success',
            duration: 2000
          })
        }).catch(err => {
          this.$notify({
            title: '失败',
            message: '发布失败' + err.message,
            type: 'failure',
            duration: 2000
          })
        })
      },
      // 点击菜单
      syncData(i) {
        this.isActive = i
        this.currentSubIndex = -1
        this.currentMenuIndex = i
        this.hiddenMenuIndex = i
        if (undefined !== this.menus[i]) {
          this.form = this.menus[i]
          if (this.form.type === 'click') {
            this.getMsgByMsgId(this.form.msgId)
          }
        }
      },
      // 点击子菜单
      syncSubData(index, i) {
        this.isActive = i
        console.log(index)
        console.log(i)
        console.log(this.menus[index])
        console.log(this.menus[index].subButton[i])
        if (undefined !== this.menus[index].subButton[i]) {
          this.form = this.menus[index].subButton[i]
          if (this.form.type === 'click') {
            this.getMsgByMsgId(this.form.msgId)
          }
        }
        this.currentSubIndex = i
        this.hiddenMenuIndex = -1
        console.log(this.form)
      },
      getMsgByMsgId(msgId) {
        getMsgByMsgId(msgId).then(response => {
          if (response.data.title !== undefined) {
            this.msgName = response.data.title
          } else {
            this.msgName = response.data.name
          }
        })
      },

      // 保存的时候校验
      validate(menu) {
        if (menu.subButton.length > 0) {
          return true
        }
        if (menu.type === 'click') {
          if ((menu.msgType === undefined || menu.msgId === undefined)) {
            return false
          }
        } else if (menu.type === 'view') {
          if (menu.url === undefined) {
            return false
          }
        } else if (menu.type === 'miniprogram') {
          if (menu.appId === undefined || menu.pagePath === undefined) {
            return false
          }
        }
        return true
      },
      // 有子菜单的时候校验
      validateMenu() {
        for (const m in this.menus) {
          const menu = this.menus[m]
          if (menu.subButton !== undefined && menu.subButton.length > 0) {
            for (const subM in m.subButton) {
              const subMenu = menu.subButton[subM]
              return this.validate(subMenu)
            }
          }
          return this.validate(menu)
        }
        return true
      },
      // 保存菜单
      addMenu() {
        const data = {
          name: '添加菜单',
          subButton: []
        }
        this.menus.push(data)
      },
      // 保存子菜单
      addSubMenu(index) {
        const data = {
          name: '添加子菜单'
        }
        const menu = this.menus[index]
        console.log(menu)
        menu.subButton.push(data)
        this.menus.splice(index, 1, menu)
        console.log(this.menus)
        console.log('保存子菜单')
      },
      // 发布菜单
      publish() {
        publish().then(response => {
          this.$notify({
            title: '成功',
            message: '发布成功',
            type: 'success',
            duration: 2000
          })
        }).catch(err => {
          this.$notify({
            title: '失败',
            message: '发布失败' + err.message,
            type: 'failure',
            duration: 2000
          })
        })
      },
      // 获取菜单
      fetchData() {
        this.listLoading = true
        fetchList(this.listQuery).then(response => {
          console.log(response.data)
          if (response.data.menus === null) {
            this.listLoading = false
            this.menus = []
            return
          }
          this.menus = response.data
          this.listLoading = false
        })
      },
      // 选择素材框
      openDialog() {
        this.fetchNews()
        this.fetchText()
        this.fetchImage()
        this.dialogTableVisible = true
      },
      // 选择素材id
      getBaseId(msg) {
        this.form.type = 'click'
        this.form.msgType = this.msgType
        this.form.msgId = msg.baseId
        if (this.msgType === 'news') {
          this.msgName = msg.title
        } else if (this.msgType === 'text') {
          this.msgName = msg.title
        } else if (this.msgType === 'image') {
          this.msgName = msg.name
        }
        console.log(this.form)
        this.dialogTableVisible = false
      },
      //  获取newsList
      fetchNews() {
        this.listLoading = true
        getNewsList(this.newsListQuery).then(response => {
          this.newsList = response.data.list
          this.newsTotal = response.data.totalCount
          this.listLoading = false
        })
      },
      //  获取textList
      fetchText() {
        this.listLoading = true
        getTextList(this.textListQuery).then(response => {
          this.textList = response.data.list
          this.textTotal = response.data.totalCount
          this.listLoading = false
        })
      },
      //  获取imageList
      fetchImage() {
        this.listLoading = true
        getImageList(this.imageListQuery).then(response => {
          this.imageList = response.data.list
          this.imageTotal = response.data.totalCount
          this.listLoading = false
        })
      },
      resetForm() {
        this.form = {}
      },
      deleteMenu() {
        if (this.currentSubIndex === -1) {
          console.log('没有点击子菜单，删除父菜单')
          this.menus.splice(this.currentMenuIndex, 1)
          this.resetForm()
          this.delDialog = false
        } else {
          console.log('点击了第' + this.currentMenuIndex + '个菜单，子菜单是第' + this.currentSubIndex + '个')
          this.menus[this.currentMenuIndex].subButton.splice(this.currentSubIndex, 1)
          this.resetForm()
          this.delDialog = false
        }
      }
    }
  }
</script>

<style>
  .wechat_box {
    width: 319px;
    height: 552px;
    background-color: rgb(245, 247, 250);
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .imgbox {
    width: 280px;
    height: 200px;
    border: 3px dashed lightgray;
    margin: 10% 30%;
    position: relative;
    text-align: center;
  }

  .imgbox img {
    width: 80px;
    margin: 18% -50%;
    color: #409EFF;
  }

  .img_menu {
    width: 10px;
    height: 10px;
    margin-right: 6px;
  }

  .imgbox .img_title, .msg-name {
    width: 260px;
    position: absolute;
    left: 8px;
    bottom: 8px;
    color: #409EFF;
    font-size: 16px;
  }

  .msg-name {
    text-align: center;
    outline: none;
    border: none;
    cursor: pointer;
  }

  .footer_box {
    position: absolute;
    bottom: 0;
    margin-left: 43px;
    width: 276px;
    height: 50px;
  }

  .active {
    border: 1px solid #44b549;
    color: #44b549;
    width: 88px;
    line-height: 46px;
    text-align: center;
    font-size: 14px;
    cursor: pointer;
  }

  .menu:last-child {
    border-left: none;
  }

  .add_menu {
    width: 33%;
    cursor: pointer;
  }

  .footer_box {
    clear: both;
  }

  .menu {
    border: 1px solid lightgray;
    width: 33%;
    line-height: 46px;
    text-align: center;
    font-size: 14px;
    cursor: pointer;
    position: relative;
  }

  .menu_name {
    width: 100%;
    color: gray;
  }

  .add_submenu {
    position: absolute;
    bottom: 46px;
    width: 100%;
    line-height: 46px;
    border: 1px solid lightgray;
  }

  .subbutton {
    width: 100%;
    border-bottom: 1px solid lightgray;
  }

  .add_submenu img {
    width: 20px;
    height: 20px;
  }

  .add_menu .img_add {
    width: 20px;
    margin: 17% 44%;
  }

  .delete-menu {
    position: absolute;
    right: 18px;
    top: 0;
    cursor: pointer;
    color: rgb(60, 144, 236);
  }
  .delete-menu:hover {
    color: rgb(59, 136, 238);
  }

</style>
