function mkEl(html) {
  const template = document.createElement('template')
  template.innerHTML = html
  return template.content.firstChild
}

// TODO: The below code is outdated. Update it to allow for collapsable intution blocks.

function enhanceIntuitionBlocks() {
  // const expandIcon = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/OOjs_UI_icon_expand.svg/20px-OOjs_UI_icon_expand.svg.png'
  // const collapseIcon = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/OOjs_UI_icon_collapse.svg/20px-OOjs_UI_icon_collapse.svg.png'

  // document.querySelectorAll(`.intuition`).forEach(el => {

  //   let expandButton = ''
  //   el.innerHTML = `<div class="intuition-content">${el.innerHTML}</div>`
  //   expandButton = `<img class="toggle-button" src="${collapseIcon}" style="cursor: pointer; height: 16px; vertical-align:middle; margin-left: 5px;"></img>`

  //   el.insertBefore(
  //     mkEl(
  //       `<div class="meta">${
  //         tag ? `<a id="${tag}" href="#${tag}">${text}</a>` : text
  //       }${expandButton}</div>`
  //     ),
  //     el.childNodes[0]
  //   )
  // })

  // document.querySelectorAll('.toggle-button').forEach(el => {
  //   el.addEventListener('click', () => {
  //     const envEl = el.parentElement.parentElement
  //     if (envEl.classList.contains('collapsed')) {
  //       envEl.classList.remove('collapsed')
  //       el.setAttribute('src', collapseIcon)
  //     } else {
  //       envEl.classList.add('collapsed')
  //       el.setAttribute('src', expandIcon)
  //     }
  //   })
  // })
}

enhanceIntuitionBlocks()
