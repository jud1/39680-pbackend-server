import { Router } from 'express'
import { getMocksProducts } from "../../controllers/products.controller.js"

const routerTest = Router()

routerTest.get('/mocksproducts/', getMocksProducts)
routerTest.get('/test-logs', (req, res) => {
   req.logger.error('Test')
   req.logger.warn('Test')
   req.logger.info('Test')
   req.logger.debug('Test')

   // Res send default to endpoint
   res.send('test loggers')
})

export default routerTest