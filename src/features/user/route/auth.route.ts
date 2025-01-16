import express from 'express'
import { validateSchema } from '~/globals/middlewares/validate.middleware'
import { userSchemaCreate, userSchemaLogin } from '../schema/user.schema'
import { asyncWrapper } from '~/globals/middlewares/error.middleware'
import { authController } from '../controller/auth.controller'
import { verifyUser } from '~/globals/middlewares/auth.middleware'

const authRoute = express.Router()

authRoute.post('/register', validateSchema(userSchemaCreate), authController.registerUser)
authRoute.post('/login', validateSchema(userSchemaLogin), authController.loginUser)

authRoute.get('/login', authController.loginByGoogle)
authRoute.get('/callback', authController.callback)

authRoute.get('/profile', verifyUser, authController.profile)

// authRoute.post('/logout', authController.logout)
authRoute.post('/forget-password', authController.forgetPassword)
authRoute.post('/reset-password', authController.resetPassword)

export default authRoute
