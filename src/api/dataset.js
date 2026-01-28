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