import { formatVideoDate } from '../lib/video-utils.js'

export default function VideoItem({ video }) {
  const displayDate = formatVideoDate(video.date) || '日期待補'

  return (
    <li className="video-item">
      <time dateTime={video.date ?? undefined}>{displayDate}</time>
      <article>
        <a href={video.url} target="_blank" rel="noreferrer">{video.title}</a>
        <div className="video-meta">
          <span className="video-status">{video.status}</span>
          <span className="video-topics">{(video.topics ?? []).join('、')}</span>
        </div>
      </article>
    </li>
  )
}
