import request from '@/utils/request'

function getLocalUser() {
    const raw = sessionStorage.getItem('user') || localStorage.getItem('userInfo')
    if (!raw) return {}
    try {
        return JSON.parse(raw)
    } catch (err) {
        return {}
    }
}

function success(data) {
    return Promise.resolve({
        code: 200,
        message: 'success',
        data
    })
}

/**
 * 获取用户信息的API函数
 */
export function getUserInfoApi() {
    return request({
        url: '/sys/user/profile',
        method: 'get'
    })
}

/**
 * 修改用户信息
 * @param {*} data 
 * @returns 
 */
export function updateProfileApi(data) {
    const nextUser = {
        ...getLocalUser(),
        ...data
    }
    localStorage.setItem('userInfo', JSON.stringify(nextUser))
    sessionStorage.setItem('user', JSON.stringify(nextUser))
    return success(nextUser)
}

/**
 * 修改密码
 */
export function updatePasswordApi(data) {
    return request({
        url: '/sys/user/updatePwd',
        method: 'put',
        data
    })
}

/**
 * 获取我的评论
 */
export function getMyCommentApi(params) {
    return success({ records: [], total: 0 })
}

/**
 * 删除我的评论
 */
export function delMyCommentApi(id) {
    return success(true)
}

/**
 * 获取我的回复
 */
export function getMyReplyApi(params) {
    return success({ records: [], total: 0 })
}

/**
 * 获取我的点赞
 */
export function getMyLikeApi(params) {
    return success({ records: [], total: 0 })
}

/**
 * 获取我的反馈
 */
export function getMyFeedbackApi(params) {
    return request({
        url: '/sys/feedback/list',
        method: 'get',
        params
    })
}

/**
 * 添加反馈
 */
export function addFeedbackApi(data) {
    return request({
        url: '/sys/feedback/add',
        method: 'post',
        data
    })
}

/**
 * 签到
 */
export function signInApi() {
    return success({ signed: true })
}

/**
 * 获取签到状态
 */
export function getSignInStatusApi() {
    return success(false)
}

/**
 * 获取签到统计
 */
export function getSignInStatsApi() {
    return success({ signDays: 0, continuousDays: 0 })
}


