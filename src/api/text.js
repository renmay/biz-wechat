import request from '@/utils/request'

export function getTextList(params) {
  return request({
    url: '/msg/text/list',
    method: 'get',
    params
  })
}

export function addText(params) {
  return request({
    url: '/msg/text/add',
    method: 'post',
    params
  })
}

export function deleteText(id) {
  return request({
    url: '/msg/text/delete',
    method: 'post',
    params: { id }
  })
}

