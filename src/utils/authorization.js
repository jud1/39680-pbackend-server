import passport from "passport"
import { findOrder } from "../services/orders.service.js"
import { findProduct } from "../services/products.services.js"

// General function to return error in to strategy of passport
const current = strategy => {
   return async (req, res, next) => {
      passport.authenticate(strategy, (error, user, info) => {
         if (error) {
            return next(error)
         }
         if(!user) {
            // If exists messages property, return messages, else return info.toString()
            const errorMsg = info && info.messages ? info.messages : 'Unauthorized';
            return res.status(401).json({ error: errorMsg });
         }
         req.user = user
         next()
      }) (req, res, next)
   }
}

const authorizationRole = role => {
   return async (req, res, next) => {
      if(!req.user) {
         return res.status(401).send({error: 'Unauthorized'})
         // return res.send('401')
      }
      if(req.user.role !== role) {
         return res.status(403).send({error: 'User not authorized'})
         // return res.send('403')
      }
      next()
   }
}

const authUserOnGetOrder = (strategy) => {
   return async (req, res, next) => {
      passport.authenticate(strategy, async (error, user, info) => {
         
         const order = await findOrder(req.params.id)
         
         if (error) {
            return next(error)
         }
         if(!user) {
            // If exists messages property, return messages, else return info.toString()
            const errorMsg = info && info.messages ? info.messages : 'Unauthorized'
            return res.status(401).json({ error: errorMsg })
         }
         if(order.purchaser !== user.id) {
            const errorMsg = info && info.messages ? info.messages : 'User not authorized'
            return res.status(403).json({ error: errorMsg })
         }
         req.user = user
         next()
      }) (req, res, next)
   }
}

const authOnCreateProduct = (strategy) => {
   return async (req, res, next) => {
      passport.authenticate(strategy, async (error, user, info) => {
         
         if(!user){
            const errorMsg = info && info.messages ? info.messages : 'Unauthorized'
            return res.status(401).json({ error: errorMsg })
         }
         
         if(user.role !== 'admin' && user.role !== 'premium') {
            return res.status(403).send({error: 'User not authorized'})
         }
         req.user = user
         next()
      }) (req, res, next)
   }
}

const authOnModifyProduct = (strategy) => {
   return async (req, res, next) => {
      passport.authenticate(strategy, async (error, user, info) => {
         
         const product = await findProduct(req.params.id)

         if(!user){
            const errorMsg = info && info.messages ? info.messages : 'Unauthorized'
            return res.status(401).json({ error: errorMsg })
         }
         
         if(user.role !== 'admin' && user.role !== 'premium') {
            return res.status(403).send({error: 'User not authorized'})
         }

         if(user.role === 'premium' && user.id !== product.owner.toString()) {
            return res.status(403).send({error: 'User not authorized'})
         }

         req.user = user
         next()
      }) (req, res, next)
   }
}

const noAddYourProduct = (strategy) => {
   return async (req, res, next) => {
      passport.authenticate(strategy, async (error, user, info) => {
         
         const product = await findProduct(req.body.pid)

         const productOwner = product.owner.toString()
         const userId = user.id

         if(productOwner === userId) {
            return res.status(403).send({error: 'User cant add his own product'})
         }
         
         req.user = user
         next()
      }) (req, res, next)
   }
}

export { current, authorizationRole, authUserOnGetOrder, authOnCreateProduct, authOnModifyProduct, noAddYourProduct }