export default function SearchField({ query, onQueryChange }) {
  return (
    <label className="search-field">
      <span>搜尋影片</span>
      <input
        type="search"
        aria-label="搜尋影片"
        placeholder="搜尋標題或主題"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
      />
    </label>
  )
}
