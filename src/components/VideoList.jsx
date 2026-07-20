import VideoItem from './VideoItem.jsx'

export default function VideoList({ videos }) {
  return (
    <section className="video-results" aria-label="影片結果">
      <p className="result-count" aria-live="polite">共 {videos.length} 部影片</p>
      {videos.length > 0 ? (
        <ul className="video-list">
          {videos.map((video) => <VideoItem key={video.id} video={video} />)}
        </ul>
      ) : (
        <p className="empty-state" aria-live="polite">找不到符合條件的影片</p>
      )}
    </section>
  )
}
