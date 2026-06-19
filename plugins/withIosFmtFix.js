const { withDangerousMod } = require('@expo/config-plugins')
const { mergeContents } = require('@expo/config-plugins/build/utils/generateCode')
const fs = require('fs')
const path = require('path')

const TAG = 'withIosFmtFix-v2'

// fmt 11.0.2 (bundled in RN 0.79) fails on Xcode 26.4 / Apple Clang 21 due to
// stricter consteval rules. Patch base.h after pod install; build flags alone
// do not stick because fmt's podspec xcconfig keeps c++20.
const fmtFixRuby = `
  fmt_base = File.join(installer.sandbox.root, 'fmt', 'include', 'fmt', 'base.h')
  if File.exist?(fmt_base)
    content = File.read(fmt_base)
    unless content.include?('Xcode 26 workaround')
      patched = content.gsub(/^# define FMT_USE_CONSTEVAL 1$/, '# define FMT_USE_CONSTEVAL 0')
      if patched != content
        File.chmod(0644, fmt_base)
        File.write(fmt_base, patched)
      end
    end
  end
`.trim()

function withIosFmtFix(config) {
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

      // Drop the previous generated block so updated workaround code is applied.
      contents = contents.replace(
        /# @generated begin withIosFmtFix[^\n]*[\s\S]*?# @generated end withIosFmtFix\n?/g,
        '',
      )

      const result = mergeContents({
        tag: TAG,
        src: contents,
        newSrc: fmtFixRuby,
        anchor: /post_install do \|installer\|/,
        offset: 1,
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
