var http = require('http')
var express = require('express')
var path = require('path')
var app = express()
app.set('view engine', 'ejs') // set up ejs for templating
app.use('/', express.static(path.join(__dirname, 'static'))) // statics
app.get('/',(req, res) => { res.render('index')})
var port = 4444
var expressServer = http.createServer(app)
expressServer.listen(port,() => {
    console.log('http://localhost:'+port)
})






var dop = require("dop")
dop.listen({httpServer:expressServer})
var circle = dop.register({
    x: 100,
    y: 100,
    move: (x, y) => {
        circle.x = x
        circle.y = y
    }
})
dop.onSubscribe(() => circle)