import { findUsers, deleteUser, findUserById, findUserByEmail, uploadDocument } from "../services/users.services.js";

const getUsers = async (req, res) => {
    try {
        const users = await findUsers()
        res.status(200).send(users)

    } catch (error) {
        res.status(500).send(error)
    }
}

const getUserById = async (req, res) => {
    try {
        const users = await findUserById(req.params.id)
        res.status(200).send(users)

    } catch (error) {
        res.status(500).send(error)
    }
}

const changeRole = async (req, res) => {
    try {
        const user = await findUserById(req.params.uid)
        user.role === 'user' ? user.role = 'premium' : user.role = 'user'
        await user.save()
        res.status(200).send(user)
    } catch (error) {
        res.status(500).send(error)
    }
}

const switchRole = async (req, res) => {
    try {
        // Check params
        if(!req.body.email || !req.body.role) throw new Error('All params are required')

        const updateUser = await findUserByEmail(req.body.email)
        
        // User not found
        if(!updateUser) throw new Error('User not found')
        // The rol cannot be changed to the same one
        if(updateUser.role === req.body.role) throw new Error('The rol cannot be changed to the same one')
        // The user is an admin
        if(updateUser.role === 'admin') throw new Error('Can change the rol to an admin')
        
        // Success and update the rol
        updateUser.role = req.body.role
        await updateUser.save()
        res.status(200).send(updateUser)

    } catch (error) {
        res.status(500).send({ error: error.message || 'Internal server error' })
    }
}

const putDocument = async(req, res) => {
    try {
        const upload = await uploadDocument(req.user.id, { name: req.body.name, reference: req.file.path})
        res.status(200).send(upload)
    }

    catch (error) {
        res.status(500).send(error)
    }
}

const deleteInactiveUsers = async (req, res) => {
    try {
        const users = await findUsers()
        const noAdminsUsers = users.filter(user => user.role !== 'admin' && user.role !== 'premium')
        const nowPlus = new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) // 2 days
        const inactiveUsers = noAdminsUsers.filter(user => nowPlus > user.last_connection)
        inactiveUsers.forEach(async user => await deleteUser(user._id))

        // inactiveUsers.forEach(async user => await user.remove())
        res.status(200).send(inactiveUsers)
    }

    catch (error) {
        res.status(500).send('500')
    }
}

export { getUsers, getUserById, changeRole, switchRole, putDocument, deleteInactiveUsers }