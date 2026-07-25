export const RECENTLY_WATCHED_STORAGE_KEY = 'teacher-tang-recently-watched'

function getStorage() {
  // Accessing window.localStorage can throw (e.g. SecurityError) in restricted
  // contexts like sandboxed iframes, so treat any failure as "unavailable".
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null
    }

    return window.localStorage
  } catch {
    return null
  }
}

function normalizeRecentlyWatchedIds(value) {
  if (!Array.isArray(value)) {
    return []
  }

  const seen = new Set()

  return value.filter((item) => {
    if (typeof item !== 'string' || item.length === 0 || seen.has(item)) {
      return false
    }

    seen.add(item)
    return true
  })
}

export function readRecentlyWatchedIds() {
  const storage = getStorage()

  if (!storage) {
    return []
  }

  try {
    const rawValue = storage.getItem(RECENTLY_WATCHED_STORAGE_KEY)

    if (!rawValue) {
      return []
    }

    return normalizeRecentlyWatchedIds(JSON.parse(rawValue))
  } catch {
    return []
  }
}

export function writeRecentlyWatchedIds(ids) {
  const storage = getStorage()

  if (!storage) {
    return
  }

  try {
    storage.setItem(
      RECENTLY_WATCHED_STORAGE_KEY,
      JSON.stringify(normalizeRecentlyWatchedIds(ids)),
    )
  } catch {
    // Ignore storage write failures so the UI keeps working.
  }
}

export function recordRecentlyWatched(ids, videoId) {
  if (typeof videoId !== 'string' || videoId.length === 0) {
    return normalizeRecentlyWatchedIds(ids)
  }

  return [videoId, ...normalizeRecentlyWatchedIds(ids).filter((id) => id !== videoId)]
}

export function removeRecentlyWatched(ids, videoId) {
  return normalizeRecentlyWatchedIds(ids).filter((id) => id !== videoId)
}
