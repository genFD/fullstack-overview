const http = require('http')
const PORT = 8000

const server = http.createServer((req, res) =>{ 
res.write("Hello from basic nodejs server")
res.end()	
})

server.listen(PORT)
console.log(`server is listening to port ${PORT}`)
