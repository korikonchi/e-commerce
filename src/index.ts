import express, { Application } from 'express'
import 'express-async-errors'
import Server from './server'
import { email } from './globals/helpers/email'

import path from 'path'
import dotenv from 'dotenv'

const env = process.env.NODE_ENV

if (env === 'development') {
  const pathFile = path.resolve(__dirname, '../.env.dev')
  dotenv.config({ path: pathFile })
} else {
  dotenv.config()
}

class ShopApplication {
  public run(): void {
    const app: Application = express()
    const server: Server = new Server(app)

    server.start()
  }
}

const shopApplication: ShopApplication = new ShopApplication()

shopApplication.run()
