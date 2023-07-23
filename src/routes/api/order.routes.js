import { Router } from 'express'
import { current, authorizationRole, authUserOnGetOrder } from '../../utils/authorization.js'
import { postOrder, getOrder, getOrders, putOrder } from '../../controllers/orders.controller.js'

const routerOrders = Router()

routerOrders.get('/', current('jwt'), authorizationRole('admin'), getOrders)
routerOrders.get('/:id', authUserOnGetOrder('jwt'), getOrder)
routerOrders.post('/', current('jwt'), postOrder)
routerOrders.put('/:id', current('jwt'), authorizationRole('admin'), putOrder)

export default routerOrders