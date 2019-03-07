<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="16">
        <div class="grid-content bg-purple">
          <el-form ref="form" :model="form" label-width="120px">
            <el-form-item label="公众号">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="微信号">
              <el-input v-model="form.account"></el-input>
            </el-form-item>
            <el-form-item label="绑定店铺">
              <el-col :span="12">
                <!--<el-button type="primary" size="mini" @click="dialogFormVisible = true" v-model="form.storeName">选择店铺-->
                <!--</el-button>-->
              </el-col>
              <el-col :span="12">
                <el-input type="primary" v-model="form.storeName" disabled
                          width="120"></el-input>
              </el-col>
            </el-form-item>

            <el-form-item label="appId">
              <el-input v-model="form.appId"></el-input>
            </el-form-item>
            <el-form-item label="appSecret">
              <el-input v-model="form.appSecret"></el-input>
            </el-form-item>
            <!--<el-form-item label="自动回复数量">-->
              <!--<el-select v-model="form.msgCount" clearable placeholder="请选择自动回复数量">-->
                <!--<el-option-->
                  <!--v-for="item in options"-->
                  <!--:key="item.value"-->
                  <!--:label="item.label"-->
                  <!--:value="item.value">-->
                <!--</el-option>-->
              <!--</el-select>-->
            <!--</el-form-item>-->
            <el-form-item label="创建时间" v-show="isAccount">
              <el-col :span="11">
                <el-date-picker type="date" placeholder="创建时间" v-model="form.date"
                                style="width: 100%;"></el-date-picker>
              </el-col>
            </el-form-item>

            <el-form-item label="url">
              <el-input v-model="form.url" disabled></el-input>
            </el-form-item>
            <el-form-item label="Token">
              <el-input v-model="form.token" disabled></el-input>
            </el-form-item>
            <!--<el-form-item label="状态">-->
              <!--<el-switch-->
                <!--v-model="form.status"-->
                <!--active-text="启用" active-value="1"-->
                <!--inactive-text="禁用" inactive-value="0">-->
              <!--</el-switch>-->
            <!--</el-form-item>-->

            <el-form-item>
              <el-button @click="onCancel">取消</el-button>
              <el-button type="primary" @click="addAccount()">编辑</el-button>
            </el-form-item>
          </el-form>
        </div>

        <el-dialog title="选择店铺" :visible.sync="dialogFormVisible" width="60%">
          <div class="app-container">
            <div class="filter-container" style="padding-bottom: 20px;">
              <el-input style="width: 200px;" class="filter-item">
              </el-input>
              <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索
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
                  <el-button size="mini" type="primary" @click="getStoreId(scope.row)">绑定</el-button>
                </template>
              </el-table-column>
            </el-table>

            <!--分页-->
            <div class="pagination-container">
              <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                             :current-page="1" :page-sizes="[10,20,30, 50]" :page-size="10"
                             layout="total, sizes, prev, pager, next, jumper" :total="total">
              </el-pagination>
            </div>
          </div>
        </el-dialog>


      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <img class="img_qr" :src="img_qr" alt="img_qr">
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import img_wechat from '@/assets/news/wechat.png'
  import { addAccount, getCurrentAccount } from '@/api/account'
  import { getStoreList } from "@/api/store"

  export default {
    data() {
      return {
        hasStoreId: false,
        dialogFormVisible: false,
        isAccount: false,
        form: {},
        img_wechat,
        img_qr: 'https://open.weixin.qq.com/qr/code?username=',
        options: [{
          value: '1',
          label: '1'
        }, {
          value: '2',
          label: '2'
        }, {
          value: '3',
          label: '3'
        }, {
          value: '4',
          label: '4'
        }, {
          value: '5',
          label: '5'
        }],
        msgCount: ''
      }
    },
    // 一创建就执行以下方法
    created() {
      this.fetchData()
    },
    methods: {
      // 回显所选公众号的info数据(其中图片是从微信那儿拿的，没有就说嘛这个公众号没有被注册)
      fetchData() {
        getCurrentAccount().then(response => {
          this.form = response.data
          this.img_qr = this.img_qr + response.data.account
        })
      },
      onSubmit() {
        this.$message('submit!')
      },
      onCancel() {
        this.$message({
          message: 'cancel!',
          type: 'warning'
        })
      },
      // 获取店铺列表（由于直接获取店铺的情况下第二次才能刷新出数据， 所以采用一刷新界面就获取店铺列表的方法，即created构造方法）
      getStoreList() {
        this.listLoading = true
        getStoreList(this.listQuery).then(response => {
          this.storeList = response.data.list
          this.total = response.data.totalCount
          this.listLoading = false
          console.log(response.data.list)
        })
      },
      // 然后在getStoreId里面显示数据
      getStoreId(store) {
        console.log(store)
        this.form.storeId = store.id
        this.form.storeName = store.name
        this.dialogFormVisible = false
        this.hasStoreId = true
      },
      // 添加account
      addAccount() {
        console.log(this.form)
        addAccount(this.form).then(() => {
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          })
        })
        location.reload()
      }

    }
  }
</script>

<style scoped>
  .line {
    text-align: center;
  }

  .img_qr {
    margin-left: 100px;
    width: 200px;
    height: 200px;
  }
</style>

