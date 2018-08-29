const bs = require('browser-sync').create()
let build = require('./build')

// Prevent spammy behavior in browsersync
let buildIsQueued = false
let reloadBuildIsQueued = false

function requireUncached(path) {
  delete require.cache[require.resolve(path)]
  return require(path)
}

function reloadBuild() {
  if (reloadBuildIsQueued) return
  reloadBuildIsQueued = true
  build = requireUncached('./build')
  setTimeout(() => {
    reloadBuildIsQueued = false
  }, 1000)
  buildWrapper()
}

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
bs.watch(`build.js`).on('change', reloadBuild)
bs.watch(`docs/*`).on('change', bs.reload)
bs.init({ server: `${__dirname}/docs/` })
