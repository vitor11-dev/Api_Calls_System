import express from 'express'
import { AuthController } from '../controllers/AuthController'
import { CallController } from '../controllers/CallController'
import { ClientController } from '../controllers/ClientController'
import { UserController } from '../controllers/UserController'
import { AuthMiddleware } from '../middlewares/auth'

const router = express.Router()

// User routes
router.post('/user/create', new UserController().create)
router.put('/user/update/:email', AuthMiddleware, new UserController().update)
router.delete(
  '/user/delete/:email',
  AuthMiddleware,
  new UserController().delete
)

// Call routes
router.post('/call/create', AuthMiddleware, new CallController().create)
router.put('/call/update/:id', AuthMiddleware, new CallController().update)
router.get('/calls/:id', AuthMiddleware, new CallController().getCalls)

// Client routes
router.post('/client/create', AuthMiddleware, new ClientController().create)
router.get('/clients/:id', AuthMiddleware, new ClientController().getClients)

// Auth routes
router.post('/auth', new AuthController().SignIn)

export default router
