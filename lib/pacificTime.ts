import { fromZonedTime } from 'date-fns-tz'

const PACIFIC = 'America/Los_Angeles'

/**
 * Contentful liveAt values are entered as Pacific wall time.
 * Strip any offset/Z and interpret the date/time numbers as America/Los_Angeles.
 */
export function pacificToUtc(contentfulValue: string): Date {
  const wall = contentfulValue
    .replace(/Z$/i, '')
    .replace(/[+-]\d{2}:\d{2}$/, '')

  return fromZonedTime(wall, PACIFIC)
}

export function formatLiveAt(liveAtUtc: Date): string {
  return liveAtUtc.toLocaleString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

/** Day-only label for archive section headers (user's local timezone). */
export function formatLiveDay(liveAtUtc: Date): string {
  return liveAtUtc.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function localDayKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function isSameLocalDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

/**
 * Upper bound for liveAt GraphQL filters: end of the user's local day,
 * plus a buffer so Pacific-stored times still match near midnight.
 * Stable across re-renders on the same local calendar day.
 */
export function liveAtQueryTo(now = new Date()): string {
  const endOfLocalDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999,
  )
  return new Date(endOfLocalDay.getTime() + 12 * 60 * 60 * 1000).toISOString()
}
