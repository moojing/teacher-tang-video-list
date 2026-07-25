import VideoItem from './VideoItem.jsx'

export default function RecentlyWatchedList({ videos, onVideoOpen, onVideoRemove }) {
  return (
    <section className="video-results" aria-label="最近看過">
      <p className="result-count" aria-live="polite">最近看過 {videos.length} 部影片</p>
      {videos.length > 0 ? (
        <ul className="video-list">
          {videos.map((video) => (
            <VideoItem
              key={video.id}
              video={video}
              onOpen={onVideoOpen}
              action={(
                <button
                  type="button"
                  className="video-item-action"
                  aria-label={`標示「${video.title}」為已看完並移除`}
                  onClick={() => onVideoRemove(video.id)}
                >
                  已看完
                </button>
              )}
            />
          ))}
        </ul>
      ) : (
        <div className="empty-state" aria-live="polite">
          <p className="empty-state-title">最近還沒有看過任何影片</p>
          <p className="empty-state-description">點開一部影片後，這裡會記住妳最近看過的順序。</p>
        </div>
      )}
    </section>
  )
}
