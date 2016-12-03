const levelup = require('levelup')
const db = levelup('./cakes')
const concat = require('concat-stream')

const bankai = require('bankai')
const http = require('http')
const path = require('path')

const options = { js: { transform: ['envify', 'es2020'] } }
if (process.env.NODE_ENV === 'production') {
  options.optimize = true
}

const clientPath = path.join(__dirname, 'client.js')
const assets = bankai(clientPath, options)

http.createServer((req, res) => {
  if (req.url.substr(0, 5) === '/cake') return cake(req, res)
  switch (req.url) {
    case '/bundle.js': return assets.js(req, res).pipe(res)
    case '/bundle.css': return assets.css(req, res).pipe(res)
    default: return assets.html(req, res).pipe(res)
  }
}).listen(8080)

function cake (req, res) {
  const id = req.url.substr(6)
  if (req.method === 'POST') return req.pipe(concat((body) => create(id, body.toString(), res)))
  if (req.method === 'PUT') return req.pipe(concat((body) => add(id, body.toString(), res)))
  if (req.method === 'GET') return get(id, res)
}

function create (id, reason, res) {
  db.put(id, reason, (err) => {
    if (err) console.log(err)
    res.end('created ' + id)
  })
}

function add (id, name, res) {
  db.put(id, name, (err) => {
    if (err) console.log(err)
    res.end('added ' + id)
  })
}

function get (id, res) {
  let result = false
  db.createReadStream({ gte: id, lt: id + '~', fillCache: true })
    .on('data', (data) => {
      if (!result) result = { reason: data.value, pieces: [] }
      else result.pieces.push({ uid: data.key.substr(data.key.indexOf('/') + 1), name: data.value })
    })
    .on('end', () => res.end(JSON.stringify(result)))
}
