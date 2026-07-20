import { describe, expect, it } from 'vitest'
import videos from '../data/videos.json'
import {
  filterVideos,
  formatVideoDate,
  getFilterOptions,
  sortVideos,
} from './video-utils.js'

const EXPECTED_KEYS = ['date', 'id', 'status', 'title', 'topics', 'url']
const YOUTUBE_HOSTS = new Set(['youtube.com', 'www.youtube.com', 'youtu.be', 'www.youtu.be'])

function isCalendarValidIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false

  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))

  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day
}

function isYouTubeUrl(value) {
  if (typeof value !== 'string' || value.trim() === '') return false

  try {
    const url = new URL(value)
    return (url.protocol === 'http:' || url.protocol === 'https:')
      && YOUTUBE_HOSTS.has(url.hostname.toLowerCase())
  } catch {
    return false
  }
}

describe('video dataset format', () => {
  it('contains a non-empty normalized dataset with valid records', () => {
    expect(videos.length).toBeGreaterThan(0)
    expect(new Set(videos.map(({ id }) => id)).size).toBe(videos.length)

    for (const video of videos) {
      expect(Object.keys(video).sort()).toEqual(EXPECTED_KEYS)
      expect(typeof video.id).toBe('string')
      expect(video.id.trim()).not.toBe('')
      expect(typeof video.title).toBe('string')
      expect(video.title.trim()).not.toBe('')
      expect(typeof video.status).toBe('string')
      expect(video.status.trim()).not.toBe('')
      expect(Array.isArray(video.topics)).toBe(true)
      expect(video.topics.length).toBeGreaterThan(0)
      expect(video.topics.every((topic) => typeof topic === 'string' && topic.trim() !== '')).toBe(true)
      expect(isYouTubeUrl(video.url)).toBe(true)
      expect(video.date === null || isCalendarValidIsoDate(video.date)).toBe(true)
    }
  })
})

const fixtureVideos = [
  {
    id: 'one',
    title: 'Alpha Signals',
    date: '2024-03-02',
    topics: ['Finance'],
    status: '全會員',
  },
  {
    id: 'two',
    title: 'Beta Lessons',
    date: '2025-01-15',
    topics: ['Astrology'],
    status: '小聚落',
  },
  {
    id: 'three',
    title: 'Gamma Finance',
    date: null,
    topics: ['Finance'],
    status: '小聚落',
  },
  {
    id: 'four',
    title: 'Delta Signals',
    date: '2023-12-20',
    topics: ['Astrology'],
    status: '全會員',
  },
]

describe('video data utilities', () => {
  it('trims and case-folds search queries across titles and topics', () => {
    expect(filterVideos(fixtureVideos, { query: '  ALPHA  ' }).map(({ id }) => id)).toEqual(['one'])
    expect(filterVideos(fixtureVideos, { query: '  finance  ' }).map(({ id }) => id)).toEqual(['one', 'three'])
  })

  it('treats null and non-string title or topic values as empty text', () => {
    const malformedTextVideo = { id: 'malformed', title: null, topics: [null, 42] }

    expect(() => filterVideos([malformedTextVideo], { query: 'missing' })).not.toThrow()
    expect(filterVideos([malformedTextVideo], { query: 'missing' })).toEqual([])
  })

  it('combines status and topic filters with search using AND semantics', () => {
    expect(filterVideos(fixtureVideos, {
      query: 'signals',
      status: '全會員',
      topic: 'Finance',
    }).map(({ id }) => id)).toEqual(['one'])
    expect(filterVideos(fixtureVideos, {
      query: 'signals',
      status: '小聚落',
      topic: 'Finance',
    })).toEqual([])
  })

  it('sorts by date and title in both directions', () => {
    expect(sortVideos(fixtureVideos, 'date-desc').map(({ id }) => id)).toEqual(['two', 'one', 'four', 'three'])
    expect(sortVideos(fixtureVideos, 'date-asc').map(({ id }) => id)).toEqual(['four', 'one', 'two', 'three'])
    expect(sortVideos(fixtureVideos, 'title-asc').map(({ id }) => id)).toEqual(['one', 'two', 'four', 'three'])
    expect(sortVideos(fixtureVideos, 'title-desc').map(({ id }) => id)).toEqual(['three', 'four', 'two', 'one'])
  })

  it('uses an empty title fallback when sorting missing or non-string titles', () => {
    const input = [
      { id: 'text', title: 'Beta', date: null },
      { id: 'missing', title: null, date: null },
      { id: 'number', title: 42, date: null },
    ]

    expect(sortVideos(input, 'title-asc').map(({ id }) => id)).toEqual(['missing', 'number', 'text'])
  })

  it('does not mutate the input array when filtering or sorting', () => {
    const filterInput = fixtureVideos.slice()
    const sortInput = fixtureVideos.slice()

    filterVideos(filterInput, { query: 'finance' })
    sortVideos(sortInput, 'date-asc')

    expect(filterInput).toEqual(fixtureVideos)
    expect(sortInput).toEqual(fixtureVideos)
  })

  it('keeps null dates after dated items in both date orders', () => {
    expect(sortVideos(fixtureVideos, 'date-desc').at(-1).date).toBeNull()
    expect(sortVideos(fixtureVideos, 'date-asc').at(-1).date).toBeNull()
  })

  it('formats null dates as empty and ISO dates as YYYY.MM.DD', () => {
    expect(formatVideoDate(null)).toBe('')
    expect(formatVideoDate('2025-01-15')).toBe('2025.01.15')
    expect(formatVideoDate('2025-02-31')).toBe('')
    expect(formatVideoDate('not-a-date')).toBe('')
  })

  it('returns deterministic global status and topic counts without mutating input', () => {
    const input = fixtureVideos.slice()
    const options = getFilterOptions(input)

    expect(options.statuses).toEqual([
      { label: '全會員', count: 2 },
      { label: '小聚落', count: 2 },
      { label: '會員專屬', count: 0 },
      { label: '一般公開', count: 0 },
      { label: '直播中', count: 0 },
    ])
    expect(options.topics).toEqual([
      { label: 'Astrology', count: 2 },
      { label: 'Finance', count: 2 },
    ])

    const unequalTopicOptions = getFilterOptions([
      ...fixtureVideos,
      { ...fixtureVideos[0], id: 'five', topics: ['Finance'] },
    ])
    expect(unequalTopicOptions.topics[0]).toEqual({ label: 'Finance', count: 3 })
    expect(input).toEqual(fixtureVideos)
    expect(options.statuses).not.toBe(input)
  })

  it('counts a repeated topic only once per video', () => {
    const options = getFilterOptions([
      { id: 'one', status: '全會員', topics: ['Finance', 'Finance'] },
      { id: 'two', status: '小聚落', topics: ['Finance'] },
    ])

    expect(options.topics).toEqual([{ label: 'Finance', count: 2 }])
  })
})
