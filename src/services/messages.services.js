// Dinamic import (DAO)
const path = process.env.SELECTEDBD === '1' ? '../models/mongodb/messages.model.js' : '../models/sequelize/messages.model.js'

const importedModule = await import(path)
const messagesModel = importedModule.default

// Create one
const createMessage = async (message) => {
   try {
      const newMessage = new messagesModel(message)
      await newMessage.save()
      return newMessage
   }
   catch(error) {
      return error
   }
}

const findMessages = async (queryParams) => {
   let { limit, page, sort, ...query } = queryParams
   !limit && (limit = 10)
   !page && (page = 1)
   sort = queryParams.sort ? [["date", queryParams.sort]] : [["date", "desc"]]

   try {
      const messages = await messagesModel.paginate(query, {limit, page, sort})
      return messages
   }
   catch(error) {
      return error
   }
}

export { createMessage, findMessages }