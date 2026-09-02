import {
  LiveTimeOccurrence,
  Transit,
  TransitDayGroup,
  TransitWithLiveAt,
} from '@/types/contentful'
import {
  formatLiveAt,
  formatLiveDay,
  isSameLocalDay,
  localDayKey,
  pacificToUtc,
} from '@/lib/pacificTime'

/** Most recent liveAt for a transit, as a UTC Date. */
export function getLatestLiveAtUtc(transit: Transit): Date | null {
  const times = transit.transitTimeCollection?.items ?? []
  if (times.length === 0) return null

  return times
    .map((t) => pacificToUtc(t.liveAt))
    .sort((a, b) => b.getTime() - a.getTime())[0]
}

export function mapLiveTimeOccurrences(
  items: LiveTimeOccurrence[],
): TransitWithLiveAt[] {
  const occurrences: TransitWithLiveAt[] = []

  for (const item of items) {
    const transit = item.linkedFrom?.transitCollection?.items?.[0]
    if (!transit || !item.liveAt) continue

    const liveAtUtc = pacificToUtc(item.liveAt)
    occurrences.push({
      ...transit,
      liveAtUtc,
      liveAtLabel: formatLiveAt(liveAtUtc),
    })
  }

  return occurrences
}

/**
 * Today's occurrences, or if none, the most recent live day.
 * `occurrences` should already be newest-first.
 */
export function getMenuTransits(
  occurrences: TransitWithLiveAt[] = [],
  now = new Date(),
): { menuTransits: TransitWithLiveAt[]; isToday: boolean } {
  const todays = occurrences
    .filter((t) => isSameLocalDay(t.liveAtUtc, now))
    .sort((a, b) => b.liveAtUtc.getTime() - a.liveAtUtc.getTime())

  if (todays.length > 0) {
    return { menuTransits: todays, isToday: true }
  }

  const past = occurrences
    .filter((t) => t.liveAtUtc.getTime() <= now.getTime())
    .sort((a, b) => b.liveAtUtc.getTime() - a.liveAtUtc.getTime())

  if (past.length === 0) {
    return { menuTransits: [], isToday: false }
  }

  const latestDay = past[0].liveAtUtc
  return {
    menuTransits: past.filter((t) => isSameLocalDay(t.liveAtUtc, latestDay)),
    isToday: false,
  }
}

/**
 * Archive rows: each liveAt occurrence, including later today.
 * Future days are excluded. Grouped by the user's local calendar day.
 */
export function getArchiveDayGroups(
  occurrences: TransitWithLiveAt[],
  now = new Date(),
  // For testing: Here is where you can set a specific date/time to test the archive day groups.
  // now = new Date('2027-03-01T20:00:00-07:00'),
): TransitDayGroup[] {
  const visible: TransitWithLiveAt[] = []

  for (const occurrence of occurrences) {
    const isToday = isSameLocalDay(occurrence.liveAtUtc, now)
    const isPast = occurrence.liveAtUtc.getTime() <= now.getTime()
    if (!isToday && !isPast) continue
    visible.push(occurrence)
  }

  const byDay = new Map<string, TransitWithLiveAt[]>()

  for (const occurrence of visible) {
    const key = localDayKey(occurrence.liveAtUtc)
    const existing = byDay.get(key) ?? []
    existing.push(occurrence)
    byDay.set(key, existing)
  }

  return [...byDay.entries()]
    .map(([dayKey, dayTransits]) => ({
      dayKey,
      dayLabel: formatLiveDay(dayTransits[0].liveAtUtc),
      transits: dayTransits.sort(
        (a, b) => b.liveAtUtc.getTime() - a.liveAtUtc.getTime(),
      ),
    }))
    .sort((a, b) => b.dayKey.localeCompare(a.dayKey))
}
