import { Router } from 'express'
import { current, authorizationRole }from '../../utils/authorization.js'
import { getUsers, getUserById, changeRole, putDocument } from '../../controllers/users.controller.js'
import upload from '../../utils/multer.js'

const routerUsers = Router()

routerUsers.get('/', current('jwt'), authorizationRole('admin'), getUsers)
routerUsers.get('/:id', current('jwt'), authorizationRole('admin'), getUserById)
routerUsers.put('/premium/:uid', current('jwt'), authorizationRole('admin'), changeRole)

routerUsers.post('/documents', current('jwt'), upload.single('file'), putDocument)

export default routerUsers