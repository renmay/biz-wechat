<template>

  <el-menu class="topbar" mode="horizontal">
    <div class="center-wrapper">
      <h3>当前公众号 <a class="center-title" @click="initData">{{currentAccount}}</a></h3>
      <!--点击公众号弹出所有公众号-->
      <el-dialog title="选择公众号" :visible.sync="dialogFormVisible" width="70%" :model="form">
        <el-dialog
          width="30%"
          title="内层 Dialog"
          :visible.sync="innerVisible"
          append-to-body>
        </el-dialog>
        <div class="app-container">
          <div class="filter-container" style="padding-bottom: 20px;">
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="请输入标题"
                      v-model="listQuery.name" filterable>
            </el-input>
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索
            </el-button>
          </div>
          <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit
                    highlight-current-row>
            <el-table-column align="center" label='序号' width="95">
              <template slot-scope="scope">
                {{scope.$index + 1}}
              </template>
            </el-table-column>
            <el-table-column label="公众号">
              <template slot-scope="scope">
                {{scope.row.name}}
              </template>
            </el-table-column>
            <el-table-column label="公众微信号" width="110" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.account}}</span>
              </template>
            </el-table-column>
            <el-table-column label="店铺名称" width="110" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.storeName}}</span>
              </template>
            </el-table-column>
            <!--<el-table-column class-name="status-col" label="公众号类型" width="110" align="center">-->
            <!--<template slot-scope="scope">-->
            <!--<el-tag :type="scope.row.status | statusFilter">{{scope.row.status}}</el-tag>-->
            <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column align="center" prop="created_at" label="公众号编辑" width="200">
              <template slot-scope="scope">
                  <el-button size="mini" type="primary" @click="chooseAccount(scope.row.id)">选择公众号</el-button>
              </template>
            </el-table-column>

          </el-table>
          <!--分页-->
          <div class="pagination-container" style="margin-top: 20px;">
            <el-pagination background  @current-change="handleCurrentChange"
                           :current-page="1"  :page-size="10"
                           layout="total, prev, pager, next, jumper" :total="total">
            </el-pagination>
          </div>
        </div>
      </el-dialog>

    </div>

    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <!--<img class="user-avatar" :src="avatar+'?imageView2/1/w/80/h/80'">-->
        <img :src="img_avatar" alt="" class="user-avatar img_avatar">

        <i class="el-icon-caret-bottom"></i>
      </div>
      <el-dropdown-menu class="user-dropdown" slot="dropdown">
        <router-link class="inlineBlock" to="/">
          <el-dropdown-item>
            首页
          </el-dropdown-item>
        </router-link>
        <el-dropdown-item divided>
          <span @click="logout" style="display:block;">退出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-menu>


</template>

<script>
  import {mapGetters} from 'vuex'
  import Breadcrumb from '@/components/Breadcrumb'
  import Hamburger from '@/components/Hamburger'
  import img_avatar from '@/assets/news/avatar.gif'
  import {setCookieAccount} from '@/utils/auth'

  import {chooseAccount, fetchList, getCurrentAccount} from '@/api/account'

  export default {
    name: 'Topbar',
    data() {
      return {
        currentAccount: '',
        list: null,
        listLoading: true,
        dialogFormVisible: false,
        formLabelWidth: '120px',
        img_avatar,
        form: {},
        listQuery:{
          pageNo: 1
        }
      }
    },
    components: {
      Breadcrumb,
      Hamburger
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'avatar'
      ])
    },
    // 一创建就执行以下方法
    created() {
      this.fetchData()
    },
    methods: {
      handleFilter() {
        this.fetchList()
      },
      handleCurrentChange(val) {
        this.listQuery.pageNo = val
        this.fetchList()
      },
      fetchList(){
        fetchList(this.listQuery).then((response) => {
          this.list = response.data.list
          this.total = response.data.totalCount
        })
      },
      fetchData() {
        this.listLoading = true
        getCurrentAccount().then(response => {
          // 设置当前选中的account
          setCookieAccount(response.data.account)
          this.currentAccount = response.data.name
          // setCurrentAccount(response.data.account)
          this.listLoading = false
        })
      },
      // 获取公众号列表
      initData() {
        this.dialogFormVisible = true
        this.listLoading = true
        fetchList(this.listQuery).then(response => {
          this.list = response.data.list
          this.total = response.data.totalCount
          this.listLoading = false
          // console.log(response)
        })
      },
      // sidebar下拉框
      toggleSideBar() {
        this.$store.dispatch('ToggleSideBar')
      },
      logout() {
        this.$store.dispatch('LogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done()
          })
          .catch(_ => {
          })
      },
      // 弹出框获取公众号列表
      chooseAccount(id) {
        chooseAccount(id).then((response) => {
          console.log(response)
          this.dialogFormVisible = false
          this.currentAccount = response.data.name
          location.reload()
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .topbar {
    height: 50px;
    line-height: 50px;
    border-radius: 0px !important;
    .hamburger-container {
      line-height: 58px;
      height: 50px;
      float: left;
      padding: 0 10px;
    }
    .screenfull {
      position: absolute;
      right: 90px;
      top: 16px;
      color: red;
    }
    .center-wrapper {
      display: inline;
      line-height: 58px;
      position: absolute;
      top: -20px;
      right: 50%;
      color: #2d3a4b;
      .center-title {
        font-size: 24px;
        color: #409EFF;
      }
    }
    .avatar-container {
      height: 50px;
      display: inline-block;
      position: absolute;
      right: 35px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
    .choose_wechat .el-button {
      margin-bottom: 10px;
    }
  }
</style>

