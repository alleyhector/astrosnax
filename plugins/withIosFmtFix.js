const { withDangerousMod } = require('@expo/config-plugins')
const { mergeContents } = require('@expo/config-plugins/build/utils/generateCode')
const fs = require('fs')
const path = require('path')

const TAG = 'withIosFmtFix-v3'
const FMT_MARKER = 'FMT_XCODE26_FIX'

const fmtPodspecPrepareCommand = `
  spec.prepare_command = <<~'FMT_XCODE26_FIX'
    set -e
    if [ -f include/fmt/base.h ]; then
      perl -i -pe 's/# define FMT_USE_CONSTEVAL 1/# define FMT_USE_CONSTEVAL 0/g' include/fmt/base.h
    fi
  FMT_XCODE26_FIX
`.trim()

const fmtFixRuby = `
  fmt_paths = [
    File.join(installer.sandbox.root, 'fmt', 'include', 'fmt', 'base.h'),
    File.join(installer.sandbox.pod_dir('fmt'), 'include', 'fmt', 'base.h'),
  ].uniq

  fmt_paths.each do |fmt_base|
    next unless File.exist?(fmt_base)

    content = File.read(fmt_base)
    patched = content.gsub('# define FMT_USE_CONSTEVAL 1', '# define FMT_USE_CONSTEVAL 0')
    next if patched == content

    File.chmod(0644, fmt_base)
    File.write(fmt_base, patched)
    Pod::UI.puts "withIosFmtFix: patched \#{fmt_base}"
  end
`.trim()

function patchFmtPodspecFile(fmtPodspecPath) {
  if (!fs.existsSync(fmtPodspecPath)) {
    return
  }

  const contents = fs.readFileSync(fmtPodspecPath, 'utf8')
  if (contents.includes(FMT_MARKER)) {
    return
  }

  const patched = contents.replace(
    '  spec.source_files = ["include/fmt/*.h", "src/format.cc"]',
    `${fmtPodspecPrepareCommand}\n  spec.source_files = ["include/fmt/*.h", "src/format.cc"]`,
  )

  if (patched !== contents) {
    fs.writeFileSync(fmtPodspecPath, patched)
  }
}

function withIosFmtFix(config) {
  config = withDangerousMod(config, [
    'ios',
    async (config) => {
      patchFmtPodspecFile(
        path.join(
          config.modRequest.projectRoot,
          'node_modules',
          'react-native',
          'third-party-podspecs',
          'fmt.podspec',
        ),
      )
      return config
    },
  ])

  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(
        config.modRequest.platformProjectRoot,
        'Podfile',
      )

      if (!fs.existsSync(podfilePath)) {
        return config
      }

      let contents = fs.readFileSync(podfilePath, 'utf8')
      contents = contents.replace(
        /# @generated begin withIosFmtFix[^\n]*[\s\S]*?# @generated end withIosFmtFix[^\n]*\n?/g,
        '',
      )

      const result = mergeContents({
        tag: TAG,
        src: contents,
        newSrc: fmtFixRuby,
        anchor: /CODE_SIGNING_ALLOWED/,
        offset: 4,
        comment: '#',
      })

      if (!result.didMerge) {
        console.warn(
          `${TAG}: Could not inject fmt workaround into Podfile post_install hook.`,
        )
        return config
      }

      fs.writeFileSync(podfilePath, result.contents)
      return config
    },
  ])
}

module.exports = withIosFmtFix
