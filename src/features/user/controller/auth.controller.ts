import { NextFunction, Request, Response } from 'express'
import { HTTP_STATUS } from '~/globals/constants/http'
import { sendTokenToCookie } from '~/globals/helpers/cookie'
import { authService } from '~/services/db/auth.service'

class AuthController {
  public async registerUser(req: Request, res: Response) {
    const accessToken = await authService.addUser(req.body)

    sendTokenToCookie(res, accessToken)

    res.status(HTTP_STATUS.CREATED).json({
      message: 'User registered successfully!'
    })
  }

  public async loginUser(req: Request, res: Response) {
    const accessToken = await authService.login(req.body)

    sendTokenToCookie(res, accessToken)

    res.status(HTTP_STATUS.CREATED).json({
      message: 'User login successfully!'
    })
  }

  public async loginByGoogle(req: Request, res: Response) {
    const redirectUrl = `${process.env.AUTHORIZATION_URL}?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=profile`

    res.redirect(redirectUrl)
  }

  public async callback(req: Request, res: Response) {
    const { code } = req.query

    const token = await authService.callback(code as string)
    sendTokenToCookie(res, token)

    res.status(HTTP_STATUS.OK).json({
      message: 'token send successfully'
    })
  }

  public async profile(req: Request, res: Response) {
    res.json({ user: (req as any).currentUser })
  }

  public async forgetPassword(req: Request, res: Response) {
    await authService.forgetPassword(req.body.email)

    res.status(HTTP_STATUS.OK).json({
      message: 'Reset password code was sent'
    })
  }

  public async resetPassword(req: Request, res: Response) {
    await authService.resetPassword(req.body)

    res.status(HTTP_STATUS.OK).json({
      message: 'Reset password successfully'
    })
  }
}

export const authController: AuthController = new AuthController()
