import express from 'express'
import session from 'express-session'
import MongoStore from 'connect-mongo'

import config from './config.js'

import { Server as HttpServer } from 'http'
import { Server as Socket } from 'socket.io'

import authWebRouter from './webserver-router/router-web-author.js'
import productosWebRouter from './webserver-router/router-web-productos.js'
import productosApiRouter from './api-router/productos.js'

import addProductosHandlers from './websocket/productos.js'
import addMensajesHandlers from './websocket/mensajes.js'

// servidor, websocket, api

const app = express()
const httpServer = new HttpServer(app)
const io = new Socket(httpServer)

// configuración websocket

io.on('connection', async socket => {
    addProductosHandlers(socket, io.sockets)
    addMensajesHandlers(socket, io.sockets)
});

// middleware

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.set('view engine', 'hbs');

//session
app.use(session({
    //mongodb
    // store: MongoStore.create({ mongoUrl: config.mongoLocal.cnxStr }),
    //mongoatlas
    store: MongoStore.create({ mongoUrl: config.mongoRemote.cnxStr }),
    secret: 'shhhhhhhhhhhhhhhhhhhhh',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: 60000
    }
}))


// rutas API REST

app.use(productosApiRouter)


// rutas servidor web

app.use(authWebRouter)
app.use(productosWebRouter)

// conexión servidor

const connectedServer = httpServer.listen(config.PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))
