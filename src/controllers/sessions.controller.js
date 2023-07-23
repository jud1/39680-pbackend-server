import { createUser, findUserByEmail, findUserById, generateCodeResetPassword, updatePassword } from "../services/users.services.js"
import passport from "passport"
import jwt from "jsonwebtoken"
import shortid from "shortid"
import nodemailer from 'nodemailer'
import { validatePassword, createHash } from "../utils/bcrypt.js"
import { setLastConnection } from "../services/users.services.js"

import CustomError from '../helpers/errors/CustomError.js'
import EErrors from '../helpers/errors/enums.js'
import { generateUserErrorInfo, userAlreadyRegisteredErrorInfo } from '../helpers/errors/info.js'

const loginUser = async (req, res, next) => {
   try {
      passport.authenticate('jwt', { session: false }, async (error, user, info) => {
         if (error) {
            CustomError.createError({
               name: 'Error',
               cause: 'Error on authentication on login',
               message: generateUserErrorInfo({ firstname, lastname, email }),
               code: EErrors.AUTH_LOGIN_ERROR
            })
            // return res.status(401).send("Error on token")
         }

         // Token does not exist, so I validate the user
         if (!user) {
            const { email, password } = req.body
            const userBDD = await findUserByEmail(email)

            if (!userBDD || !validatePassword(password, userBDD.password)) {
               return res.status(401).send("Not valid credentials")
            }

            // User valid, so i create the token
            const token = jwt.sign(
               { user: { id: userBDD._id } }, 
               process.env.JWT_SECRET
            )
            
            // I send the token to the client
            res.cookie('jwt', token, { 
               httpOnly: true, 
               secure: false, 
               signed: true, 
               expires: new Date(Date.now() + 60 * 60 * 1000 * Number(process.env.JWT_EXPIRES_IN_HOURS)) 
            })

            // Set Last connection
            await setLastConnection(userBDD.email)

            return res.status(200).json({ token })

         }

         // Token exist, so i validate the token
         else {
            // const token = req.cookies.jwt; // error: undefined
            const token2 = req.signedCookies.jwt
            jwt.verify(token2, process.env.JWT_SECRET, async (error, decodedToken) => {
               if (error) {
                  // Token no valido
                  return res.status(401).send("Not valid credentials")
               } else {
                  // Token valido
                  req.user = user
                  
                  // Set Last connection
                  await setLastConnection(req.user.email)

                  console.log(req.user)
                  return res.status(200).send("Valid credentials")
               }
            })
         }

      })(req, res, next)
   }
   catch (error) {
      res.status(error.code).send(error.message)
   }
}

const registerUser = async (req, res) => {
   try {
      const { firstname, lastname, email, password } = req.body
      const userBDD = await findUserByEmail(email)

      if (!firstname || !lastname || !email || !password) {
         CustomError.createError({
            name: 'Error',
            cause: 'Invalid data',
            message: generateUserErrorInfo({ firstname, lastname, email }),
            code: EErrors.INVALID_TYPES_ERROR
         })
      }

      if (userBDD) {
         CustomError.createError({
            name: 'Error',
            cause: 'Existing email in database',
            message: userAlreadyRegisteredErrorInfo({ email }),
            code: EErrors.ALREADY_REGISTERED_ERROR
         })
      } 
      else {
         const hashPassword = createHash(password)
         const newUser = await createUser({ firstname, lastname, email, password: hashPassword})

         const token = jwt.sign(
            { user: { id: newUser._id } }, 
            process.env.JWT_SECRET
         )
         
         // I send the token to the client
         res.cookie('jwt', token, 
            { httpOnly: true, secure: false, signed: true, expires: new Date(Date.now() + 3600000) }
         )

         return res.status(200).json({ token })
      }


   } 
   catch (error) {
      res.status(error.code).send(error.message)
   }

}

const getSimpleUser = async (req, res) => {
   try {
      const simpleUser = {
         firstname: req.user.firstname,
         avatar: req.user.avatar,
      }
      res.status(200).send(simpleUser)
   }
   catch (error) {
      res.status(500).send('Error getting data', error)
   }
}

const logoutUser = async (req, res) => {
   try {
      // Obtengo el token desde la cookie
      const token = req.signedCookies.jwt

      // Si no hay token, envío un error 401
      if (!token) {
         return res.status(401).send("Token not found")
      }
      
      // get the user from the token
      const user = jwt.verify(token, process.env.JWT_SECRET)
      const userId = user.user.id
      const userBBDD = await findUserById(userId)

      
      // Elimino la cookie del token
      res.clearCookie("jwt")
      
      // Set Last connection
      await setLastConnection(userBBDD.email)

      // remove the autorization from the header
      req.headers.authorization = null

 
      // Envío una respuesta exitosa
      return res.status(200).send("Logout success")
   } 
   catch (error) {
      // Si ocurre algún error, envío un error 500 con el mensaje del error
      res.status(500).send(`Error on logout: ${error}`)
   }
}

const resetPassword = async(req, res) => {
   try {
      const email = req.body.email
      const token = shortid.generate() 
      await generateCodeResetPassword(email, token)

      // Nodemailer: options
      const transporter = nodemailer.createTransport({
         service: 'gmail',
         port: 587,
         auth: {
            user: process.env.GMAILSENDERUSER,
            pass: process.env.GMAILSENDERPASS
         }
      })

      // Nodemailer: send
      await transporter.sendMail({
         from: process.env.GMAILSENDERUSER,
         to: email,
         subject: 'Reset password',
         html: `
            <h1>Your code to reset the password is:</h1>
            <p>${token}</p>
         `
      })
      
      return res.status(200).send('Token sent')
   }
   catch (error) {
      res.status(500).send(error)
   }
}

const setNewPassword = async(req, res) => {
   try {
      const email = req.body.email
      const token = req.body.token
      const newPassword = req.body.newPassword

      if(!email || !token || !newPassword) {
         return res.status(400).send('Invalid data')
      }

      const userBDD = await findUserByEmail(email)
      
      if(!userBDD) {
         return res.status(400).send('User not found')
      }

      if(userBDD.reset_token.token !== token) {
         return res.status(401).send('Invalid token')
      }

      if(userBDD.reset_token.expiration < Date.now()) {
         return res.status(401).send('Token expired')
      }

      const hashPassword = createHash(newPassword)
      await updatePassword(email, hashPassword)
      
      return res.status(200).send('The password has been updated successfully')
   }
   catch (error) {
      res.status(500).send(error)
   }
}

export { loginUser, registerUser, getSimpleUser, logoutUser, resetPassword, setNewPassword }