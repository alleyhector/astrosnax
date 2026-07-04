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

export function isSameLocalDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}
