import TopicOrbit from './TopicOrbit.jsx'

export default function Hero({ topics, totalVideos, activeTopic, onTopicSelect }) {
  return (
    <header className="hero">
      <p className="hero-eyebrow">TEACHER TANG VIDEO INDEX</p>
      <h1>唐師父直播主題索引</h1>
      <p className="hero-description">依主題、會員狀態與日期整理直播內容。</p>
      <section className="hero-topics" aria-label="熱門主題">
        <h2>熱門主題</h2>
        <TopicOrbit
          topics={topics}
          totalVideos={totalVideos}
          activeTopic={activeTopic}
          onTopicSelect={onTopicSelect}
        />
      </section>
    </header>
  )
}
