import express from 'express'
import { createServer } from 'http'
import path from 'path'
// import { Socket } from 'socket.io'
import { toDataURL } from 'qrcode'
import fetch from 'node-fetch'

function connect(conn, PORT) {
    let app = express()
    app.set('view engine', 'ejs')
    // console.log(app)
    let server = createServer(app)
    // app.use(express.static(path.join(__dirname, 'views')))
    let _qr
    conn.ev.on('connection.update', async up => {
    	// console.log(up)
        if (up.qr) _qr = await toDataURL(up.qr)
        else if (up.connection === 'close') connect(conn, ~~(Math.random() * 1e4))
    })
    
    app.get('/', (req, res) => res.send('Hello World!'))
    
    app.get('/qr', (req, res) => res.render('index', { qrcode: _qr }))
    
    app.get('/file/:id', (req, res) => res.download('./tmp/file/' + req.params.id, req.params.id, (e) => res.send(String(e))))
    
    // let io = new Socket(server)
    // io.on('connection', socket => {
    //     let { unpipeEmit } = pipeEmit(conn, socket, 'conn-')
    //     socket.on('disconnect', unpipeEmit)
    // })
    
    server.listen(PORT, () => {
        console.log('App listened on port', PORT)
        keepAlive()
    })
}

function keepAlive() {
    const url = `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`
    if (/(\/\/|\.)undefined\./.test(url)) return
    setInterval(() => {
        fetch(url).catch(console.error)
    }, 30 * 1000)
}

export default connect
