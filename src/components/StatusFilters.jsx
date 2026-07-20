export default function StatusFilters({ options, activeStatus, onStatusSelect }) {
  return (
    <fieldset className="status-filters">
      <legend>會員狀態</legend>
      <div className="filter-options">
        {options.map(({ label, count }) => (
          <button
            type="button"
            className={activeStatus === label ? 'filter-button is-active' : 'filter-button'}
            aria-pressed={activeStatus === label}
            key={label}
            onClick={() => onStatusSelect(activeStatus === label ? null : label)}
          >
            {label} {count}
          </button>
        ))}
      </div>
    </fieldset>
  )
}
