import { Router } from 'express'
import { current, authorizationRole, noAddYourProduct } from '../../utils/authorization.js'

import { getCartById, getMyCart, getAllCarts, addProductOnCart, removeProductCart, deleteAllProductsFromCart, updateProduct, updateProducts } from '../../controllers/carts.controller.js'

const routerCarts = Router()

//* Get all [Admin]
routerCarts.get('/', current('jwt'), authorizationRole('admin'), getAllCarts)

//* Get specific cart [Admin]
routerCarts.get('/cart/:id', current('jwt'), authorizationRole('admin'), getCartById)

//* Get my cart [Current, any user logged]
routerCarts.get('/mycart/', current('jwt'), getMyCart)

//* Add product to cart [Current, any user logged]
routerCarts.post('/product/:id', current('jwt'), noAddYourProduct('jwt'), addProductOnCart)

//* Update cart products [Current, any user logged]
routerCarts.put('/', current('jwt'), updateProducts)

//* Update product quantity [Current, any user logged]
routerCarts.put('/product/:id', current('jwt'), updateProduct)

//* Remove product from cart [Current, any user logged]
routerCarts.delete('/product/:id', current('jwt'), removeProductCart)

//* Empty cart [Current, any user logged]
routerCarts.delete('/', current('jwt'), deleteAllProductsFromCart)

export default routerCarts

//? Legacy
/* // Get an specific cart [Admin]
routerCarts.get('/cart/:id', current('jwt'), authorizationRole('admin'), getCartById) */
/* routerCarts.put('/:id/product/:pid', putProductOnCart)
routerCarts.delete('/:id/product/:pid', deleteProductFromCart) */