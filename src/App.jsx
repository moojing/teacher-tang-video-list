import { useEffect, useState } from 'react'
import importedVideos from './data/videos.json'
import {
  readRecentlyWatchedIds,
  recordRecentlyWatched,
  removeRecentlyWatched,
  writeRecentlyWatchedIds,
} from './lib/recently-watched.js'
import { getFilterOptions } from './lib/video-utils.js'
import Footer from './components/Footer.jsx'
import Hero from './components/Hero.jsx'
import VideoExplorer from './components/VideoExplorer.jsx'

export default function App({ videos = importedVideos }) {
  const [activeTab, setActiveTab] = useState('all')
  const [query, setQuery] = useState('')
  const [activeStatus, setActiveStatus] = useState(null)
  const [activeTopic, setActiveTopic] = useState(null)
  const [sortBy, setSortBy] = useState('date-desc')
  const [recentlyWatchedIds, setRecentlyWatchedIds] = useState(() => readRecentlyWatchedIds())
  const topics = getFilterOptions(videos).topics
  const videosById = Object.fromEntries(videos.map((video) => [video.id, video]))
  const recentlyWatchedVideos = recentlyWatchedIds
    .map((videoId) => videosById[videoId])
    .filter(Boolean)

  useEffect(() => {
    writeRecentlyWatchedIds(recentlyWatchedIds)
  }, [recentlyWatchedIds])

  useEffect(() => {
    setRecentlyWatchedIds((currentIds) => {
      const nextIds = currentIds.filter((videoId) => videosById[videoId])
      return nextIds.length === currentIds.length ? currentIds : nextIds
    })
  }, [videos])

  const handleClearFilters = () => {
    setQuery('')
    setActiveStatus(null)
    setActiveTopic(null)
  }

  const handleVideoOpen = (videoId) => {
    setRecentlyWatchedIds((currentIds) => recordRecentlyWatched(currentIds, videoId))
  }

  const handleRecentlyWatchedRemove = (videoId) => {
    setRecentlyWatchedIds((currentIds) => removeRecentlyWatched(currentIds, videoId))
  }

  return (
    <div className="app-shell">
      <Hero
        topics={topics}
        totalVideos={videos.length}
        activeTopic={activeTopic}
        onTopicSelect={setActiveTopic}
      />
      <VideoExplorer
        videos={videos}
        activeTab={activeTab}
        query={query}
        activeStatus={activeStatus}
        activeTopic={activeTopic}
        recentlyWatchedVideos={recentlyWatchedVideos}
        sortBy={sortBy}
        onTabChange={setActiveTab}
        onQueryChange={setQuery}
        onStatusSelect={setActiveStatus}
        onTopicSelect={setActiveTopic}
        onSortChange={setSortBy}
        onVideoOpen={handleVideoOpen}
        onRecentlyWatchedRemove={handleRecentlyWatchedRemove}
        onClearFilters={handleClearFilters}
      />
      <Footer />
    </div>
  )
}
