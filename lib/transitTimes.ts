import { Transit, TransitDayGroup, TransitWithLiveAt } from '@/types/contentful'
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

/** Live times that have already gone live, newest first. */
export function getPastLiveAtsUtc(transit: Transit, now = new Date()): Date[] {
  return (transit.transitTimeCollection?.items ?? [])
    .map((t) => pacificToUtc(t.liveAt))
    .filter((d) => d.getTime() <= now.getTime())
    .sort((a, b) => b.getTime() - a.getTime())
}

/**
 * Transits that are live (latest liveAt <= now), newest first.
 * Attaches the latest live instant for display.
 */
export function getLiveTransits(
  transits: Transit[],
  now = new Date(),
): TransitWithLiveAt[] {
  return transits
    .map((transit) => {
      const past = getPastLiveAtsUtc(transit, now)
      if (past.length === 0) return null
      return {
        ...transit,
        liveAtUtc: past[0],
        liveAtLabel: formatLiveAt(past[0]),
      }
    })
    .filter((t): t is TransitWithLiveAt => t !== null)
    .sort((a, b) => b.liveAtUtc.getTime() - a.liveAtUtc.getTime())
}

/**
 * Transits with a liveAt on the user's local calendar day,
 * including times later today that have not occurred yet.
 */
export function getTodaysLiveTransits(
  transits: Transit[],
  now = new Date(),
): TransitWithLiveAt[] {
  return transits
    .map((transit) => {
      const timesOnDay = (transit.transitTimeCollection?.items ?? [])
        .map((t) => pacificToUtc(t.liveAt))
        .filter((d) => isSameLocalDay(d, now))
        .sort((a, b) => b.getTime() - a.getTime())

      if (timesOnDay.length === 0) return null

      return {
        ...transit,
        liveAtUtc: timesOnDay[0],
        liveAtLabel: formatLiveAt(timesOnDay[0]),
      }
    })
    .filter((t): t is TransitWithLiveAt => t !== null)
    .sort((a, b) => b.liveAtUtc.getTime() - a.liveAtUtc.getTime())
}

/**
 * Archive rows: each liveAt occurrence, including later today.
 * Future days are excluded. Grouped by the user's local calendar day.
 */
export function getArchiveDayGroups(
  transits: Transit[],
  // now = new Date(),
  now = new Date('2026-10-31T20:00:00-07:00'),
): TransitDayGroup[] {
  const occurrences: TransitWithLiveAt[] = []

  for (const transit of transits) {
    for (const time of transit.transitTimeCollection?.items ?? []) {
      const liveAtUtc = pacificToUtc(time.liveAt)
      const isToday = isSameLocalDay(liveAtUtc, now)
      const isPast = liveAtUtc.getTime() <= now.getTime()
      if (!isToday && !isPast) continue

      occurrences.push({
        ...transit,
        liveAtUtc,
        liveAtLabel: formatLiveAt(liveAtUtc),
      })
    }
  }

  const byDay = new Map<string, TransitWithLiveAt[]>()

  for (const occurrence of occurrences) {
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
