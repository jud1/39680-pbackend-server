import 'dotenv/config.js'
import connectDB from '../src/config/mongoose.js'
import chai from "chai"
import supertest from "supertest"
import { findUsers, findUserByEmail, deleteUser } from '../src/services/users.services.js'
import { createProduct, removeProduct as deleteProduct } from '../src/services/products.services.js'
import { deleteCart, findCart, addProduct, removeProduct } from '../src/services/carts.services.js'

const expect = chai.expect
const requester = supertest('http://localhost:8000')

connectDB()

describe('Testing app', () => {
   describe('Test for users/sessions', () => {
      // Protected rute, need to user service
      it('Test for get all users from bbdd', async function () {
         const response = await findUsers()
         expect(response).to.be.an('array')
      })

      it('Test endpoint to create a user', async function() {
         const newUser = {
            firstname: "Testing",
            lastname: "User",
            email: "testing@user.com",
            password: "1234"
         }
         const {statusCode, ok, _body} = await requester.post('/api/sessions/register/').send(newUser)
         /* console.log(statusCode, ok, _body) */
      })

      // Protected rute, need to user service
      it('Test endpoint to delete a user', async function() {
         const prevUser = await findUserByEmail('testing@user.com')
         const { id_cart, id } = prevUser
         const response = await deleteUser(id)
         const responseCart = await deleteCart(id_cart)
         /* console.log(response, responseCart) */
      })
   })
   describe('Test for products', () => {
      it('Test for get all products from bbdd', async function () {
         const {statusCode, ok, _body} = await requester.get('/api/products/')
         /* console.log(statusCode, ok, _body) */
      })
      it('Test for get one product from bbdd', async function () {
         const {statusCode, ok, _body} = await requester.get('/api/products/644be77fa839c7c99b9529fb')
         /* console.log(statusCode, ok, _body) */
      })
      it('Test for create a product', async function () {
         const newProduct = {
            name: "Testing",
            description: "Testing product",
            price: 20,
            stock: 10,
            sku: "666",
            owner: '64555e84b9cc04fb62fb28a9',
         }
         
         const response = await createProduct(newProduct)

         // Delete product at the same time
         const { id } = response
         await deleteProduct(id)

      })
   })
   describe('Test for carts', () => {
      it('Test for get one cart from bbdd', async function () {
         const response = await findCart('64555e83b9cc04fb62fb28a7', false)
         /* console.log(response) */
      })
      it('Test for add product on this cart', async function () {
         const response = await addProduct('64555e83b9cc04fb62fb28a7', '644be77fa839c7c99b9529fb')
         /* console.log(response) */
      })
      it('Test for remove product on this cart', async function () {
         const response = await removeProduct('64555e83b9cc04fb62fb28a7', '644be77fa839c7c99b9529fb')
         /* console.log(response) */
      })
   })
})