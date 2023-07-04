import { findUsers, findUserById, uploadDocument } from "../services/users.services.js";

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

const putDocument = async(req, res) => {
    try {
        const upload = await uploadDocument(req.user.id, { name: req.body.name, reference: req.body.link })
        res.status(200).send(upload)
    }

    catch (error) {
        res.status(500).send(error)
    }
}

export { getUsers, getUserById, changeRole, putDocument }