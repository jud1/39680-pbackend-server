// Dinamic import (DAO)
const path = process.env.SELECTEDBD === '1' ? '../models/mongodb/users.model.js' : '../models/sequelize/users.model.js'

const importedModule = await import(path)
const usersModel = importedModule.default

import { createCart } from './carts.services.js'

// Get all
const findUsers = async () => {
   try {
      const users = await usersModel.find()
      return users
   } catch (error) {
      return error
   }

}

// Get one
const findUserById = async (id) => {
   try {
      const user = await usersModel.findById(id)
      return user
   } catch (error) {
      return error
   }

}

// Find by email
const findUserByEmail = async (email) => {
   try {
      const user = await usersModel.findOne({ email: email })
      return user
   } catch (error) {
      return error
   }

}

// Create one
const createUser = async (user) => {
   try {
      // Create cart 
      const newCart = await createCart()
      // And assing to user
      const newUser = new usersModel({...user, id_cart: newCart._id})
      // Save the user
      await newUser.save()
      // Return the user
      return newUser
   } catch (error) {
      return error
   }
}

const generateCodeResetPassword = async (email, token) => {
   try {
      const updates = { 
         reset_token: {
            token: token, 
            expiration: Date.now() + 3600000
         }
      }
      const user = await usersModel.updateOne({ email: email }, { $set: updates })
      return user
   }
   catch (error) {
      return error
   }
}

const updatePassword = async (email, password) => {
   try {
      const updates = {
         password: password,
         reset_token: {
            token: null, 
            expiration: null
         }
      }
      const user = await usersModel.updateOne({ email: email }, { $set: updates })
      return user
   }
   catch (error) {
      return error
   }
}

export { findUsers, findUserById, findUserByEmail, createUser, generateCodeResetPassword, updatePassword }