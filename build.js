const minify = require('html-minifier').minify
const cheerio = require('cheerio')
const katex = require('katex')
const ejs = require('ejs')
const fs = require('fs')

function slugify(str) {
  return str
    .trim()
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[()[\]\s]/g, '')
}

function addToc($) {
  const $toc = $('toc')
  const toc = $toc.get(0)
  if (!toc) return

  let tocHTML = '<ul>'
  let level = 1
  $('h1:not(.title), h2, h3, h4').each((i, el) => {
    const $el = $(el)
    if ($el.hasClass('ignore-toc')) return
    let elLevel = parseInt(el.tagName[1]) // h1, h2, ...

    while (level < elLevel) {
      tocHTML += '<ul>'
      level += 1
    }
    while (level > elLevel) {
      tocHTML += '</ul>'
      level -= 1
    }
    tocHTML += `<li>${$el.html()}</li>`
  })
  tocHTML += '</ul>'

  $toc.html(tocHTML).addClass(toc.tagName)
  toc.tagName = 'div'
}

function processBlocks($) {
  const envs = [
    'definition',
    'observation',
    'example',
    'theorem',
    'proposition',
    'corollary',
    'proof',
    'remark',
    'intuition'
  ]
  for (const env of envs) {
    $(env).each((i, el) => {
      const $el = $(el)

      $el.addClass('block')
      $el.addClass(el.tagName)
      el.tagName = 'div'

      const title = $el.attr('title')
      let tagStr = $el.attr('tag')
      if (!tagStr && title) {
        tagStr = slugify(`${env}-${title}`)
      }
      const tags = tagStr ? tagStr.split(' ') : []
      tags.forEach(tag => $(`<span id="${tag}"/>`).insertBefore($el))

      $el.removeAttr('title')
      $el.removeAttr('tag')

      const inline = typeof $el.attr('inline') === 'undefined' ? false : true
      if (inline) {
        $el.addClass('inline')
        $el.removeAttr('inline')
      }

      const envDisplayName = env.replace(/^\w/, c => c.toUpperCase())
      const text = title
        ? `<strong>${envDisplayName}:</strong> ${title}`
        : `<strong>${envDisplayName}</strong>`
      if (tags.length > 0) {
        $el.prepend(`<div class="meta"><a href="#${tags[0]}">${text}.</a></div>`)
      } else {
        $el.prepend(`<div class="meta">${text}.</div>`)
      }
    })
  }
}

function addIdToHeadings($) {
  $('h1:not(.title), h2, h3, h4').each((i, el) => {
    const $el = $(el)
    let id = $el.attr('id')
    if (!id) {
      id = slugify($el.text())
      $el.attr('id', id)
    }
    $el.html(`<a href="#${id}">${$el.html()}</a>`)
  })
}

function renderKatex(html) {
  function render(tex, displayMode) {
    return katex.renderToString(tex, {
      displayMode,
      throwOnError: false
    })
  }

  return html
    .replace(/\$\$((?:\\\$|[^$])+)\$\$/g, (_, g1) => render(g1, true))
    .replace(/\$((?:\\\$|[^$])+)\$/g, (_, g1) => render(g1, false))
}

function build() {
  const partialFiles = [
    'index',
    'set-theory',
    'abstract-algebra',
    'arithmetic',
    'information-theory',
    'graph-theory',
    'analysis',
    'topology'
  ]
  let content = partialFiles
    .map(partialFile => fs.readFileSync(`${__dirname}/content/${partialFile}.html`, 'utf8'))
    .join('')

  const $ = cheerio.load(content)

  processBlocks($)
  addIdToHeadings($)
  addToc($)

  let output = $('body').html()

  const template = fs.readFileSync(`${__dirname}/template.html.ejs`, 'utf8')
  output = ejs.render(template, { content: output })

  output = minify(output, {
    collapseWhitespace: true
  })

  output = renderKatex(output)

  fs.writeFileSync(`${__dirname}/docs/index.html`, output)
}

if (require.main === module) {
  build()
} else {
  module.exports = function() {
    console.log('building...')
    build()
  }
}
