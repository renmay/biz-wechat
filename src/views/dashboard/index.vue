<template>
  <div class="dashboard-container">
    <span class="dashboard-text">欢迎进入微信后台管理系统</span><br><br>
    <span class="dashboard-text">您当前管理的公众号是: <span class="dashboard-account">{{currentAccount}}</span> </span>

  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {getCurrentAccount} from '@/api/account'

  export default {
    data() {
      return {
        currentAccount: ''
      }
    },
    name: 'dashboard',
    computed: {
      ...mapGetters([
        'name',
        'roles'
      ])
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.listLoading = true
        getCurrentAccount().then(response => {
          this.currentAccount = response.data.name
          this.listLoading = false
        })
      }
    }

  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard {
    &-container {
      margin: 30px;
    }
    &-text {
      padding-right: 20px;
      color: rgb(65, 91, 147);
      font-size: 18px;
    }
    &-account{
      color: #409EFF;
    }
  }
</style>
