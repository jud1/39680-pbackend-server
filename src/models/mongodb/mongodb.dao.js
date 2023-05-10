import mongoose from "mongoose"
import paginate from "mongoose-paginate-v2"

export class MongodbManager {

   constructor(collection, schema) {
      this.collection = collection
      this.schema = new mongoose.Schema(schema)
      this.schema.plugin(paginate)
      this.model = mongoose.models[this.collection] || mongoose.model(this.collection, this.schema)
   }

   // Arrow function
   getElements = async () => {
      this.setConnection()
      try {
         const elements = await this.model.find()
         return elements
      }
      catch(error) {
         console.log(`MongoDB error on read all elements: ${error}`)
      }
   }

   // Use to test aggregate
   getElementsAggregate = async () => {
      this.setConnection()
      try {
         const elements = await this.model.aggregate([
            { $match: {status: true}}, // match element
            { $sort: {price: 1} } // 1 menor -> mayor / -1 mayor -> menor
         ])
         return elements
      }
      catch(error) {
         console.log(`MongoDB error on read all elements w/ filters: ${error}`)
      }
   }

   getElementById = async id => {
      this.setConnection()
      try {
         const element = await this.model.findById(id)
         return element
      }
      catch(error) {
         console.log(`MongoDB error on get an element: ${error}`)
      }
   }
   
   async addElement(elements) { // Agrega uno o varios elementos
      this.setConnection()
      try {
         const message = await this.model.create(elements)
         message.save()
         return message
      }
      catch(error) {
         console.log(`MongoDB error on create an element(s): ${error}`);
         throw new Error(`MongoDB error on create an element(s): ${error}`);
      }
   }
   
   async addElements(elements) { // Agrega uno o varios elementos
      this.setConnection()
      try {
         const message = await this.model.insertMany(elements)
         return message
      }
      catch(error) {
         console.log(`MongoDB error on create an element(s): ${error}`);
         throw new Error(`MongoDB error on create an element(s): ${error}`);
      }
   }

   async updateElement(id, info) {
      this.setConnection()
      try {
         const message = await this.model.findByIdAndUpdate(id, info)
         return message
      }
      catch(error) {
         console.log(`MongoDB error on update an element: ${error}`)
      }
   }
   
   async deleteElement(id) {
      this.setConnection()
      try {
         const response = await this.model.findByIdAndRemove(id)
         return response
      }
      catch(error) {
         console.log(`MongoDB error on delete an element: ${error}`)
      }
   }
}