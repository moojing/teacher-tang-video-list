const SORT_FIELDS = {
  date: {
    label: '日期',
    defaultDirection: 'desc',
    directions: { asc: '舊到新', desc: '新到舊' },
  },
  title: {
    label: '標題',
    defaultDirection: 'asc',
    directions: { asc: 'A 到 Z', desc: 'Z 到 A' },
  },
}

const FIELD_ORDER = ['date', 'title']

function getSortState(sortBy) {
  const field = sortBy.startsWith('title-') ? 'title' : 'date'
  const direction = sortBy.endsWith('-asc') ? 'asc' : 'desc'
  return { field, direction }
}

export default function SortControl({ sortBy, onSortChange }) {
  const active = getSortState(sortBy)

  return (
    <div className="sort-control">
      <span>排序方式</span>
      <div className="filter-options" role="group" aria-label="排序方式">
        {FIELD_ORDER.map((field) => {
          const config = SORT_FIELDS[field]
          const isActive = active.field === field
          const direction = isActive ? active.direction : config.defaultDirection
          const nextDirection = direction === 'asc' ? 'desc' : 'asc'
          const directionLabel = config.directions[direction]
          const nextDirectionLabel = config.directions[nextDirection]

          const nextSort = isActive
            ? `${field}-${nextDirection}`
            : `${field}-${config.defaultDirection}`
          const ariaLabel = isActive
            ? `${config.label}排序，目前${directionLabel}，點擊切換為${nextDirectionLabel}`
            : `依${config.label}排序（${directionLabel}）`

          return (
            <button
              key={field}
              type="button"
              className={`filter-button sort-button${isActive ? ' is-active' : ''}`}
              aria-pressed={isActive}
              aria-label={ariaLabel}
              onClick={() => onSortChange(nextSort)}
            >
              {config.label}
              <span className="sort-direction-arrow" aria-hidden="true">
                {direction === 'asc' ? '↑' : '↓'}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
