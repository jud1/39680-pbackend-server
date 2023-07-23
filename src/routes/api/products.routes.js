import { Router } from 'express'
import { current, authorizationRole, authOnCreateProduct, authOnModifyProduct } from '../../utils/authorization.js'
import { getProducts, getPaginatedProducts, getProduct, postProduct, deleteProduct, updateProduct } from '../../controllers/products.controller.js'

const routerProducts = Router()

routerProducts.get('/', getPaginatedProducts)
routerProducts.get('/:id', getProduct)
routerProducts.post('/', current('jwt'), authOnCreateProduct('jwt'), postProduct)
routerProducts.delete('/:id', current('jwt'), authOnModifyProduct('jwt'), deleteProduct)
routerProducts.put('/:id', current('jwt'), authOnModifyProduct('jwt'), updateProduct)

export default routerProducts