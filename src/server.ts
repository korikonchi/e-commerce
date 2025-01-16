import express, { Application, NextFunction, Request, Response } from 'express'
import cookieParser from 'cookie-parser'
import appRoutes from './globals/routes/appRoutes'
import { CustomError, IError, NotFoundException } from './globals/middlewares/error.middleware'
import { HTTP_STATUS } from './globals/constants/http'
import { MulterError } from 'multer'
import cors from 'cors'
import { sessionConfig } from './sessionRedis'
import helmet from 'helmet'
import { doubleCsrfProtection, limiter } from './csrf'

class Server {
  private app: Application

  constructor(app: Application) {
    this.app = app
  }

  public start(): void {
    this.setupMiddleware()
    this.getCSRFToken()
    this.setupRoutes()
    this.setupGlobalError()
  }

  private setupMiddleware(): void {
    this.app.use(limiter)
    this.app.use(cors({ credentials: true, methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] }))
    this.app.use(helmet())
    this.app.use(sessionConfig)
    this.app.use(cookieParser())
    this.app.use(express.json())
    this.app.use(doubleCsrfProtection)
    this.app.use('/images', express.static('images'))
  }

  private getCSRFToken(): void {
    this.app.get('/csrf-token', (req, res) => {
      const csrfToken = req.csrfToken?.()
      res.json({ csrfToken })
    })
  }

  private setupRoutes(): void {
    appRoutes(this.app)
  }

  private setupGlobalError(): void {
    // Not Found
    this.app.all('*', (req, res, next) => {
      return next(new NotFoundException(`The url ${req.originalUrl} not found`))
    })

    // Global
    this.app.use((error: IError | MulterError, req: Request, res: Response, next: NextFunction) => {
      console.log('check error: ', error)
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json(error.getErrorResponse())
      }

      if (error instanceof MulterError) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          status: 'error',
          statusCode: HTTP_STATUS.BAD_REQUEST,
          message: error.message
        })
      }

      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error })
    })
  }
}

export default Server
