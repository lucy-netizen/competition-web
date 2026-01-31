import request from '@/utils/request'

/**
 * 获取文章详情
 */
export function getArticleDetailApi(id) {
    return request({
        url: `/api/article/detail/${id}`,
        method: 'get'
    })
}

/**
 * 获取文章列表
 */
export function getArticlesApi(params) {
    return request({
        url: '/api/article/list',
        method: 'get',
        params: params
    })
}

/**
 * 获取评论列表
 */
export function getCommentsApi(params) {
    return request({
        url: `/api/comment/list`,
        method: 'get',
        params
    })
}

/**
 * 获取归档列表
 */
export function getArchivesApi() {
    return request({
        url: '/api/article/archive',
        method: 'get'
    })
}

/**
 * 获取分类
 */
export function getCategoriesApi() {
    return request({
        url: '/api/article/categories',
        method: 'get'
    })
}

/**
 * 获取所有分类
 */
export function getAllCategoriesApi() {
    return request({
        url: '/api/article/categorie-all',
        method: 'get'
    })
}

/**
 * 添加评论
 */
export function addCommentApi(data) {
    return request({
        url: '/api/comment/add',
        method: 'post',
        data
    })
}

/**
 * 搜索文章
 */
export function searchArticlesApi(keyword) {
    return request({
        url: '/api/article/search',
        method: 'get',
        params: {
            keyword,
            limit: 10
        }
    })
}

/**
 * 获取轮播文章
 */
export function getCarouselArticlesApi() {
    return request({
        url: '/api/article/getCarousels',
        method: 'get',
    })
}

/**
 * 获取推荐文章
 */
export function getRecommendArticlesApi() {
    return request({
        url: '/api/article/getRecommends',
        method: 'get',
    })
}

/**
 * 点赞接口
 */
export function likeArticleApi(id) {
    return request({
        url: `/api/article/like/${id}`,
        method: 'get'
    })
}

/**
 * ★ 修改：收藏接口
 * 路径修改为 DatasetFrontController 定义的 /api/front/dataset/fav/
 */
export function favArticleApi(id) {
    return request({
        url: `/api/front/dataset/fav/${id}`,
        method: 'get'
    })
}

/**
 * ★ 修改：关注作者接口
 * 路径修改为 DatasetFrontController 定义的 /api/front/dataset/follow/
 */
export function followUserApi(id) {
    return request({
        url: `/api/front/dataset/follow/${id}`,
        method: 'get'
    })
}

/**
 * 获取我的文章
 */
export function getMyArticleApi(params) {
    return request({
        url: '/protal/user/myArticle',
        method: 'get',
        params
    })
}

/**
 * 删除文章
 */
export function delArticleApi(id) {
    return request({
        url: `/sys/article/delete/${id}`,
        method: 'delete'
    })
}

/**
 * 创建文章
 */
export function createArticleApi(data) {
    return request({
        url: '/sys/article/add',
        method: 'post',
        data
    })
}

/**
 * 获取后台文章详情
 */
export function getArticleInfoApi(id) {
    return request({
        url: `/sys/article/detail/${id}`,
        method: 'get'
    })
}

/**
 * 更新文章
 */
export function updateArticleApi(data) {
    return request({
        url: `/sys/article/update`,
        method: 'put',
        data
    })
}

/**
 * 获取科学数据集详情
 */
export function getDatasetDetailApi(id) {
    return request({
        url: `/api/front/dataset/get/${id}`,
        method: 'get'
    })
}

/**
 * ★ 新增：数据集下载量加一接口
 * 路径对应 DatasetFrontController 中的 /api/front/dataset/download/{id}
 */
export function downloadDatasetApi(id) {
    return request({
        url: `/api/front/dataset/download/${id}`,
        method: 'get'
    })
}