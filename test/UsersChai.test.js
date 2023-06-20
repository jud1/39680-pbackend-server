import 'dotenv/config.js'
import connectDB from '../src/config/mongoose.js'
import chai from "chai"

connectDB()
// Dinamic import (DAO)
const path = process.env.SELECTEDBD === '1' 
   ? '../src/models/mongodb/users.model.js' 
   : '../src/models/sequelize/users.model.js'

const importedModule = await import(path)
const usersModel = importedModule.default

const expect = chai.expect

describe('Test with chai for users', () => {
   before ( function() {
      /* this. */
   })
   beforeEach ( function() {
      /* this */
   })

   it('Get my users from bbdd', async function () {
      const response = await usersModel.find()
      expect(Array.isArray(response)).to.be.ok
   })
})