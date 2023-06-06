import { Router } from 'express'
import { current, authorizationRole }from '../../utils/authorization.js'
import { getUsers, getUserById, changeRole } from '../../controllers/users.controller.js'

const routerUsers = Router()

routerUsers.get('/', current('jwt'), authorizationRole('admin'),getUsers)
routerUsers.get('/:id', current('jwt'), authorizationRole('admin'), getUserById)
routerUsers.put('/premium/:uid', current('jwt'), authorizationRole('admin'), changeRole)

export default routerUsers