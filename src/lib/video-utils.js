const STATUS_ORDER = ['全會員', '小聚落', '會員專屬', '一般公開', '直播中']

function compareLabels(left, right) {
  const leftLabel = typeof left === 'string' ? left : ''
  const rightLabel = typeof right === 'string' ? right : ''
  return leftLabel.localeCompare(rightLabel)
}

function asSearchText(value) {
  return typeof value === 'string' ? value.toLowerCase() : ''
}

function compareDates(left, right, direction) {
  if (left.date === right.date) return 0
  if (left.date === null) return 1
  if (right.date === null) return -1

  const comparison = left.date < right.date ? -1 : 1
  return direction === 'asc' ? comparison : -comparison
}

export function getFilterOptions(videos) {
  const statusCounts = new Map(STATUS_ORDER.map((status) => [status, 0]))
  const topicCounts = new Map()

  for (const video of videos) {
    if (statusCounts.has(video.status)) statusCounts.set(video.status, statusCounts.get(video.status) + 1)

    for (const topic of new Set(video.topics ?? [])) {
      topicCounts.set(topic, (topicCounts.get(topic) ?? 0) + 1)
    }
  }

  return {
    statuses: STATUS_ORDER.map((label) => ({ label, count: statusCounts.get(label) })),
    topics: [...topicCounts]
      .sort(([leftLabel, leftCount], [rightLabel, rightCount]) => rightCount - leftCount || compareLabels(leftLabel, rightLabel))
      .map(([label, count]) => ({ label, count })),
  }
}

export function filterVideos(videos, { query = '', status = null, topic = null } = {}) {
  const normalizedQuery = String(query ?? '').trim().toLowerCase()

  return videos.filter((video) => {
    const matchesQuery = normalizedQuery === ''
      || asSearchText(video.title).includes(normalizedQuery)
      || (video.topics ?? []).some((videoTopic) => asSearchText(videoTopic).includes(normalizedQuery))
    const matchesStatus = !status || video.status === status
    const matchesTopic = !topic || (video.topics ?? []).includes(topic)

    return matchesQuery && matchesStatus && matchesTopic
  })
}

export function sortVideos(videos, sortBy = 'date-desc') {
  const sorted = [...videos]

  if (sortBy === 'date-asc' || sortBy === 'date-desc') {
    return sorted.sort((left, right) => compareDates(left, right, sortBy === 'date-asc' ? 'asc' : 'desc'))
  }

  if (sortBy === 'title-asc' || sortBy === 'title-desc') {
    const direction = sortBy === 'title-asc' ? 1 : -1
    return sorted.sort((left, right) => direction * compareLabels(left.title, right.title))
  }

  return sorted
}

export function formatVideoDate(date) {
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return ''

  const [year, month, day] = date.split('-').map(Number)
  const parsedDate = new Date(Date.UTC(year, month - 1, day))
  if (parsedDate.getUTCFullYear() !== year
    || parsedDate.getUTCMonth() !== month - 1
    || parsedDate.getUTCDate() !== day) {
    return ''
  }

  return date.replaceAll('-', '.')
}
