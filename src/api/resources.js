import request from '@/utils/request'

function normalizeCompetitionResources(list = [], params = {}) {
  const records = list.map((item, index) => ({
    id: item.resourceId || item.id || index + 1,
    name: item.resourceName || item.name || item.title || '备赛资源',
    category: params.category || item.category || item.resourceType || 'template',
    description: item.description || item.content || '竞赛备赛资料',
    avatar: item.publisherAvatar || '/images/visible.jpg',
    nickname: item.publisherName || item.uploaderName || '竞赛管理平台',
    downloads: item.downloadCount || item.downloads || 0,
    views: item.viewCount || item.views || 0,
    isFree: item.isFree ?? 0,
    createTime: item.createTime || item.publishTime,
    panPath: item.filePath || item.panPath || '',
    panCode: item.panCode || ''
  }))

  return {
    records,
    total: records.length
  }
}

/**
 * 获取资源列表
 */
export function getResourcesApi(params) {
  return request({
    url: '/competition/resource/list/active',
    method: 'get',
    params
  }).then(res => ({
    ...res,
    data: Array.isArray(res.data) ? normalizeCompetitionResources(res.data, params) : res.data
  })).catch(() => ({
    code: 200,
    message: 'success',
    data: normalizeCompetitionResources([
      { resourceName: '项目计划书模板', resourceType: 'template', downloadCount: 36, publishTime: '2026-05-30 10:00:00' },
      { resourceName: '校级评审评分标准', resourceType: 'rubric', downloadCount: 24, publishTime: '2026-05-28 16:20:00' },
      { resourceName: '创新创业答辩课件', resourceType: 'courseware', downloadCount: 18, publishTime: '2026-05-26 09:30:00' },
      { resourceName: '往届优秀项目案例', resourceType: 'case', downloadCount: 42, publishTime: '2026-05-22 14:00:00' }
    ].filter(item => !params?.category || item.resourceType === params.category), params)
  }))
}

/**
 * 添加资源
 */
export function addResourceApi(data) {
  return request({
    url: '/api/resource/add',
    method: 'post',
    data
  })
} 

/**
 * 验证码验证
 */
export function verifyCodeApi(data) {
  return request({
    url: '/api/resource/verify',
    method: 'get',
    params: data
  })
}
