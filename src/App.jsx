import { useState } from 'react'
import importedVideos from './data/videos.json'
import { getFilterOptions } from './lib/video-utils.js'
import Footer from './components/Footer.jsx'
import Hero from './components/Hero.jsx'
import VideoExplorer from './components/VideoExplorer.jsx'

export default function App({ videos = importedVideos }) {
  const [query, setQuery] = useState('')
  const [activeStatus, setActiveStatus] = useState(null)
  const [activeTopic, setActiveTopic] = useState(null)
  const [sortBy, setSortBy] = useState('date-desc')
  const topics = getFilterOptions(videos).topics

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
        query={query}
        activeStatus={activeStatus}
        activeTopic={activeTopic}
        sortBy={sortBy}
        onQueryChange={setQuery}
        onStatusSelect={setActiveStatus}
        onTopicSelect={setActiveTopic}
        onSortChange={setSortBy}
      />
      <Footer />
    </div>
  )
}
