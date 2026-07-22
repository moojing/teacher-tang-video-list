import { useState } from 'react'

const COLLAPSED_COUNT = 6

export default function TopicFilters({ options, activeTopic, onTopicSelect }) {
  const [expanded, setExpanded] = useState(false)
  const canCollapse = options.length > COLLAPSED_COUNT
  const visibleOptions = expanded || !canCollapse
    ? options
    : options.filter((option, index) => index < COLLAPSED_COUNT || option.label === activeTopic)
  const hiddenCount = options.length - visibleOptions.length

  return (
    <fieldset className="topic-filters">
      <legend>主題</legend>
      <div className="filter-options">
        {visibleOptions.map(({ label, count }) => (
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
      {canCollapse && (
        <button
          type="button"
          className="filter-toggle"
          aria-expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
        >
          <span>{expanded ? '收合' : `顯示全部 +${hiddenCount}`}</span>
          <span className="filter-toggle-arrow" aria-hidden="true">{expanded ? '↑' : '↓'}</span>
        </button>
      )}
    </fieldset>
  )
}
