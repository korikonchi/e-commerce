import express from 'express'
import { kafkaController } from '../controller/kafka.controller'

const kafkaRoute = express.Router()

kafkaRoute.post('/send', kafkaController.sendMessage)

export default kafkaRoute
