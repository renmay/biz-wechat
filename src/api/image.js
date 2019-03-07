import request from '@/utils/request'

export function getImageList(params) {
  return request({
    url: '/pic/list',
    method: 'get',
    params
  })
}

export function addImage(params) {
  return request({
    url: '/pic/add',
    method: 'post',
    params: {'url': params.url, 'fileName': params.fileName}
  })
}

export function addImages(params) {
  return request({
    url: '/pic/images',
    method: 'post',
    params: {'images': JSON.stringify(params)}
  })
}

export function deleteImage(id) {
  return request({
    url: '/pic/delete',
    method: 'post',
    params: {id}
  })
}

