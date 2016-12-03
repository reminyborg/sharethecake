const html = require('choo/html')
const serialize = require('form-serialize')

const form = (submit) => html`
    <form class="measure-narrow center" onsubmit=${submit}>
      <fieldset id="sign_up" class="ba b--transparent ph0 mh0">
        <input name="reason" placeholder='reason' type="text" class="mt3 w-100 pa2 mv2 ba b--light-silver br1 foa">
        <input type="submit" value='create' class="b dim pa2 input-reset b--black-70 bg-transparent f6 br2 pointer">
      </fieldset>
    </form>
`

const NewCake = (state, prev, send) => {
  if (state.id !== state.params.id) send('get', state.params.id)
  return html`
    <div class="tc">
      <h1 class="f3 mb2">It's celebration time!</h1>
      <h2 class="f5 fw4 gray mt0">why are we sharing 🍰</h2>
      ${form(submit)}
    </div>
  `

  function submit (e) {
    send('create', serialize(e.target, { hash: true }).reason)
    return false
  }
}

module.exports = NewCake
