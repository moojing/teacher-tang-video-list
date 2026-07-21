import TopicOrbit from './TopicOrbit.jsx'

export default function Hero({ topics, totalVideos, activeTopic, onTopicSelect }) {
  return (
    <header className="hero">
      <h1>師父 LIVE 直播主題索引</h1>
      <p className="hero-tagline" aria-label="使用索引的好處">
        <strong>找得快一點</strong>
        <em>學得深一點</em>
      </p>
      <p className="hero-description">
        師父這幾年講的直播太多，YouTube 又不好搜，這裡幫妳照主題分好了。省下找的時間，照主題一路學下去，新加入也能一次補齊。
      </p>
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
