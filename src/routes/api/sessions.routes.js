import { Router } from 'express'
import { registerUser, loginUser, logoutUser, getSimpleUser, resetPassword, setNewPassword } from '../../controllers/sessions.controller.js'
import { current } from '../../utils/authorization.js'

const routerSessions = Router()

routerSessions.post('/register', registerUser)
routerSessions.post('/login', loginUser)
routerSessions.post('/logout', logoutUser)
routerSessions.get('/usersimple', current('jwt'), getSimpleUser)
routerSessions.post('/reset-password', resetPassword)
routerSessions.post('/set-new-password', setNewPassword)

export default routerSessions