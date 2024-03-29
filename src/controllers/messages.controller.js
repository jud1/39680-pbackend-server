import { createMessage, findMessages } from "../services/messages.services.js"

const getMessages = async(req, res) => {
   try {
      const messages = await findMessages(req.query)
      res.status(200).send(messages)
   }
   catch(error) {
      res.status(500).send('Error getting messages', error)
   }
}

const postMessage = async(req, res) => {
   try {
      const message = req.body.message
      const { id: user_id, email: user_email } = req.user
      await createMessage({ message, user_id, user_email })
      const allMessages = await findMessages(req.query)
      res.status(200).send(allMessages)
   }
   catch(error) {
      res.status(500).send('Error posting message')
   }
}

export { getMessages, postMessage }