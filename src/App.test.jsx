import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test } from 'vitest'
import App from './App.jsx'

const fixtureVideos = [
  {
    id: 'alpha',
    title: 'Alpha 占星入門',
    date: '2026-07-10',
    url: 'https://www.youtube.com/watch?v=alpha',
    topics: ['占星'],
    status: '一般公開',
  },
  {
    id: 'beta',
    title: 'Beta 財務問答',
    date: null,
    url: 'https://www.youtube.com/watch?v=beta',
    topics: ['財務'],
    status: '會員專屬',
  },
  {
    id: 'gamma',
    title: 'Gamma 相位研究',
    date: '2026-06-01',
    url: 'https://www.youtube.com/watch?v=gamma',
    topics: ['占星'],
    status: '小聚落',
  },
  {
    id: 'delta',
    title: 'Delta 身心整理',
    date: '2026-05-15',
    url: 'https://www.youtube.com/watch?v=delta',
    topics: ['身心'],
    status: '一般公開',
  },
]

function renderApp() {
  return render(<App videos={fixtureVideos} />)
}

test('orbit center counts videos once when a video has multiple topics', () => {
  const videos = [{ ...fixtureVideos[0], topics: ['占星', '財務'] }]
  render(<App videos={videos} />)

  const orbit = screen.getByRole('region', { name: '熱門主題' }).querySelector('.topic-orbit')
  expect(orbit.querySelector('.orbit-center strong')).toHaveTextContent('1')
})

describe('App', () => {
  test('initial render shows title, result count, and dated video items', () => {
    renderApp()

    expect(screen.getByRole('heading', { name: '師父 LIVE 直播主題索引' })).toBeInTheDocument()
    expect(screen.getByText('找得快一點')).toBeInTheDocument()
    expect(screen.getByText('學得深一點')).toBeInTheDocument()
    expect(screen.getByText('師父這幾年講的直播太多，YouTube 又不好搜，這裡幫妳照主題分好了。省下找的時間，照主題一路學下去，新加入也能一次補齊。')).toBeInTheDocument()
    expect(screen.getByText('共 4 部影片')).toHaveAttribute('aria-live', 'polite')
    expect(screen.getByText('2026.07.10')).toBeInTheDocument()
    expect(screen.getByText('2026.06.01')).toBeInTheDocument()
  })

  test('typing search narrows results by topic', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.type(screen.getByRole('searchbox', { name: '搜尋影片' }), '財務')

    expect(screen.getByText('Beta 財務問答')).toBeInTheDocument()
    expect(screen.queryByText('Alpha 占星入門')).not.toBeInTheDocument()
  })

  test('typing a title substring keeps the matching video and excludes another', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.type(screen.getByRole('searchbox', { name: '搜尋影片' }), '相位研究')

    expect(screen.getByText('Gamma 相位研究')).toBeInTheDocument()
    expect(screen.queryByText('Alpha 占星入門')).not.toBeInTheDocument()
  })

  test('clicking an active status filter clears it', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getByRole('button', { name: '會員專屬 1' }))
    expect(screen.getByText('共 1 部影片')).toBeInTheDocument()
    expect(screen.queryByText('Alpha 占星入門')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '會員專屬 1' }))
    expect(screen.getByText('共 4 部影片')).toBeInTheDocument()
  })

  test('clicking an active topic filter clears it', async () => {
    const user = userEvent.setup()
    renderApp()
    const topicFilters = screen.getByRole('group', { name: '主題' })
    await user.click(within(topicFilters).getByRole('button', { name: '財務 1' }))
    expect(screen.getByText('共 1 部影片')).toBeInTheDocument()
    await user.click(within(topicFilters).getByRole('button', { name: '財務 1' }))
    expect(screen.getByText('共 4 部影片')).toBeInTheDocument()
  })

  test('a long topic list collapses to a subset with a show-all toggle', async () => {
    const user = userEvent.setup()
    const manyTopicVideos = Array.from({ length: 8 }, (_, index) => ({
      id: `topic-${index}`,
      title: `Video ${index}`,
      date: `2026-07-0${index + 1}`,
      url: `https://www.youtube.com/watch?v=topic${index}`,
      topics: [`主題${index}`],
      status: '一般公開',
    }))
    render(<App videos={manyTopicVideos} />)
    const topicFilters = screen.getByRole('group', { name: '主題' })

    // Collapsed: 6 topic chips + the toggle chip.
    expect(within(topicFilters).getAllByRole('button')).toHaveLength(7)
    await user.click(within(topicFilters).getByRole('button', { name: '顯示全部 +2' }))

    // Expanded: all 8 topic chips + the "收合" toggle.
    expect(within(topicFilters).getAllByRole('button')).toHaveLength(9)
    await user.click(within(topicFilters).getByRole('button', { name: '收合' }))
    expect(within(topicFilters).getAllByRole('button')).toHaveLength(7)
  })

  test('sort buttons change the field and direction', async () => {
    const user = userEvent.setup()
    renderApp()

    const sortGroup = screen.getByRole('group', { name: '排序方式' })
    const dateButton = within(sortGroup).getByRole('button', { name: /日期排序/ })
    expect(dateButton).toHaveAccessibleName('日期排序，目前新到舊，點擊切換為舊到新')
    expect(dateButton).toHaveAttribute('aria-pressed', 'true')

    // Clicking the active field toggles its direction (新到舊 -> 舊到新).
    await user.click(dateButton)
    expect(dateButton).toHaveAccessibleName('日期排序，目前舊到新，點擊切換為新到舊')

    const reverseDateItems = screen.getAllByRole('listitem')
    expect(reverseDateItems.map((item) => within(item).getByRole('link').textContent)).toEqual([
      'Delta 身心整理',
      'Gamma 相位研究',
      'Alpha 占星入門',
      'Beta 財務問答',
    ])

    // Clicking the other field switches to it with its default direction (A 到 Z).
    await user.click(within(sortGroup).getByRole('button', { name: /依標題排序/ }))
    expect(within(sortGroup).getByRole('button', { name: /標題排序/ })).toHaveAttribute('aria-pressed', 'true')
    const items = screen.getAllByRole('listitem')
    expect(items.map((item) => within(item).getByRole('link').textContent)).toEqual([
      'Alpha 占星入門',
      'Beta 財務問答',
      'Delta 身心整理',
      'Gamma 相位研究',
    ])
  })

  test('no match shows an empty state', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.type(screen.getByRole('searchbox', { name: '搜尋影片' }), '不存在的影片')

    expect(screen.getByText('找不到符合條件的影片')).toBeInTheDocument()
  })

  test('clicking a topic in the hero orbit applies the topic chip filter', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(within(screen.getByRole('region', { name: '熱門主題' })).getByRole('button', { name: '占星 2' }))

    expect(screen.getByText('共 2 部影片')).toBeInTheDocument()
    expect(screen.getByText('Alpha 占星入門')).toBeInTheDocument()
    expect(screen.queryByText('Beta 財務問答')).not.toBeInTheDocument()
  })

  test('video links expose their URL, new-tab attributes, and a readable null-date fallback', () => {
    renderApp()

    const betaItem = screen.getByText('Beta 財務問答').closest('li')
    const betaLink = within(betaItem).getByRole('link')
    expect(betaLink).toHaveAttribute('href', 'https://www.youtube.com/watch?v=beta')
    expect(betaLink).toHaveAttribute('target', '_blank')
    expect(betaLink).toHaveAttribute('rel', 'noreferrer')
    expect(within(betaItem).getByText('日期待補')).toBeInTheDocument()
    expect(betaItem.querySelector('time')).toHaveTextContent('日期待補')
  })

  test('hero orbit exposes its count and guidance to assistive technology', () => {
    renderApp()

    const orbit = screen.getByRole('region', { name: '熱門主題' }).querySelector('.topic-orbit')
    expect(orbit.querySelector('.orbit-center')).not.toHaveAttribute('aria-hidden', 'true')
    expect(orbit).toHaveTextContent('部直播 · 選一個開始')
  })
})
