<template>
  <div class="app-container">
    <div class="filter-container" style="padding-bottom: 20px;">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="请输入公众号"
                v-model="listQuery.name" filterable>
      </el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="请输入微信号"
                v-model="listQuery.account" filterable>
      </el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="请输入店铺名称"
                v-model="listQuery.storeName" filterable>
      </el-input>

      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="primary" @click="resetFilter">重置</el-button>

      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                 @click="handleCreate">添加微信公众号
      </el-button>
    </div>

    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
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
      <el-table-column label="微信号" width="110" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.account}}</span>
        </template>
      </el-table-column>
      <el-table-column label="url" align="center">
        <template slot-scope="scope">
          {{scope.row.url}}
        </template>
      </el-table-column>
      <el-table-column label="公众帐号TOKEN" align="center">
        <template slot-scope="scope">
          {{scope.row.token}}
        </template>
      </el-table-column>
      <el-table-column label="appId" align="center">
        <template slot-scope="scope">
          {{scope.row.appId}}
        </template>
      </el-table-column>
      <el-table-column label="appSecret" align="center">
        <template slot-scope="scope">
          {{scope.row.appSecret}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="店铺名称" width="120">
        <template slot-scope="scope">
          <el-tag type="primary" v-if="scope.row.storeId">{{scope.row.storeName}}
          </el-tag>
          <el-tag type="info" v-else>未绑定
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="unbindStore(scope.row)" v-if="scope.row.storeId">解绑店铺
          </el-button>

          <el-button type="primary" size="mini" @click="showStoreListDialog(scope.row,scope.$index)" v-else>绑定店铺
          </el-button>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="110" align="center">
        <template slot-scope="scope">
          <el-tag>{{scope.row.status | statusFilter}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="created_at" label="操作" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="enableAccount(scope.row)" v-show="scope.row.status==0">启用
          </el-button>
          <el-button type="danger" size="mini" @click="disableAccount(scope.row)" v-show="scope.row.status==1">禁用
          </el-button>

          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)"><i class="el-icon-edit"></i> 编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                     layout="total, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!--绑定店铺弹出框-->
    <el-dialog title="选择店铺" :visible.sync="storeListDialog" width="60%">
      <div class="app-container">
        <div class="filter-container" style="padding-bottom: 20px;">
          <el-input @keyup.enter.native="handleStoreFilter" style="width: 200px;" class="filter-item" placeholder="请输入标题"
                    v-model="storeListQuery.name" filterable>
          </el-input>
          <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleStoreFilter">搜索
          </el-button>
        </div>
        <el-table :data="storeList" v-loading.body="listLoading" element-loading-text="Loading" border fit
                  highlight-current-row>
          <el-table-column align="center" label='序号' width="95">
            <template slot-scope="scope">
              {{scope.$index + 1}}
            </template>
          </el-table-column>
          <el-table-column label="店铺名称" width="110" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column label="店铺id">
            <template slot-scope="scope">
              <span>{{scope.row.id}}</span>
            </template>
          </el-table-column>
          <el-table-column label="店铺id">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="bind(scope.row)">绑定此店铺</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!--分页-->
        <div class="pagination-container" style="padding-top: 20px;">
          <el-pagination background @current-change="handleStoreCurrentChange"
                         :current-page="storeListQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                         layout="total, prev, pager, next, jumper" :total="storeTotal">
          </el-pagination>
        </div>

      </div>
    </el-dialog>

<!--添加微信公众号弹出框-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="accountFromDialog">
      <span slot="title">添加微信公众号</span>
      <el-form :model="accountFrom" label-position="left" label-width="70px" style='margin-left:50px;'>
        <el-form-item label="名称">
          <el-input v-model="accountFrom.name"></el-input>
        </el-form-item>
        <el-form-item label="微信号">
          <el-input v-model="accountFrom.account"></el-input>
        </el-form-item>
        <el-form-item label="appid">
          <el-input v-model="accountFrom.appId"></el-input>
        </el-form-item>
        <el-form-item label="appSecret">
          <el-input type="textarea" v-model="accountFrom.appSecret"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="accountFromDialog = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="addAccount">添加</el-button>
        <el-button v-else type="primary" @click="updateData">编辑</el-button>
      </div>
    </el-dialog>

  </div>
</template>


<script>
  import {addAccount, bindStore, disableAccount, enableAccount, fetchList, unbindStore} from '@/api/account'
  import {getStoreList} from "@/api/store"

  export default {
    data() {
      return {
        total: '',
        storeTotal: '',
        currentAccount: {},
        currentIndex: -1,
        dataForm: {},
        handleSizeChange: '',
        list: null,
        listLoading: true,
        accountFromDialog: false,
        storeListDialog: false,
        dialogStatus: '',
        textMap: {
          update: 'Update',
          create: 'Create'
        },
        listQuery: {
          pageNo: 1
        },
        storeListQuery: {
          pageNo: 1
        },
        accountFrom: {
          title: '',
          content: 1
        }
      }
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          1: '启用',
          0: '禁用',
        }
        return statusMap[status]
      }
    },
    created() {
      this.fetchData()
      this.getStoreList()
    },
    methods: {
      // 点击绑定店铺的弹出框
      showStoreListDialog(account, index) {
        console.log(account)
        console.log('sdjiohdiahidawhi ')
        this.currentAccount = account
        this.currentIndex = index
        this.storeListDialog = true
      },
      bind(store){
        const data = {
          'id': this.currentAccount.id,
          'storeId': store.id
        }
        bindStore(data).then(response => {
          if (response.code === 200) {
            this.$notify({
              title: '成功',
              message: '绑定成功',
              type: 'success',
              duration: 2000
            })
            this.list.splice(this.currentIndex,1,response.data)
          } else {
            this.$notify({
              title: '绑定失败',
              message: '失败原因: ' + response.message,
              type: 'failure',
              duration: 2000
            })
          }
        })
        this.storeListDialog = false
      },
      unbindStore(account) {
        unbindStore(account.id).then(response => {
          if (response.code === 200) {
            this.$notify({
              title: '成功',
              message: '解绑成功',
              type: 'success',
              duration: 2000
            })
            this.fetchData()
          } else {
            this.$notify({
              title: '解绑失败',
              message: '失败原因: ' + response.message,
              type: 'failure',
              duration: 2000
            })
          }
        })
        this.storeListDialog = false
      },
      fetchData() {
        this.listLoading = true
        fetchList(this.listQuery).then(response => {
          this.list = response.data.list
          this.total = response.data.totalCount
          this.listLoading = false
        })
      },
      resetTemp() {
        this.accountFrom = {
          id: undefined,
          name: null,
          appid: '',
          storeName: '',
          storeId: null
        }
      },
      // 展开创建的对话框
      handleCreate() {
        this.resetTemp()
        this.getStoreList()
        this.dialogStatus = 'create'
        this.accountFromDialog = true
      },
      // 提交数据
      createData() {
        this.accountFromDialog = true
        addAccount(this.accountFrom).then(() => {
          this.accountFromDialog = false
          this.$notify({
            title: '成功',
            message: '添加成功',
            type: 'success',
            duration: 2000
          })
          this.list.unshift(this.accountFrom)
        })
      },
      addAccount() {
        console.log(this.accountFrom)
        console.log('accountFrom')
        addAccount(this.accountFrom).then(() => {
          this.$notify({
            title: '成功',
            message: '添加成功',
            type: 'success',
            duration: 2000
          })
        })
        this.accountFromDialog = false

      },
      getStoreList() {
        this.listLoading = true
        this.store = true
        getStoreList(this.storeListQuery).then(response => {
          this.storeList = response.data.list
          this.storeTotal = response.data.totalCount
          this.listLoading = false
          console.log(response.data.list)
        })
      },
      // 编辑数据
      handleUpdate(row) {
        this.accountFrom = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.accountFromDialog = true
      },
      updateData() {
        const accountFrom = Object.assign({}, this.accountFrom)
        addAccount(accountFrom).then(() => {
          for (const v of this.list) {
            if (v.id === this.accountFrom.id) {
              const index = this.list.indexOf(v)
              this.list.splice(index, 1, this.accountFrom)
              break
            }
          }
          this.accountFromDialog = false
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          })
        })
        // 编辑之后及时刷新topbar的数据
        location.reload()
      },
      handleFilter() {
        this.fetchData()
      },
      resetFilter(){
        location.reload()
      },
      handleStoreFilter() {
        this.getStoreList()
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.listQuery.pageNo = val
        this.fetchData()
      },
      handleStoreCurrentChange(val) {
        this.storeListQuery.pageNo = val
        this.getStoreList()
      },
      // 启用
      enableAccount(row) {
        enableAccount(row.id).then(() => {
          this.$notify({
            title: '成功',
            message: '启用成功',
            type: 'success',
            duration: 2000
          })
          this.fetchData()
        }).catch(err => {
          this.$notify({
            title: '失败',
            message: '启用失败' + err.message,
            type: 'failure',
            duration: 1000
          })
        })
        this.fetchData()
      },
      disableAccount(row) {
        disableAccount(row.id).then(() => {
          this.$notify({
            title: '成功',
            message: '禁用成功',
            type: 'success',
            duration: 2000
          })
          this.fetchData()
        }).catch(err => {
          this.$notify({
            title: '失败',
            message: '禁用失败' + err.message,
            type: 'failure',
            duration: 1000
          })
        })
        // const index = this.list.indexOf(row)
        // this.list.splice(index, 1)
        this.fetchData()
      }
    }
  }
</script>


<style>

</style>
