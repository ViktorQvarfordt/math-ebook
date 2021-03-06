# Math e-book

Go to book: [math.viktorqvarfordt.com](http://math.viktorqvarfordt.com/).


## Update content

1. Install dependencies: `npm install`. (Only needed once.)
2. Start development server: `node dev-server`.
3. Edit files in `content/`. The browser will automatically reload.


### Publish

Simply `git commit` the updates.

Note that:

1. The development server automatically runs the build script `build.js` (which can be executed stand-alone: `node build`). This will process and combine files from `content/` into `docs/index.html`. The other files besides in `docs/` besides `docs/index.html` are not touched by the build script.
2. The content of `docs/` is served via GitHub Pages.


## Markup language

The markup language that is used is HTML with some trickery: I have created custom html tags and a short-hand syntax for referencing existing definitions (`[foo]` is transformed into `<a href="#definition-foo">foo</a>`). The math is typeset with KaTeX.


## Responsive math

With the css below KaTeX allows line-breaks also in display style. However, note that this does not work in any math environment like `aligned` or `gathered`. It is a good idea to use `\allowbreak` where you prefer to have line breaks.

```css
.katex-display > .katex {
  white-space: normal;
}
```
