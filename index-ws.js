const express = require('express')
const WebSocket = require('ws')
// const WebSocketServer = require('WebSocketServer')
const server = require('http').createServer()
const app = express()

app.get('/', function (req, res) {
  res.sendFile('index.html', { root: __dirname })
})

server.on('request', app)
server.listen(8000, function () {
  console.log('listening on port 8000')
})

// websockets

const websocketsServer = require('ws').Server
const wss = new websocketsServer({ server: server })

wss.on('connection', function connection(ws) {
  const numOfClients = wss.clients.size
  console.log(`clients connected : ${numOfClients}`)
  wss.broadcast(`current visitors : ${numOfClients}`)
  if (ws.readyState === ws.OPEN) {
    ws.send('welcome to websocket server')
  }
  db.run(`INSERT INTO visitors (count, time)
        VALUES (${numOfClients}, datetime('now'))
`)
  ws.on('close', function close() {
    console.log('clients disconnected')
  })
})

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(data)
  })
}

// database

const sqlite = require('sqlite3')
const { clear } = require('console')

const db = new sqlite.Database(':memory:')

db.serialize(() => {
  db.run(`CREATE TABLE visitors (
       count INTEGER,
       time TEXT
    )
    `)
})

function getCount() {
  db.each('SELECT * FROM visitors', (err, row) => {
    console.log(row)
  })
}

function shutdownDB() {
  getCount()
  console.log('Shutting down database')
  db.close()
}

process.on('SIGINT', () => {
  wss.clients.forEach((client) => {
    client.close()
  })
  server.close(() => {
    shutdownDB()
  })
})
