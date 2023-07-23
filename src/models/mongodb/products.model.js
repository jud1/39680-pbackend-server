import { Schema, model } from 'mongoose'
import mongoosePaginate from "mongoose-paginate-v2"

const productsSchema = new Schema({
   name: {
      type: String,
      require: true,
   },
   description: {
      type: String,
      require: true,
   },
   sku: {
      type: String,
      require: true,
      unique: true
   },
   price: {
      type: Number,
      require: true
   },
   stock: {
      type: Number,
      require: true
   },
   status: {
      type: Boolean,
      default: true
   },
   category: {
      type: String,
      default: 'default'
   },
   owner: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true
   }
})

productsSchema.plugin(mongoosePaginate)

const productsModel = model('Products', productsSchema)

export default productsModel