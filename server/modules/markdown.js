// Require
const showdown  = require('showdown')
const converter = new showdown.Converter()
const { readText } = require('./file_system')

// Functions
function markdown2html(markdown) {
  const html = converter.makeHtml(markdown)
  return html
}
async function markdown2htmlPage(markdown, title = "markdown", light = false) {
  const body = converter.makeHtml(markdown)
  const css = await readText(`../server/_http/markdown.css`)

  const html = 
`<!DOCTYPE html>
<html lang="en" class="${light ? "light" : "dark"}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="stylesheet" href="/web/ui/fonts/fira-code.css">
  <link rel="stylesheet" href="/web/ui/fonts/open-sans.css">
  <style> html { background-color: black; color: white; } </style>
  <style>${css}</style>
</head>
<body><main>${body}</main></body>
</html>`

  return html
}

// Exports
exports.markdown2html = markdown2html
exports.markdown2htmlPage = markdown2htmlPage