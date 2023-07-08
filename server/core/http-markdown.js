// Require
import showdown from 'showdown'
import { readText } from '../modules/files.js'

// Exports
export {
    markdown2html,
    markdown2htmlPage,
    renderMarkdown,
}

// Variables
const converter = new showdown.Converter()

// Functions
function markdown2html(markdown) {
    const html = converter.makeHtml(markdown)
    return html
}
async function markdown2htmlPage(markdown, css, title = "markdown") {
    const body = converter.makeHtml(markdown)
    const html =
        `<!DOCTYPE html>
        <html lang="en">
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
async function renderMarkdown(req, res, next) {
    if (req.url.endsWith(".md")) {
        const text = await readText(`../public${req.url}`)
        const css = await readText(`../server/core/public/other/markdown.css`)
        const html = await markdown2htmlPage(text, css, req.url)
        res.send(html)
    }
    else next()
}
