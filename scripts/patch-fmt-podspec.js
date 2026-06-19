const fs = require('fs')
const path = require('path')

const fmtPodspecPath = path.join(
  __dirname,
  '..',
  'node_modules',
  'react-native',
  'third-party-podspecs',
  'fmt.podspec',
)

const prepareCommand = `
  spec.prepare_command = <<~'FMT_XCODE26_FIX'
    set -e
    if [ -f include/fmt/base.h ]; then
      perl -i -pe 's/# define FMT_USE_CONSTEVAL 1/# define FMT_USE_CONSTEVAL 0/g' include/fmt/base.h
    fi
  FMT_XCODE26_FIX
`.trim()

const marker = 'FMT_XCODE26_FIX'

function patchFmtPodspec(contents) {
  if (contents.includes(marker)) {
    return contents
  }

  return contents.replace(
    '  spec.source_files = ["include/fmt/*.h", "src/format.cc"]',
    `${prepareCommand}\n  spec.source_files = ["include/fmt/*.h", "src/format.cc"]`,
  )
}

if (!fs.existsSync(fmtPodspecPath)) {
  console.warn(`patch-fmt-podspec: ${fmtPodspecPath} not found, skipping`)
  process.exit(0)
}

const contents = fs.readFileSync(fmtPodspecPath, 'utf8')
const patched = patchFmtPodspec(contents)

if (patched !== contents) {
  fs.writeFileSync(fmtPodspecPath, patched)
  console.log('patch-fmt-podspec: added fmt Xcode 26 prepare_command')
}
