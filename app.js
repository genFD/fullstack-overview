const sqlite = require('sqlite3')
const express = require('express')
const app = express()
const PORT = 8000

app.use(express.json())

app.get('/', function (req, res) {
  res.sendFile('index.html', { root: __dirname })
})

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})

// database

const db = new sqlite.Database(':memory:')

db.serialize(() => {
  db.run(`CREATE TABLE countries (
       name Text,
       time TEXT
    )
    `)
  db.run(`INSERT INTO countries (name, time)
          VALUES ('Norway', datetime('now')), ('Spain', datetime('now')), ('Germany', datetime('now'))
  `)
})

app.get('/getCountries', function (req, res) {
  db.all('SELECT * FROM countries', (err, rows) => {
    res.send(rows)
  })
})
