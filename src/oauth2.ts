import jwt from 'jsonwebtoken'
import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET!

export class OauthService {
  // Generar un token JWT
  static generateToken(payload: any): string {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN!
    })
  }

  // Verificar un token JWT
  static verifyToken(token: string): any {
    return jwt.verify(token, JWT_SECRET)
  }

  static async getAccessToken(code: string) {
    try {
      const response = await axios.post(
        process.env.TOKEN_URL!,
        {
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          code,
          redirect_uri: process.env.REDIRECT_URI,
          grant_type: 'authorization_code'
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      )

      return response.data
    } catch (error) {
      console.error('Error al obtener el token de acceso:', error)
      throw new Error('Failed to fetch access token')
    }
  }

  static async getUserInfo(accessToken: string): Promise<any> {
    const response = await axios.get(`${process.env.USER_INFO_URL!}?id_token=${accessToken}`)
    return response.data
  }
}
