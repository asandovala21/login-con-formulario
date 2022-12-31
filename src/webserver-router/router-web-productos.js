import { Router } from 'express'
import { webAuth } from '../auth/auth.js'

import path from 'path'

const productosWebRouter = new Router()

productosWebRouter.get('/home', webAuth, (req, res) => {
    res.render(path.join(process.cwd(), '/views/plantillas/productos.hbs'), { nombre: req.session.nombre })
})

productosWebRouter.get('/productos-test', (req, res) => {
    res.sendFile(path.join(process.cwd(), '/views/productos-test.html'))
})

export default productosWebRouter