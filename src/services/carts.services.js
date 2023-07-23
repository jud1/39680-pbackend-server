// Dinamic import (DAO)
const path = process.env.SELECTEDBD === '1' ? '../models/mongodb/carts.model.js' : '../models/sequelize/carts.model.js'
const importedModule = await import(path)
const cartsModel = importedModule.default

const pathProducts = process.env.SELECTEDBD === '1' ? '../models/mongodb/products.model.js' : '../models/sequelize/products.model.js'
const importedModuleProducts = await import(pathProducts)
const productsModel = importedModuleProducts.default

// Create one
const createCart = async () => {
   try {
      const newCart = new cartsModel()
      await newCart.save()
      return newCart
   }
   catch (error) {
      return error
   }
}

const deleteCart = async (id) => {
   try {
      const cart = await cartsModel.findByIdAndDelete(id)
      return cart
   }
   catch (error) {
      return error
   }
}

const findCart = async (id, isPopulate=true) => {
   try {
      const cart = await cartsModel.findById(id)
      if (isPopulate) {
         const cartPopulate = await cart.populate('products.product')
         return cartPopulate
      }
      else {
         return cart
      }
   }
   catch (error) {
      return error
   }
}

const findCarts = async () => {
   try {
      const carts = await cartsModel.find();
      const populatedCarts = await Promise.all(
         carts.map(async cart => {
            const populatedCart = await cart.populate('products.product')
            return populatedCart
         })
      )
      return populatedCarts
   } 
   catch (error) {
      return error
   }
}

const addProduct = async (id, product) => {
   try {
      const cart = await cartsModel.findById(id)
      const exixstingProduct = cart.products.some(item=>item.product.toString() === product )
      const productLiteral = await productsModel.findById(product)

      // Doesn't exist
      if(!exixstingProduct) cart.products.push({ product, quantity: 1 })
      
      // Exists, add quantity
      else cart.products.map(item => item.product.toString() === product ? item.quantity++ : false)

      // If the quantity amount overpass the stock
      if ( ( cart.products.find(item => item.product.toString() === product) ).quantity > productLiteral.stock ) {
         // EXIT RETURN [only IF]
         throw new Error('The quantity amount overpass the stock')
      }
      
      await cartsModel.findByIdAndUpdate(id, cart)
      const updatedCart = await cartsModel.findById(id)
      
      return updatedCart
   }
   catch (error) {
      return error
   }
}

const removeProduct = async (id, product) => {
   try {
      const cart = await cartsModel.findById(id)

      // Exit prevent to execute services if product doesn't exist
      if (cart.products.every(item=>item.product.toString()!==product)) return 'Product not found'

      // Move on
      const updateProducts = cart.products.filter(item=>item.product.toString()!==product)

      await cartsModel.findByIdAndUpdate(id, {products: updateProducts})
      const updatedCart = await cartsModel.findById(id)

      return updatedCart
   }
   catch (error) {
      return error
   }
}

const emptyCart = async id => {
   try {
      await cartsModel.findByIdAndUpdate(id, { products: [] })
      const updatedCart = await cartsModel.findById(id)
      return updatedCart
   }
   catch (error) {
      return error
   }
}

const modifyQuantity = async (cid, pid, quantity) => {
   try {
      
      //* Sets
      const product = await productsModel.findById(pid)
      const name = product.name
      const cart = await cartsModel.findById(cid)
      
      //! Errors
      if (typeof quantity !== 'number' || quantity % 1 !== 0 || quantity < 0) throw new Error(`Quantity of product ${name} must be a not decimal positive number`)
      
      if (quantity > product.stock) throw new Error(`Cant add more than ${product.stock} units of product ${name}`)

      if (quantity === 0 && cart.products.every(item => item.product.toString() !== pid)) throw new Error(`Cant remove the product because ${name} is not in the cart`)

      //* Actions
      if (cart.products.every(item => item.product.toString() !== pid)) {
         cart.products.push({ product: pid, quantity: quantity })
      }

      else if (quantity === 0) {
         cart.products = cart.products.filter(item => item.product.toString() !== pid)
      } 
      
      else if (quantity >= 1 && quantity <= product.stock) {
         cart.products.map(item => item.product.toString() === pid ? item.quantity = quantity : false)
      }
     
      //* Updates
      await cartsModel.findByIdAndUpdate(cart, cart)

      //* Response
      const updateCart = cart.products.find(item => item.product.toString() === pid)
      return quantity === 0 ? `Product ${name} removed from cart` : `Product ${name} quantity updated to ${updateCart.quantity}`
   }
   catch (error) {
      return error.message
   }
}

const modifyProducts = async (cid, update) => {
   try {
      const responses = await Promise.all(update.map(async item => {
         return await modifyQuantity(cid, item.product, item.quantity)
      }))

      return responses
   }
   catch (error) {
      return error
   }
}


export { createCart, deleteCart, findCart, findCarts, addProduct, removeProduct, emptyCart, modifyQuantity, modifyProducts }