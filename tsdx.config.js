// see: https://github.com/formium/tsdx#rollup
// from: https://github.com/VirtusLab-Open-Source/formts/pull/83/files#diff-7eb32cb816db9aefed03469f59ccfcd4985b0a1e98fe5da291b0ec33ff7748d9
// via: https://github.com/jaredpalmer/tsdx/issues/961

// TODO: track https://github.com/formium/tsdx/issues/961 for possible better solution

const path = require('path')

const relativePath = p => path.join(__dirname, p)

module.exports = {
  rollup(config, options) {
    if (options.format === 'esm') {
      // we use this to output separate chunk for /src/validators
      // see: https://stackoverflow.com/a/65173887
      return {
        ...config,
        input: [
          relativePath('src/index.ts'),
          relativePath('src/extensions/datacube.ts'),
        ],
        output: {
          ...config.output,
          file: undefined,
          dir: relativePath('dist/esm'),
          preserveModules: true,
          preserveModulesRoot: relativePath('src'),
        },
      }
    } else {
      return config
    }
  },
}
