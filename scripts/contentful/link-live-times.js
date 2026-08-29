#!/usr/bin/env node
/**
 * Audits and repairs the link between Transit entries and their Transit Live
 * Time entries for October 2026.
 *
 * Root cause this addresses: import-transits.js skips creating a Transit
 * entry when one with the same title already exists (correct, to avoid
 * duplicating a recurring transit like "Sun enters Scorpio" across years) --
 * but it never added the new month's live-time link to that pre-existing
 * entry's `transitTime` array. So the live-time entry exists and is
 * published, it's just not linked to anything.
 *
 * This script is READ-ONLY except for the final link-append step, which is
 * additive: it only ever pushes missing links onto the existing transitTime
 * array, never removes or reorders what's already there, and never touches
 * any other field. Safe to re-run.
 *
 * Usage:
 *   node link-live-times.js october_transits_corrected.json --audit-only
 *   node link-live-times.js october_transits_corrected.json
 *
 * --audit-only does all the (safe, read-only) lookups and prints a report,
 * but makes no writes -- use it first to see the real scope of the problem.
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
const TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN
const AUDIT_ONLY = process.argv.includes('--audit-only')
const inputPath = process.argv.find((a, i) => i >= 2 && !a.startsWith('--'))

if (!inputPath) {
  console.error(
    'Usage: node link-live-times.js <october_transits.json> [--audit-only]',
  )
  process.exit(1)
}
if (!SPACE_ID || !TOKEN) {
  console.error(
    'Missing CONTENTFUL_SPACE_ID or CONTENTFUL_MANAGEMENT_TOKEN env vars (needed even for audit -- it reads real data).',
  )
  process.exit(1)
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

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

async function findOne(client, contentTypeId, fieldId, value) {
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

async function main() {
  const transits = JSON.parse(fs.readFileSync(inputPath, 'utf8'))
  console.log(
    `Auditing ${transits.length} transits against the live space (audit-only: ${AUDIT_ONLY})\n`,
  )

  const client = contentful.createClient(
    { accessToken: TOKEN },
    { defaults: { spaceId: SPACE_ID, environmentId: ENVIRONMENT_ID } },
  )

  let okCount = 0
  let fixedCount = 0
  let missingTransit = 0
  let missingLiveTime = 0

  for (const t of transits) {
    const transitEntry = await findOne(client, 'transit', 'title', t.title)
    if (!transitEntry) {
      console.log(
        `? "${t.title}" -- no Transit entry found at all (expected one to already exist from the import)`,
      )
      missingTransit++
      continue
    }

    const currentLinks =
      (transitEntry.fields.transitTime &&
        transitEntry.fields.transitTime[LOCALE]) ||
      []
    const linkedIds = new Set(currentLinks.map((l) => l.sys.id))

    let anyMissing = false
    const toAdd = []

    for (const lt of t.liveTimes) {
      const liveEntry = await findOne(
        client,
        'transitLiveTime',
        'transitName',
        lt.transitName,
      )
      if (!liveEntry) {
        console.log(
          `  ! "${t.title}": Transit Live Time "${lt.transitName}" not found at all`,
        )
        missingLiveTime++
        continue
      }
      if (!linkedIds.has(liveEntry.sys.id)) {
        anyMissing = true
        toAdd.push(liveEntry)
      }
    }

    if (!anyMissing) {
      okCount++
      continue
    }

    console.log(
      `X "${t.title}" -- missing ${toAdd.length} link(s): ${toAdd.map((e) => e.fields.transitName[LOCALE]).join(', ')}`,
    )

    if (AUDIT_ONLY) continue

    const newLinks = [
      ...currentLinks,
      ...toAdd.map((e) => ({
        sys: { type: 'Link', linkType: 'Entry', id: e.sys.id },
      })),
    ]
    const updated = await withRetry(
      () =>
        client.entry.update(
          { entryId: transitEntry.sys.id },
          {
            ...transitEntry,
            fields: {
              ...transitEntry.fields,
              transitTime: { [LOCALE]: newLinks },
            },
          },
        ),
      `update transitTime on "${t.title}"`,
    )
    await withRetry(
      () => client.entry.publish({ entryId: updated.sys.id }, updated),
      `publish "${t.title}"`,
    )
    console.log(`  + fixed "${t.title}"`)
    fixedCount++
    await sleep(150)
  }

  console.log(`\nAlready correctly linked: ${okCount}`)
  console.log(
    `${AUDIT_ONLY ? 'Would fix' : 'Fixed'}: ${fixedCount || transits.length - okCount - missingTransit}`,
  )
  if (missingTransit)
    console.log(
      `Transit entries not found at all: ${missingTransit} (unexpected -- investigate manually)`,
    )
  if (missingLiveTime)
    console.log(
      `Transit Live Time entries not found at all: ${missingLiveTime} (unexpected -- investigate manually)`,
    )
}

main().catch((err) => {
  console.error('Audit/fix failed:', err)
  process.exit(1)
})
