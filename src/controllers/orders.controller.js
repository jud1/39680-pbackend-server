import { createOrder, findOrder, findAllOrders, updateOrder } from "../services/orders.service.js"

const getOrder = async (req, res) => {
   try {
      const order = await findOrder(req.params.id)
      res.status(200).send(order)
   }
   catch (error) {
      res.status(500).send('Error getting order', error)
   }
}

const getOrders = async (req, res) => {
   try {
      const orders = await findAllOrders(req.query)
      res.status(200).send(orders)
   }
   catch (error) {
      res.status(500).send('Error getting orders', error)
   }
}

const postOrder = async (req, res) => {
   try {
      const newOrder = await createOrder(req.user)
      res.status(200).send(newOrder)
   }
   catch (error) {
      res.status(500).send('Error creating order', error)
   }
}

const putOrder = async (req, res) => {
   try {
      const switcher = 0
      const testParams = {
         status: switcher === 1 ? 'created' : 'cancelled',
      } 
      const newOrder = await updateOrder(req.params.id, testParams)
      res.status(200).send(newOrder)
   }
   catch (error) {
      res.status(500).send('Error updating order', error)
   }
}

export { postOrder, getOrder, getOrders, putOrder }