import request from '@/utils/request'

export function getAuth() {
  return request({
    url: '/authorization',
    method: 'get'
  })
}

export function login(loginName, password) {
  return request({
    url: '/login',
    method: 'post',
    params: {
      loginName,
      password
    }
  })
}

export function getUserInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

