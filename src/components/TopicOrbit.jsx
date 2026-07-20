const MAX_ORBIT_TOPICS = 8

export default function TopicOrbit({ topics, totalVideos, activeTopic, onTopicSelect }) {
  const orbitTopics = topics.slice(0, MAX_ORBIT_TOPICS)

  return (
    <div className="topic-orbit">
      <span className="orbit-ring orbit-ring--outer" aria-hidden="true" />
      <span className="orbit-ring orbit-ring--middle" aria-hidden="true" />
      <span className="orbit-ring orbit-ring--inner" aria-hidden="true" />
      <span className="orbit-ring orbit-ring--core" aria-hidden="true" />
      <span className="orbit-center">
        <strong>{totalVideos}</strong>
        <small>部直播 · 選一個開始</small>
      </span>
      {orbitTopics.map(({ label, count }, index) => (
        <button
          type="button"
          className={activeTopic === label ? 'topic-orbit-button is-active' : 'topic-orbit-button'}
          data-orbit-index={index + 1}
          aria-pressed={activeTopic === label}
          key={label}
          onClick={() => onTopicSelect(activeTopic === label ? null : label)}
        >
          {label} {count}
        </button>
      ))}
    </div>
  )
}
