const bs = require('browser-sync').create()
const build = require('./build')

let buildIsQueued = false

// Prevent spammy behavior in browsersync
function buildWrapper() {
  if (buildIsQueued) return
  buildIsQueued = true
  build()
  setTimeout(() => {
    buildIsQueued = false
  }, 1000)
}

build()
bs.watch(`content/*`).on('change', buildWrapper)
bs.watch(`template.html.ejs`).on('change', buildWrapper)
bs.watch(`docs/*`).on('change', bs.reload)
bs.init({ server: `${__dirname}/docs/` })
