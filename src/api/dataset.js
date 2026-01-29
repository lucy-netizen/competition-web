import request from '@/utils/request'

/**
 * 获取科学数据集列表
 */
export function getDatasetsApi(params) {
    return request({
        url: '/api/front/dataset/list',
        method: 'get',
        params
    })
}

/**
 * 获取单个科学数据详情 (新增)
 */
export function getDatasetDetailApi(id) {
    return request({
        url: '/api/front/dataset/get/' + id,
        method: 'get'
    })
}