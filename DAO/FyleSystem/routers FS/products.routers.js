import { Router } from "express";
import ProductManager from '../controllers/products.controllers.js'

const inst = new ProductManager
const router = Router()

router.get('/', async (req,res)=>{
    const productList = await inst.getProducts()
    const {limit} = req.query
    const productosLimit = productList.slice(0,limit)
    res.json({productList:productosLimit})
})

router.get('/:idProduct',async (req,res)=>{
    const {idProduct} = req.params
    const searchedProduct = await inst.getProductsByID(parseInt(idProduct))
    if(searchedProduct){
        res.json({message:'Producto encontrado',searchedProduct})
    } else {
        res.send('Producto no encontrado')
    }
})

router.post('/',async(req,res) =>{
    const productsList = await inst.getProducts()
    if (!req.body.title || !req.body.description || !req.body.code || !req.body.price || !req.body.status || !req.body.stock || !req.body.category || !req.body.thumbnails) {
        res.send('Debes completar todos los campos necesarios para crear un producto. Estos son: title,description,code,price,status,stock,category y thumbnails.');
    } else {
        if(await productsList.find((el) => el.code === req.body.code)){
            res.send(`El producto con el code: ${req.body.code} ya existe.`);
        } else{
        await inst.addProduct(req.body)
        res.send('Producto creado con exito.')
        } 
    }
})

router.delete('/:idProduct',async (req,res)=>{
    const {idProduct} = req.params
    let productoEliminado = await inst.getProductsByID(parseInt(idProduct))
    if (productoEliminado) {
        await inst.deleteProduct(parseInt(idProduct))
        res.send('Producto eliminado con exito')
    } else {
        res.send('Producto a elminar no encontrado en la base de datos.')
    }
})

router.put('/:idProduct',async (req,res)=>{
    const {idProduct} = req.params
    const actualizacion = req.body
    let productoModificado = await inst.getProductsByID(parseInt(idProduct))
    if (productoModificado) {
        await inst.updateProduct(parseInt(idProduct),actualizacion)
        res.send('Producto modificado con exito')
    } else {
        res.send('Producto a modificar no encontrado en la base de datos.')
    }
})

export default router