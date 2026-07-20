import SearchField from './SearchField.jsx'
import SortControl from './SortControl.jsx'
import StatusFilters from './StatusFilters.jsx'
import TopicFilters from './TopicFilters.jsx'

export default function FilterBar({
  query,
  onQueryChange,
  statuses,
  activeStatus,
  onStatusSelect,
  topics,
  activeTopic,
  onTopicSelect,
  sortBy,
  onSortChange,
}) {
  return (
    <section className="filter-bar" aria-label="影片篩選工具">
      <SearchField query={query} onQueryChange={onQueryChange} />
      <StatusFilters options={statuses} activeStatus={activeStatus} onStatusSelect={onStatusSelect} />
      <TopicFilters options={topics} activeTopic={activeTopic} onTopicSelect={onTopicSelect} />
      <SortControl sortBy={sortBy} onSortChange={onSortChange} />
    </section>
  )
}
