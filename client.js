const css = require('sheetify')
const choo = require('choo')
const html = require('choo/html')
const app = choo()

if (process.env.NODE_ENV !== 'production') {
  const log = require('choo-log')
  app.use(log())
}

css('./node_modules/tachyons/css/tachyons.css', { global: true })
css('./main.css', { global: true })

app.model(require('./model.js'))

const Container = (content) => {
  return (state, prev, send) => {
    if (state.id !== state.params.id) send('get', state.params.id)
    const hidden = (content.name === 'Cake' && !state.reason) ? 'hidden' : ''
    return html`
      <div class="container">
      <main class=${`${hidden} fade mw5 mw6-ns center bg-white br3 pa3 pa4-ns mv3 ba b--black-10`}>
        ${content(state, prev, send)}
      </main>
      <footer class="footer bottom-1 w-100 pv2 mid-gray">
        <small class="f6 db tc">2016 Remi Nyborg</small>
      </footer>
      </div>
    `
  }
}

app.router((route) => [
  route('/', Container(require('./new-cake'))),
  route('/:id', Container(require('./cake')))
])

const tree = app.start()
document.body.appendChild(tree)
