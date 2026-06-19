const { withDangerousMod } = require('@expo/config-plugins')
const { mergeContents } = require('@expo/config-plugins/build/utils/generateCode')
const fs = require('fs')
const path = require('path')

const TAG = 'withIosFmtFix'

// fmt 11.0.2 (bundled in RN 0.79) fails on Xcode 26.4 / Apple Clang 21 due to
// stricter consteval rules. Compiling the fmt pod as C++17 skips that path.
const fmtFixRuby = `
  installer.pods_project.targets.each do |target|
    next unless target.name == 'fmt'

    target.build_configurations.each do |config|
      config.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'c++17'
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

      const contents = fs.readFileSync(podfilePath, 'utf8')
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
