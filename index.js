/* global renderMathInElement */

function mkEl(html) {
  const template = document.createElement('template')
  template.innerHTML = html
  return template.content.firstChild
}

function slugify(str) {
  return str
    .trim()
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[()[\]\s]/g, '')
}

function addIdToHeadings() {
  document.querySelectorAll('h1:not(.title), h2, h3, h4').forEach(el => {
    let id = el.getAttribute('id')
    if (!id) {
      id = slugify(el.textContent)
      el.setAttribute('id', id)
    }
    el.innerHTML = `<a href="#${id}">${el.innerHTML}</a>`
  })
}

function addToc(tocEl) {
  let tocHTML = '<ul>'
  let level = 1
  document.querySelectorAll('h1:not(.title), h2, h3, h4').forEach(el => {
    if (el.classList.contains('ignore-toc')) return
    let elLevel = parseInt(el.tagName[1])
    while (level < elLevel) {
      tocHTML += '<ul>'
      level += 1
    }
    while (level > elLevel) {
      tocHTML += '</ul>'
      level -= 1
    }
    tocHTML += `<li>${el.innerHTML}</li>`
  })
  tocHTML += '</ul>'
  document.querySelector(tocEl).innerHTML = tocHTML
}

function enhanceBlocks() {
  for (const env of [
    'definition',
    'observation',
    'example',
    'theorem',
    'proposition',
    'corollary',
    'proof',
    'remark',
    'intuition'
  ]) {
    document.querySelectorAll(`.${env}`).forEach(el => {
      el.classList.add('environment')
      const title = el.getAttribute('title')
      let tag = el.getAttribute('id')
      if (!tag && title) {
        tag = slugify(`${env}-${title}`)
      }
      const text = `<strong class="environment-name">${env.replace(/^\w/, c => c.toUpperCase())}${
        title ? ':' : ''
      }</strong>${title ? ` ${title}` : ''}`

      let expandButton = ''
      if (env === 'intuition') {
        el.classList.add('collapsed')
        el.innerHTML = `<div class="intuition-content">${el.innerHTML}</div>`
        expandButton =
          '<img class="toggle-button" src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/OOjs_UI_icon_expand.svg/20px-OOjs_UI_icon_expand.svg.png" style="cursor: pointer; height: 16px; vertical-align:middle; margin-left: 5px;"></img>'
      }
      const inline = el.classList.contains('inline') ? 'inline' : ''
      el.insertBefore(
        mkEl(
          `<div class="meta ${inline}">${
            tag ? `<a id="${tag}" href="#${tag}">${text}</a>` : text
          }${expandButton}</div>`
        ),
        el.childNodes[0]
      )
    })
  }

  document.querySelectorAll('.toggle-button').forEach(el => {
    el.addEventListener('click', () => {
      const envEl = el.parentElement.parentElement
      if (envEl.classList.contains('collapsed')) {
        envEl.classList.remove('collapsed')
        el.setAttribute(
          'src',
          'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/OOjs_UI_icon_collapse.svg/20px-OOjs_UI_icon_collapse.svg.png'
        )
      } else {
        envEl.classList.add('collapsed')
        el.setAttribute(
          'src',
          'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/OOjs_UI_icon_expand.svg/20px-OOjs_UI_icon_expand.svg.png'
        )
      }
    })
  })
}

function initKaTeX() {
  renderMathInElement(document.body, {
    delimiters: [
      { left: '$$', right: '$$', display: true },
      { left: '\\[', right: '\\]', display: true },
      { left: '$', right: '$', display: false },
      { left: '\\(', right: '\\)', display: false }
    ]
  })
}

enhanceBlocks()
addIdToHeadings()
addToc('#toc')
initKaTeX()
