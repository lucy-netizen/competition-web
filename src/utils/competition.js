export function getResponseData(res, fallback = []) {
  if (!res) return fallback
  if (res.code === 200) return res.data ?? fallback
  if (res.data && res.data.code === 200) return res.data.data ?? fallback
  return fallback
}

export function isSuccess(res) {
  return res && (res.code === 200 || (res.data && res.data.code === 200))
}

export function getCurrentCompetitionUser() {
  const raw = sessionStorage.getItem('user') || localStorage.getItem('userInfo')
  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch (err) {
    return null
  }
}

export function getCurrentUserId(defaultId = 1) {
  const user = getCurrentCompetitionUser()
  return user?.userId || user?.id || defaultId
}

export function formatDateTime(value, onlyDate = true) {
  if (!value) return ''
  return onlyDate ? String(value).split(' ')[0] : value
}

export function downloadTextFile(filename, content) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}
