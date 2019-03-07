import request from '@/utils/request'

export function getStoreList(params) {
  return request({
    url: 'store/list',
    method: 'get',
    params
  })
}
