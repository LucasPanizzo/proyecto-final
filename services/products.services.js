import { getProducts,getProductsByID,addProduct,deleteProduct,updateProduct } from "../DAO/Persistences/ProductsPersistence.js";

export async function getProductsService(limit, page, sort, query){
    const products = await getProducts(limit, page, sort, query)
    return products
}

export async function getProductsByIDService(productID){
    const product = await getProductsByID(productID)
    return product
}

export async function addProductService(product){
    const newProduct = await addProduct(product)
    return newProduct
}

export async function deleteProductService(productID){
    const deletedProduct = await deleteProduct(productID)
    return deletedProduct
}

export async function updateProductService(productID, act){
    const updatedProduct = await updateProduct(productID, act)
    return updatedProduct
}