// Module
const { readText } = require('../modules/file_system')
const { markdown2htmlPage } = require('../modules/markdown')


// Middleware
async function mw_renderMarkdown(req, res, next) {
  console.log(req.url)
  if (req.url.endsWith(".md")) {
    const text = await readText(`../public${req.url}`)
    const html = await markdown2htmlPage(text)
    res.send(html)
    // next()
  }
  else {
    next()
  }
}

// Export
exports.mw_renderMarkdown = mw_renderMarkdown