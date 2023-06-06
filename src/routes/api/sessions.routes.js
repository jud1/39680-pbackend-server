import { Router } from 'express'
import { registerUser, loginUser, getSimpleUser, resetPassword, setNewPassword } from '../../controllers/sessions.controller.js'
import { current } from '../../utils/authorization.js'

const routerSessions = Router()

routerSessions.post('/register', registerUser)
routerSessions.post('/login', loginUser)
routerSessions.get('/usersimple', current('jwt'), getSimpleUser)
routerSessions.post('/reset-password', resetPassword)
routerSessions.post('/set-new-password', setNewPassword)

export default routerSessions