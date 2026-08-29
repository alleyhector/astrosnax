#!/usr/bin/env node
/**
 * Import Transit + Transit Live Time entries into Contentful.
 *
 * Reads a JSON file shaped like:
 * [
 *   {
 *     "title": "Mercury Square Mars",
 *     "planet": "Mercury",
 *     "sign": "Scorpio",
 *     "aspect": "square",
 *     "transitingPlanet": "Mars",
 *     "transitingSign": "Leo",
 *     "liveTimes": [
 *       { "transitName": "Mercury Square Mars – Oct 2, 2026", "liveAt": "2026-10-02T09:14Z" }
 *     ]
 *   },
 *   ...
 * ]
 *
 * Usage:
 *   npm install contentful-management dotenv
 *
 *   In your .env (NOT prefixed with EXPO_PUBLIC_ — this token can write/delete
 *   content, so it must never end up in a client bundle):
 *     CONTENTFUL_MANAGEMENT_TOKEN=CFPAT-xxxxxxxx
 *
 *   Space ID / environment are read from your existing EXPO_PUBLIC_ vars since
 *   those aren't sensitive, but can be overridden with plain CONTENTFUL_* vars.
 *
 *   node scripts/contentful/import-transits.js transits_2026_11.json
 *
 * Add --dry-run to only log what would be created, without writing anything.
 * Safe to re-run: Transit Live Time entries are looked up by transitName and
 * reused rather than duplicated. Transit entries are looked up by title --
 * if one already exists (a recurring transit like "Sun enters Scorpio" from
 * a prior year), this run's new live-time links are APPENDED to it, never
 * replacing or removing whatever links it already had.
 */

const fs = require('fs')
require('dotenv').config()
const contentful = require('contentful-management')

const SPACE_ID =
  process.env.CONTENTFUL_SPACE_ID || process.env.EXPO_PUBLIC_CONTENTFUL_SPACE_ID
const ENVIRONMENT_ID =
  process.env.CONTENTFUL_ENVIRONMENT ||
  process.env.EXPO_PUBLIC_CONTENTFUL_ENVIRONMENT ||
  'master'
const LOCALE = process.env.CONTENTFUL_LOCALE || 'en-US'
// Deliberately NOT falling back to EXPO_PUBLIC_CONTENTFUL_MANAGEMENT_TOKEN here —
// see the warning below. This must come from a var Expo never bundles.
const TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN
const DRY_RUN = process.argv.includes('--dry-run')
const inputPath = process.argv.find((a, i) => i >= 2 && !a.startsWith('--'))

if (!inputPath) {
  console.error('Usage: node import-transits.js <transits.json> [--dry-run]')
  process.exit(1)
}

if (!DRY_RUN && process.env.EXPO_PUBLIC_CONTENTFUL_MANAGEMENT_TOKEN && !TOKEN) {
  console.error(
    'Found EXPO_PUBLIC_CONTENTFUL_MANAGEMENT_TOKEN but no CONTENTFUL_MANAGEMENT_TOKEN.\n' +
      'This script refuses to use the EXPO_PUBLIC_ version on purpose: Expo inlines\n' +
      'EXPO_PUBLIC_* vars into the client bundle, and this token can write/delete content.\n' +
      'Add a plain CONTENTFUL_MANAGEMENT_TOKEN to your .env instead (same value is fine,\n' +
      'but ideally rotate it first), then re-run.',
  )
  process.exit(1)
}
if (!DRY_RUN && (!SPACE_ID || !TOKEN)) {
  console.error(
    'Missing CONTENTFUL_SPACE_ID or CONTENTFUL_MANAGEMENT_TOKEN env vars.',
  )
  process.exit(1)
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// Wraps a Contentful API call with basic 429 backoff.
async function withRetry(fn, label) {
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      return await fn()
    } catch (err) {
      const status = err.response?.status || err.status
      if (status === 429 && attempt < 5) {
        const wait = 1000 * attempt
        console.warn(`Rate limited on ${label}, retrying in ${wait}ms...`)
        await sleep(wait)
        continue
      }
      console.error(`Failed: ${label}`, err.message || err)
      throw err
    }
  }
}

function loc(value) {
  return value === undefined || value === null || value === ''
    ? undefined
    : { [LOCALE]: value }
}

// Build a Contentful `fields` object, omitting any field whose value is empty.
// This matters because planet/sign/aspect/transitingSign are constrained by
// "in" validations, and an empty string is not a valid enum value.
function buildFields(obj) {
  const fields = {}
  for (const [key, value] of Object.entries(obj)) {
    const wrapped = loc(value)
    if (wrapped !== undefined) fields[key] = wrapped
  }
  return fields
}

async function findExistingEntry(client, contentTypeId, fieldId, value) {
  if (DRY_RUN) return null
  const res = await withRetry(
    () =>
      client.entry.getMany({
        query: {
          content_type: contentTypeId,
          [`fields.${fieldId}`]: value,
          limit: 1,
        },
      }),
    `lookup ${contentTypeId} ${fieldId}="${value}"`,
  )
  return res.items[0] || null
}

async function createLiveTimeEntry(client, liveTime) {
  const existing = await findExistingEntry(
    client,
    'transitLiveTime',
    'transitName',
    liveTime.transitName,
  )
  if (existing) {
    console.log(
      `  = reusing existing Transit Live Time "${liveTime.transitName}"`,
    )
    return existing
  }
  if (DRY_RUN) {
    console.log(
      `  + would create Transit Live Time "${liveTime.transitName}" @ ${liveTime.liveAt}`,
    )
    return { sys: { id: `dry-run-${liveTime.transitName}` } }
  }
  const entry = await withRetry(
    () =>
      client.entry.create(
        { contentTypeId: 'transitLiveTime' },
        {
          fields: buildFields({
            transitName: liveTime.transitName,
            liveAt: liveTime.liveAt,
          }),
        },
      ),
    `create transitLiveTime "${liveTime.transitName}"`,
  )
  const published = await withRetry(
    () => client.entry.publish({ entryId: entry.sys.id }, entry),
    `publish transitLiveTime "${liveTime.transitName}"`,
  )
  console.log(
    `  + created + published Transit Live Time "${liveTime.transitName}"`,
  )
  return published
}

async function createTransitEntry(client, transit, liveTimeEntries) {
  const transitTimeLinks = liveTimeEntries.map((e) => ({
    sys: { type: 'Link', linkType: 'Entry', id: e.sys.id },
  }))

  const existing = await findExistingEntry(
    client,
    'transit',
    'title',
    transit.title,
  )
  if (existing) {
    // Recurring transits (e.g. "Sun enters Scorpio") are meant to accumulate
    // occurrences across years in transitTime, not be replaced. Append only
    // whichever of this run's live-time links aren't already there, and
    // leave every existing link (and every other field) exactly as-is.
    const currentLinks =
      (existing.fields.transitTime && existing.fields.transitTime[LOCALE]) || []
    const linkedIds = new Set(currentLinks.map((l) => l.sys.id))
    const missing = transitTimeLinks.filter((l) => !linkedIds.has(l.sys.id))

    if (missing.length === 0) {
      console.log(
        `= "${transit.title}" already exists and already has all live time links`,
      )
      return existing
    }
    if (DRY_RUN) {
      console.log(
        `= "${transit.title}" exists -- would append ${missing.length} new live time link(s), leave the rest untouched`,
      )
      return existing
    }

    const updated = await withRetry(
      () =>
        client.entry.update(
          { entryId: existing.sys.id },
          {
            ...existing,
            fields: {
              ...existing.fields,
              transitTime: { [LOCALE]: [...currentLinks, ...missing] },
            },
          },
        ),
      `append transitTime on existing "${transit.title}"`,
    )
    const published = await withRetry(
      () => client.entry.publish({ entryId: updated.sys.id }, updated),
      `publish "${transit.title}"`,
    )
    console.log(
      `= "${transit.title}" existed -- appended ${missing.length} new live time link(s)`,
    )
    return published
  }

  if (DRY_RUN) {
    console.log(
      `+ would create Transit "${transit.title}" with ${transitTimeLinks.length} live time link(s)`,
    )
    return
  }

  const fields = buildFields({
    title: transit.title,
    planet: transit.planet,
    sign: transit.sign,
    aspect: transit.aspect,
    transitingPlanet: transit.transitingPlanet,
    transitingSign: transit.transitingSign,
  })
  fields.transitTime = { [LOCALE]: transitTimeLinks }

  const entry = await withRetry(
    () => client.entry.create({ contentTypeId: 'transit' }, { fields }),
    `create transit "${transit.title}"`,
  )
  const published = await withRetry(
    () => client.entry.publish({ entryId: entry.sys.id }, entry),
    `publish transit "${transit.title}"`,
  )
  console.log(`+ created + published Transit "${transit.title}"`)
  return published
}

async function main() {
  const transits = JSON.parse(fs.readFileSync(inputPath, 'utf8'))
  console.log(
    `Loaded ${transits.length} transits from ${inputPath} (dry-run: ${DRY_RUN})`,
  )

  let client = null
  if (!DRY_RUN) {
    client = contentful.createClient(
      { accessToken: TOKEN },
      { defaults: { spaceId: SPACE_ID, environmentId: ENVIRONMENT_ID } },
    )
  }

  for (const transit of transits) {
    console.log(`\n${transit.title}`)
    const liveTimeEntries = []
    for (const lt of transit.liveTimes) {
      const entry = await createLiveTimeEntry(client, lt)
      liveTimeEntries.push(entry)
      await sleep(150) // stay well under CMA rate limits
    }
    await createTransitEntry(client, transit, liveTimeEntries)
    await sleep(150)
  }

  console.log('\nDone.')
}

main().catch((err) => {
  console.error('Import failed:', err)
  process.exit(1)
})
