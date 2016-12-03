/* global localStorage */
const shortid = require('shortid')
const xhr = require('xhr')

// set unique id for this user
let uid = localStorage.getItem('uid')
if (!uid) {
  uid = shortid.generate()
  localStorage.setItem('uid', uid)
}

module.exports = {
  state: { uid: uid },
  reducers: {
    update: (data, state) => (Object.assign({}, state, data))
  },
  effects: {
    create: (reason, state, send, done) => {
      const id = shortid.generate()
      xhr.post('/cake/' + id, { body: reason }, (err, result) => {
        if (err) console.log(err)
        console.log(result)
        const href = '/' + id
        window.history.pushState({}, null, href)
        send('update', { reason: reason }, done)
        send('location:setLocation', { location: href }, done)
      })
    },
    get: (id, state, send, done) => {
      send('update', { id: id }, done)
      xhr.get('/cake/' + id, (err, result) => {
        if (err) console.log(err)
        result = JSON.parse(result.body)
        send('update', result, done)
      })
      done()
    },
    eat: (name, state, send, done) => {
      xhr.put('/cake/' + state.id + '/' + uid, { body: name }, (err, result) => {
        if (err) console.log(err)
        send('get', state.id, done)
        // const newPiece = { uid: uid, name: name }
        // send('update', Object.assign({}, state, { pieces: state.pieces.concat(newPiece) }))
      })
      done()
    }
  }
}
