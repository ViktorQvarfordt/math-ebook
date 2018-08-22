const bs = require('browser-sync').create()
const build = require('./build')

bs.watch(`content/*`).on('change', build)
bs.watch(`docs/*`).on('change', bs.reload)
bs.init({ server: `${__dirname}/docs/` })
