import { getAuth, login } from '@/api/login'
import { setUsername, removeUsername, getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    auth: '',
    name: '',
    avatar: '',
    roles: []
  },

  mutations: {

    SET_TOKEN: (state, auth) => {
      state.auth = auth
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const loginName = userInfo.loginName.trim()
      return new Promise((resolve, reject) => {
        login(loginName, userInfo.password).then(response => {
          const data = response.data
          commit('SET_ROLES', data.type)
          commit('SET_NAME', data.username)
          setUsername(data.username)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取授权信息
    GetAuth({ commit }) {
      return new Promise((resolve, reject) => {
        getAuth().then(data => {
          commit('SET_TOKEN', data.data.authorization)
          setToken(data.data.authorization)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        removeUsername()
        resolve()
      })
    }
  }
}

export default user
