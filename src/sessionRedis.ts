import { RedisStore } from 'connect-redis'
import redisCache from './services/cache/redis.cache'
import session from 'express-session'

const sessionSecret = process.env.SESSION_SECRET!

// Configura el almacenamiento de sesiones con Redis
const clientRedis = new redisCache().client

const redisStore = new RedisStore({
  client: clientRedis,
  prefix: 'backend:sess:' // Prefijo para las claves de sesión en Redis
})

// Configura express-session
export const sessionConfig = session({
  store: redisStore,
  secret: sessionSecret,
  resave: false, // Evita guardar la sesión si no ha cambiado
  saveUninitialized: true, // Evita guardar sesiones no inicializadas
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Solo enviar cookies sobre HTTPS en producción
    httpOnly: true, // Evita acceso a la cookie desde JavaScript
    sameSite: 'strict', // Previene ataques CSRF
    maxAge: 1000 * 60 * 2
  },
  name: 'backend.sid', // Nombre de la cookie de sesión
  rolling: true, // Renueva la cookie en cada solicitud
  unset: 'destroy' // Destruye la sesión cuando se elimina
})
