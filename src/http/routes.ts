import express from 'express'
import { AuthController } from '../controllers/AuthController'
import { UserController } from '../controllers/UserController'

const router = express.Router()

// User routes
router.post('/user/create', new UserController().create)
router.put('/user/update/:lastEmail', new UserController().update)
router.delete('/user/delete/:email', new UserController().delete)

// Auth routes
router.post('/auth', new AuthController().SignIn)

export default router
