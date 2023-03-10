// Imports
import express from 'express'
import ProductManager from './DAO/MongoDB/db/controllers/products.controllers.js'
import messageManager from './DAO/MongoDB/db/controllers/chat.controllers.js'
import cartManager from './DAO/MongoDB/db/controllers/carts.controllers.js'
import { Server } from 'socket.io'
import handlebars from 'express-handlebars'
import views from './routers/views.router.js'
import products from './routers/products.router.js'
import carts from './routers/carts.router.js'
import users from './routers/users.router.js'
import { __dirname } from './utilities.js'
import './DAO/MongoDB/db/dbConfig.js'
import session from 'express-session'
import MongoStore from 'connect-mongo'
// Declarations
const app = express()
const port = 3030
const inst = new ProductManager
const message = new messageManager
const cart = new cartManager
// Server
const httpServer = app.listen(port,()=>{
    console.log('Listening to port '+port);
})
const socketServer = new Server(httpServer)
// Socket configuration


socketServer.on('connection',async(socket)=>{
    console.log('cliente conectado');
    //REALTIME PRODUCTS
        //Funcion que escribe los productos en el DOM
    const products = await inst.getProducts()
    const productsList = products.payload
    socketServer.emit('writeProducts',productsList)
    //Funcion que crea el producto que le llega.
    socket.on('creacionProducto',async(obj)=>{
        const productsList = await inst.getProducts()
        if(await productsList.find((el) => el.code === obj.code)){
            console.log('El producto que quieres agregar ya existe');
        } else{
        await inst.addProduct(obj)
        const productsList = await inst.getProducts()
        socketServer.emit('writeProducts',productsList)
        } 
    })
    //Funcion que elimina un producto en especifico de la DB.
    socket.on('eliminacionProducto',async(id)=>{
        await inst.deleteProduct(id)
        const productsList = await inst.getProducts()
        socketServer.emit('writeProducts',productsList)
    })
    //Funcion que agrega al carrito el producto seleccionado, le marco la id de forma manual, no tiene sentido hacerlo con la herramienta que tengo ahora para que cada vez que se cargue el page se cree un carrito nuevo. Cuando empiece a trabajar con Sessions creare un cart para cada Session en particular.
    socket.on('a??adirAlCarrito',async(id)=>{
        await cart.addToCart("640f8156f6d8813b3d9e580e",id)
    })
    // CHAT 
    socket.on('mensaje',async info=>{
        await message.newMessage(info)
        console.log(info);
        const messages = await message.getMessages()
        socketServer.emit('chat',messages)
    })
})

// Handlebars engine
app.engine('handlebars',handlebars.engine())
app.set('views',__dirname+'/views')
app.set('view engine','handlebars')
// General APP declarations
app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname+'/public'))
app.use('/api/products', products)
app.use('/api/carts', carts)
app.use('/',views)
app.use('/api/users',users)

app.use(
    session({
      secret: 'secretKey',
      resave: false,
      saveUninitialized: true,
      store: new MongoStore({
        mongoUrl: 'mongodb+srv://lucaspanizzo99:Panizzo99@coderhouse.3xliklk.mongodb.net/ecommerce?retryWrites=true&w=majority'
      }),
    })
  )