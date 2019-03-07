import request from '@/utils/request'
import uploadrequest from '@/utils/uploadRequest'

export function getList(params) {
  return request({
    url: '/msg/news/list',
    method: 'get',
    params
  })
}

export function getNewsList(query) {
  return request({
    url: '/msg/news/list',
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

export function createdoucment(data) {
  return request({
    url: '/mp/doucment/add',
    method: 'post',
    data
  })
}

export function addMulti(params) {
  return request({
    url: '/msg/news/multi/add',
    method: 'post',
    params: {'news': JSON.stringify(params)}
  })
}

export function addSingle(data) {
  return request({
    url: '/msg/news/single/add',
    method: 'post',
    params: data
  })
}

export function upload(data) {
  return uploadrequest({
    url: '/pic/upload',
    method: 'post',
    data
  })
}

export function deleteNews(id) {
  return request({
    url: '/msg/news/delete',
    method: 'post',
    params: { id }
  })
}

