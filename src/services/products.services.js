import { faker } from '@faker-js/faker';

// Dinamic import (DAO)
const path = process.env.SELECTEDBD === '1' ? '../models/mongodb/products.model.js' : '../models/sequelize/products.model.js'

const importedModule = await import(path)
const productsModel = importedModule.default

// Create one
const createProduct = async (product) => {
   try {
      const newProduct = new productsModel(product)
      await newProduct.save()
      return newProduct
   }
   catch(error) {
      return error
   }
}

// Get one
const findProduct = async (id) => {
   try {
      const product = await productsModel.findById(id)
      return product
   }
   catch(error) {
      return error
   }
}

// Get all
const findProducts = async () => {
   try {
      const products = await productsModel.find()
      return products
   }
   catch(error) {
      return error
   }
}

const findPaginatedProducts = async (queryParams) => {
   let { limit, page, sort, ...query } = queryParams
   !limit && (limit = 10)
   !page && (page = 1)
   sort = queryParams.sort ? [["price", queryParams.sort]] : null

   try {
      const products = await productsModel.paginate(query, {limit, page, sort})
      return products
   }
   catch(error) {
      return error
   }
}

const removeProduct = async (id) => {
   try {
      const product = await productsModel.findByIdAndDelete(id)
      return product
   }
   catch(error) {
      return error
   }
}

const modifyProduct = async (id, product) => {
   try {
      const updatedProduct = await productsModel.findByIdAndUpdate(id, product, {new: true})
      return updatedProduct
   }
   catch(error) {
      return error
   }
}

// Mocks
const findMocksProducts = () => {
   try {
      const products = []
   
      const createRandomProduct = () => {
         return {
            id: faker.datatype.uuid(),
            name: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            sku: faker.datatype.uuid(),
            price: faker.commerce.price(990, 99990, 0),
            stock: faker.finance.amount(10, 50, 0),
            status: faker.datatype.boolean(),
            category: faker.commerce.department() 
         }
      }
   
      Array.from({ length: 100 }).forEach( () => {
         products.push(createRandomProduct())
      })
   
      return products
   }
   catch(error) {
      return error
   }
}

export { findProducts, findPaginatedProducts, findProduct, createProduct, removeProduct, modifyProduct, findMocksProducts}