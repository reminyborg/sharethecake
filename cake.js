const html = require('choo/html')
const serialize = require('form-serialize')

const form = (submit) => html`
    <form class="measure-narrow center" onsubmit=${submit}>
      <fieldset id="sign_up" class="ba b--transparent ph0 mh0">
        <input id="name" name="name" placeholder='anon' type="text" class="w4 pa2 ba b--light-silver br1 foa">
        <input type="submit" value='eats' class="b dim pa2 input-reset b--black-70 bg-transparent f6 br2 pointer">
      </fieldset>
    </form>
`

function Cake (state, prev, send) {
  const eaten = state.pieces && state.pieces.some((p) => p.uid === state.uid)
  return html`
    <div class="tc">
      <h1 class="f3 mb2">${state.reason}</h1>
      <h2 class="f5 fw4 gray mt0">have your piece of 🍰</h2>
      ${eaten ? null : form(submit)}
      ${List(state.pieces)}
      <small class="mid-gray pt2">Share the party:</small>
      <a href=${window.location.href} class="f6 db mid-gray">${window.location.href}</a>
    </div>
  `

  function submit (e) {
    send('eat', serialize(e.target, { hash: true }).name)
    return false
  }
}

function List (pieces) {
  if (!pieces) return null
  const list = pieces.map((piece) => html`
    <li>${piece.name}</li>
  `)

  return html`
    <ul class="tl list">${list}</ul>
  `
}

module.exports = Cake
