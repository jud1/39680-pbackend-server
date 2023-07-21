import { Router } from 'express'
import { current, authorizationRole }from '../../utils/authorization.js'
import { getUsers, getUserById, changeRole, switchRole, putDocument, deleteInactiveUsers } from '../../controllers/users.controller.js'
import upload from '../../utils/multer.js'

const routerUsers = Router()

routerUsers.get('/', current('jwt'), authorizationRole('admin'), getUsers)
routerUsers.get('/:id', current('jwt'), authorizationRole('admin'), getUserById)
routerUsers.put('/premium/:uid', current('jwt'), authorizationRole('admin'), changeRole)
routerUsers.put('/switch-rol', current('jwt'), authorizationRole('admin'), switchRole)
routerUsers.post('/documents', current('jwt'), upload.single('file'), putDocument)
routerUsers.delete('/', current('jwt'), authorizationRole('admin'), deleteInactiveUsers)

export default routerUsers