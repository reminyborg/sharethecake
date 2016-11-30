const sf = require('sheetify')
const choo = require('choo')
const html = require('choo/html')
const serialize = require('form-serialize')
const app = choo()

sf('./node_modules/tachyons/css/tachyons.css', { global: true })
sf('./main.css', { global: true })

app.model(require('./model.js'))

const form = (submit) => html`
    <form class="measure-narrow center" onsubmit=${submit}>
      <fieldset id="sign_up" class="ba b--transparent ph0 mh0">
        <input name="name" placeholder='anon' type="text" class="mt3 w4 pa2 ba b--light-silver br1 foa">
        <input type="submit" value='eats' class="b dim pa2 input-reset b--black-70 bg-transparent f6 br2 pointer">
      </fieldset>
    </form>
`

const mainView = (state, prev, send) => {
  if (state.id !== state.params.id) send('get', state.params.id)
  return html`
    <section class="mw5 mw6-ns center bg-white br3 pa3 pa4-ns mv3 ba b--black-10">
    <div class="tc">
      <h1 class="f3 mb2">${state.reason}</h1>
      <h2 class="f5 fw4 gray mt0">lets share a piece of 🍰</h2>
      ${form(submit)}
    </div>
    </section>
  `

  function submit (e) {
    send('eat', serialize(e.target, { hash: true }).name)
    return false
  }
}

app.router((route) => [
  route('/', require('./new.js')),
  route('/:id', mainView)
])

const tree = app.start()
document.body.appendChild(tree)
