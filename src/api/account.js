import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/mp/account/list',
    method: 'get',
    params: query
  })
}

export function getById(id) {
  return request({
    url: '/article/detail',
    method: 'get',
    params: { id }
  })
}

export function chooseAccount(id) {
  return request({
    url: '/mp/account/bind',
    method: 'post',
    params: { id }
  })
}

export function getCurrentAccount() {
  return request({
    url: '/mp/account/current',
    method: 'get'
  })
}

export function addAccount(params) {
  return request({
    url: '/mp/account/add',
    method: 'post',
    params
  })
}

export function enableAccount(id) {
  return request({
    url: '/mp/account/enable',
    method: 'post',
    params: { id }
  })
}

export function disableAccount(id) {
  return request({
    url: '/mp/account/disable',
    method: 'post',
    params: { id }
  })
}

export function bindStore(params) {
  return request({
    url: '/mp/account/store/bind',
    method: 'post',
    params
  })
}

export function unbindStore(id) {
  return request({
    url: '/mp/account/store/unbind',
    method: 'post',
    params: { id }
  })
}
