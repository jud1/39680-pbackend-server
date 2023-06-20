import 'dotenv/config.js'
import connectDB from '../src/config/mongoose.js'
import Assert from 'assert'
import { createUser } from '../src/services/users.services.js'

connectDB()
const assert = Assert.strict

// Dinamic import (DAO)
const path = process.env.SELECTEDBD === '1' 
   ? '../src/models/mongodb/users.model.js' 
   : '../src/models/sequelize/users.model.js'

const importedModule = await import(path)
const usersModel = importedModule.default

describe('Testing Users', () => {
   
   /* before(function () {
      console.log('no dao class yet')
   }) */

   /* beforeEach(function () {
      console.log('no dao class yet')
   }) */

   it('Get my users from bbdd', async function () { 
      const response = await usersModel.find() 
      assert.strictEqual(Array.isArray(response), true)
   })

   it('Create user in bbdd', async function () {
      const newUser = {
         firstname: "Pepe",
         lastname: "Perez",
         email: "pepe@pepe.com",
         password: "1234",
      }
      const result = await createUser(newUser)
   })

   it('Get user by email', async function () {
      const email = "pepe@pepe.com"
      const user = await usersModel.findOne({ email: email })
      assert.strictEqual(typeof user, 'object')
   })

}) 