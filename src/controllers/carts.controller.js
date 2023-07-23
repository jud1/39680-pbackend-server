import { response } from 'express'
import { createCart, findCart, findCarts, addProduct, removeProduct, emptyCart, modifyProducts, modifyQuantity } from '../services/carts.services.js'

const postCart = async (req, res) => {
   try {
      const newCart = await createCart()
      res.status(200).send(newCart)
   }
   catch (error) {
      res.status(500).send('Error creating cart', error)
   }
}

const getCartById = async (req, res) => {
   try {
      const cart = await findCart(req.params.id)
      res.status(200).send(cart)
   }
   catch (error) {
      res.status(404).send('Error getting cart', error)
   }
}

const getMyCart = async (req, res) => {
   try {
      const cart = await findCart(req.user.id_cart)
      res.status(200).send(cart)
   }
   catch (error) {
      res.status(404).send('Error getting user cart', error)
   }
}

const getAllCarts = async (req, res) => {
   try {
      const carts = await findCarts()
      res.status(200).send(carts)
   }
   catch (error) {
      res.status(403).send('Error getting all cart', error)
   }
}

const addProductOnCart = async (req, res) => {
   try {
      const updatedCart = await addProduct(req.user.id_cart, req.params.id)
      
      if(updatedCart.name === 'Error') {
         const error = JSON.parse(updatedCart.message)
         throw { message: error.message, code: error.code }
      }

      res.status(200).send(updatedCart.products)
   }
   catch (error) {
      res.status(error.code ? error.code : 500).send({ message: error.message})
   }
}

const removeProductCart = async (req, res) => {
   try {
      await removeProduct(req.user.id_cart, req.params.id)
      res.status(200).send(`Product ${req.params.id} removed from your cart`)
   }
   catch (error) {
      res.status(404).send('Error on remove product from cart')
   }
}

const deleteAllProductsFromCart = async (req, res) => {
   try {
      await emptyCart(req.user.id_cart)
      res.status(200).send('Your cart is empty')
   }
   catch (error) {
      res.status(404).send('Error on empty a cart', error)
   }
}

const updateProduct = async (req, res) => {
   try {
      const cart = req.user.id_cart
      const product = req.params.id
      const quantity = req.body.quantity
      const updatedCart = await modifyQuantity(cart, product, quantity)
      res.status(200).send(updatedCart)
   }
   catch (error) {
      res.status(500).send('Error on update product from cart')
   }
}

const updateProducts = async (req, res) => {
   try {
      const cart = req.user.id_cart
      const update = req.body
      const updatedCart = await modifyProducts(cart, update)
      res.status(200).send(updatedCart)
   }
   catch (error) {
      res.status(500).send('Error on update products from cart')
   }
}


export { postCart, getCartById, getMyCart, getAllCarts, addProductOnCart, removeProductCart, deleteAllProductsFromCart, updateProduct, updateProducts }