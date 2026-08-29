#!/usr/bin/env node
/**
 * One-time fix: corrects Transit Live Time entries that were created with
 * genuine UTC timestamps, so they instead hold Pacific clock digits labeled
 * with a trailing "Z" — matching how this app's manual entries have always
 * been stored (Contentful's date picker doesn't convert local time to UTC,
 * so every existing entry already carries un-converted local digits).
 *
 * This does NOT touch Transit entries (title/planet/sign/aspect/etc. are all
 * unaffected — only the exact clock time and its date label were wrong), and
 * it does not create anything new. It looks each Transit Live Time entry up
 * by its OLD transitName, updates transitName + liveAt, and republishes it.
 *
 * Usage:
 *   node fix-timezone.js timezone-migration.json --dry-run
 *   node fix-timezone.js timezone-migration.json
 *
 * timezone-migration.json is an array of:
 *   { "old_transitName": "...", "new_transitName": "...",
 *     "old_liveAt": "...", "new_liveAt": "..." }
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
const DRY_RUN = process.argv.includes('--dry-run')
const inputPath = process.argv.find((a, i) => i >= 2 && !a.startsWith('--'))

if (!inputPath) {
  console.error(
    'Usage: node fix-timezone.js <timezone-migration.json> [--dry-run]',
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

async function main() {
  const migration = JSON.parse(fs.readFileSync(inputPath, 'utf8'))
  console.log(
    `Loaded ${migration.length} corrections from ${inputPath} (dry-run: ${DRY_RUN})`,
  )

  let client = null
  if (!DRY_RUN) {
    client = contentful.createClient(
      { accessToken: TOKEN },
      { defaults: { spaceId: SPACE_ID, environmentId: ENVIRONMENT_ID } },
    )
  }

  let unchanged = 0
  let fixed = 0
  let missing = 0

  for (const m of migration) {
    if (
      m.old_transitName === m.new_transitName &&
      m.old_liveAt === m.new_liveAt
    ) {
      unchanged++
      continue
    }

    if (DRY_RUN) {
      console.log(
        `+ would fix "${m.old_transitName}" -> "${m.new_transitName}" (${m.old_liveAt} -> ${m.new_liveAt})`,
      )
      fixed++
      continue
    }

    const res = await withRetry(
      () =>
        client.entry.getMany({
          query: {
            content_type: 'transitLiveTime',
            'fields.transitName': m.old_transitName,
            limit: 1,
          },
        }),
      `lookup "${m.old_transitName}"`,
    )

    const entry = res.items[0]
    if (!entry) {
      console.warn(
        `! could not find entry for "${m.old_transitName}" -- skipping`,
      )
      missing++
      continue
    }

    const updated = await withRetry(
      () =>
        client.entry.update(
          { entryId: entry.sys.id },
          {
            ...entry,
            fields: {
              ...entry.fields,
              transitName: { [LOCALE]: m.new_transitName },
              liveAt: { [LOCALE]: m.new_liveAt },
            },
          },
        ),
      `update "${m.old_transitName}"`,
    )
    await withRetry(
      () => client.entry.publish({ entryId: updated.sys.id }, updated),
      `publish "${m.new_transitName}"`,
    )
    console.log(`+ fixed "${m.old_transitName}" -> "${m.new_transitName}"`)
    fixed++
    await sleep(150)
  }

  console.log(
    `\nDone. Fixed: ${fixed}, already correct: ${unchanged}, not found: ${missing}`,
  )
}

main().catch((err) => {
  console.error('Fix failed:', err)
  process.exit(1)
})
