<template>
  <div class="app-container">
    <div class="filter-container" style="padding-bottom: 20px;">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="请输入标题"
                v-model="listQuery.name" filterable>
      </el-input>
      <!--<el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="请输入作者"-->
      <!--v-model="listQuery.account" filterable>-->
      <!--</el-input>-->
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <div style="display: inline-block;">

        <generalImage color="#1890ff" @successCBK="imageSuccessCBK"></generalImage>

      </div>
    </div>

    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label='序号' width="95">
        <template slot-scope="scope">
          {{scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column label="标题" width="160" align="center">
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column label="图片路径" align="center">
        <template slot-scope="scope">
          <el-tag>
            <a :href="scope.row.httpUrl" target="_blank"> {{scope.row.httpUrl}}</a>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center">
        <template slot-scope="scope">
          <el-tag>
            {{scope.row.type}}
          </el-tag>
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
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)"><i class="el-icon-delete"></i> 删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </div>
</template>


<script>
  import { addImages, deleteImage, getImageList} from '@/api/image'
  import generalImage from '@/components/generalImage'

  export default {
    components: {generalImage},

    data() {
      return {
        tempUrl: '',
        dataForm: {},
        handleSizeChange: '',
        list: null,
        listLoading: true,
        imageFromDialog: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '添加'
        },
        listQuery: {
          pageNo: 1,
          pageSize: 10
        },
        temp: {
          title: '',
          content: 1
        }
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      imageSuccessCBK(arr) {
        addImages(arr).then(response => {
          this.$notify({
            title: '上传完成',
            message: '共上传'+response.data.total+'张， '+response.data.success+'张成功，'+response.data.failure+'张失败',
            type: 'success',
            duration: 2000
          })
          this.fetchData()
        })
      },
      fetchData() {
        this.listLoading = true
        getImageList(this.listQuery).then(response => {
          this.list = response.data.list
          this.total = response.data.totalCount
          this.listLoading = false
        })
      },
      // 搜索
      handleFilter() {
        this.fetchData()
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.listQuery.pageNo = val
        this.fetchData()
      },
      // 删除列表
      handleDelete(row) {
        deleteImage(row.id).then(() => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        })
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
      }
    }
  }
</script>


<style>

</style>
