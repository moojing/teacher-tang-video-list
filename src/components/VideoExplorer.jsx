import { filterVideos, getFilterOptions, sortVideos } from '../lib/video-utils.js'
import FilterBar from './FilterBar.jsx'
import RecentlyWatchedList from './RecentlyWatchedList.jsx'
import VideoList from './VideoList.jsx'

export default function VideoExplorer({
  videos,
  activeTab,
  query,
  activeStatus,
  activeTopic,
  recentlyWatchedVideos,
  sortBy,
  onTabChange,
  onQueryChange,
  onStatusSelect,
  onTopicSelect,
  onSortChange,
  onVideoOpen,
  onRecentlyWatchedRemove,
  onClearFilters,
}) {
  const filterOptions = getFilterOptions(videos)
  const visibleVideos = sortVideos(
    filterVideos(videos, { query, status: activeStatus, topic: activeTopic }),
    sortBy,
  )

  return (
    <main className="video-explorer">
      <div className="video-tabs" role="tablist" aria-label="影片清單切換">
        <button
          type="button"
          role="tab"
          id="video-tab-all"
          className={activeTab === 'all' ? 'video-tab is-active' : 'video-tab'}
          aria-selected={activeTab === 'all'}
          aria-controls="video-panel"
          onClick={() => onTabChange('all')}
        >
          全部影片
        </button>
        <button
          type="button"
          role="tab"
          id="video-tab-recently-watched"
          className={activeTab === 'recently-watched' ? 'video-tab is-active' : 'video-tab'}
          aria-selected={activeTab === 'recently-watched'}
          aria-controls="video-panel"
          onClick={() => onTabChange('recently-watched')}
        >
          最近看過
        </button>
      </div>
      <div role="tabpanel" id="video-panel" aria-labelledby={activeTab === 'all' ? 'video-tab-all' : 'video-tab-recently-watched'}>
        {activeTab === 'all' ? (
          <>
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
              onVideoOpen={onVideoOpen}
              onClearFilters={onClearFilters}
            />
          </>
        ) : (
          <RecentlyWatchedList
            videos={recentlyWatchedVideos}
            onVideoOpen={onVideoOpen}
            onVideoRemove={onRecentlyWatchedRemove}
          />
        )}
      </div>
    </main>
  )
}
