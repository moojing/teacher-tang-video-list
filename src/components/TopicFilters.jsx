export default function TopicFilters({ options, activeTopic, onTopicSelect }) {
  return (
    <fieldset className="topic-filters">
      <legend>主題</legend>
      <div className="filter-options">
        {options.map(({ label, count }) => (
          <button
            type="button"
            className={activeTopic === label ? 'filter-button is-active' : 'filter-button'}
            aria-pressed={activeTopic === label}
            key={label}
            onClick={() => onTopicSelect(activeTopic === label ? null : label)}
          >
            {label} {count}
          </button>
        ))}
      </div>
    </fieldset>
  )
}
