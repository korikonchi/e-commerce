import express, { Application } from 'express'
import 'express-async-errors'
import Server from './server'
import { email } from './globals/helpers/email'
import path from 'path'
import dotenv from 'dotenv'
import https from 'https'
import fs from 'fs'
import { startConsumer } from './kafka'

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

    const options = {
      key: fs.readFileSync(path.resolve(__dirname, '../certificates/key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, '../certificates/cert.pem'))
    }

    const httpsServer = https.createServer(options, app)

    const port = parseInt(process.env.PORT!) || 5050

    process.env.NODE_ENV !== 'development' && startConsumer(process.env.KAFKA_TOPIC || 'my-topic')

    httpsServer.listen(port, () => {
      console.log(`server listener on port ${port}`)
    })

    server.start()
  }
}

const shopApplication: ShopApplication = new ShopApplication()
shopApplication.run()
