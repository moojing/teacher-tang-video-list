import { filterVideos, getFilterOptions, sortVideos } from '../lib/video-utils.js'
import FilterBar from './FilterBar.jsx'
import VideoList from './VideoList.jsx'

export default function VideoExplorer({
  videos,
  query,
  activeStatus,
  activeTopic,
  sortBy,
  onQueryChange,
  onStatusSelect,
  onTopicSelect,
  onSortChange,
  onClearFilters,
}) {
  const filterOptions = getFilterOptions(videos)
  const visibleVideos = sortVideos(
    filterVideos(videos, { query, status: activeStatus, topic: activeTopic }),
    sortBy,
  )

  return (
    <main className="video-explorer">
      <FilterBar
        query={query}
        onQueryChange={onQueryChange}
        statuses={filterOptions.statuses}
        activeStatus={activeStatus}
        onStatusSelect={onStatusSelect}
        topics={filterOptions.topics}
        activeTopic={activeTopic}
        onTopicSelect={onTopicSelect}
        sortBy={sortBy}
        onSortChange={onSortChange}
      />
      <VideoList
        videos={visibleVideos}
        query={query}
        activeStatus={activeStatus}
        activeTopic={activeTopic}
        onClearFilters={onClearFilters}
      />
    </main>
  )
}
