import VideoItem from './VideoItem.jsx'

function describeFilters({ query, activeStatus, activeTopic }) {
  return [
    query.trim() && `搜尋「${query.trim()}」`,
    activeStatus && `會員狀態「${activeStatus}」`,
    activeTopic && `主題「${activeTopic}」`,
  ].filter(Boolean)
}

export default function VideoList({
  videos,
  query = '',
  activeStatus = null,
  activeTopic = null,
  onClearFilters,
}) {
  const activeFilters = describeFilters({ query, activeStatus, activeTopic })

  return (
    <section className="video-results" aria-label="影片結果">
      <p className="result-count" aria-live="polite">共 {videos.length} 部影片</p>
      {videos.length > 0 ? (
        <ul className="video-list">
          {videos.map((video) => <VideoItem key={video.id} video={video} />)}
        </ul>
      ) : (
        <div className="empty-state" aria-live="polite">
          <p className="empty-state-title">找不到符合條件的影片</p>
          {activeFilters.length > 0 && (
            <>
              <p className="empty-state-filters">目前條件：{activeFilters.join('・')}</p>
              <button type="button" className="empty-state-clear" onClick={onClearFilters}>
                清除全部篩選
              </button>
            </>
          )}
        </div>
      )}
    </section>
  )
}
