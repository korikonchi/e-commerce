import { Response } from 'express'

/**
 *
 *
 * @export
 * @param {Response} res
 * @param {string} accessToken
 */
export function sendTokenToCookie(res: Response, accessToken: string) {
  res.cookie('accessToken', accessToken, {
    maxAge: 1000 * 60 * 10,
    httpOnly: true,
    secure: false
  })
}
