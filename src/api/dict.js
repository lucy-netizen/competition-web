import request from '@/utils/request'

const FALLBACK_DICTS = {
  sys_resource_category: [
    { id: 1, label: '竞赛模板', value: 'template', remark: 'file' },
    { id: 2, label: '培训课件', value: 'courseware', remark: 'book' },
    { id: 3, label: '评分标准', value: 'rubric', remark: 'chart' },
    { id: 4, label: '往届案例', value: 'case', remark: 'folder' }
  ],
  article_status: [
    { id: 1, label: '草稿', value: '0' },
    { id: 2, label: '审核', value: '1' }
  ]
}

function normalizeDictType(dictType) {
  return Array.isArray(dictType) ? dictType[0] : dictType
}

/**
 * 获取字典数据
 */
export function getDictDataApi(dictType) {
  const normalizedType = normalizeDictType(dictType)
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: FALLBACK_DICTS[normalizedType] || []
  })
}
