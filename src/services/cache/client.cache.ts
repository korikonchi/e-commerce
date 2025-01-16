import { RedisClientType } from 'redis'
import RedisCache from './redis.cache'

class RedisClient {
  private client: RedisClientType

  /**
   * Constructor que recibe la instancia de Redis por inyección de dependencias.
   * @param client - Instancia de RedisClientType.
   */
  constructor(client: RedisClientType) {
    this.client = client
  }

  // Métodos básicos

  /**
   * Almacena un valor en Redis.
   * @param key - La clave bajo la cual se almacenará el valor.
   * @param value - El valor a almacenar.
   * @param ttl - Tiempo de vida en segundos (opcional).
   *
   * Ejemplo:
   * await redisClient.set('nombre', 'Juan');
   * // Estructura en Redis: { nombre: 'Juan' }
   */
  public async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.setEx(key, ttl, value)
    } else {
      await this.client.set(key, value)
    }
  }

  /**
   * Obtiene un valor de Redis.
   * @param key - La clave del valor a obtener.
   * @returns El valor asociado a la clave, o `null` si no existe.
   *
   * Ejemplo:
   * const nombre = await redisClient.get('nombre');
   * console.log(nombre); // Output: 'Juan'
   */
  public async get(key: string): Promise<string | null> {
    return await this.client.get(key)
  }

  /**
   * Elimina una clave de Redis.
   * @param key - La clave a eliminar.
   *
   * Ejemplo:
   * await redisClient.del('nombre');
   * // Estructura en Redis: {} (la clave 'nombre' ya no existe)
   */
  public async del(key: string): Promise<void> {
    await this.client.del(key)
  }

  /**
   * Establece un tiempo de vida (TTL) para una clave.
   * @param key - La clave a la que se le asignará el TTL.
   * @param ttl - Tiempo de vida en segundos.
   *
   * Ejemplo:
   * await redisClient.set('nombre', 'Juan');
   * await redisClient.expire('nombre', 10); // Expirar en 10 segundos
   * // Estructura en Redis: { nombre: 'Juan' } (expira después de 10 segundos)
   */
  public async expire(key: string, ttl: number): Promise<void> {
    await this.client.expire(key, ttl)
  }

  // Métodos para Hashes (diccionarios)

  /**
   * Almacena un campo y su valor en un hash.
   * @param key - La clave del hash.
   * @param field - El campo dentro del hash.
   * @param value - El valor a almacenar.
   *
   * Ejemplo:
   * await redisClient.hset('usuario:1', 'nombre', 'Carlos');
   * // Estructura en Redis: { 'usuario:1': { nombre: 'Carlos' } }
   */
  public async hset(key: string, field: string, value: string): Promise<void> {
    await this.client.hSet(key, field, value)
  }

  /**
   * Obtiene el valor de un campo en un hash.
   * @param key - La clave del hash.
   * @param field - El campo dentro del hash.
   * @returns El valor del campo, o `null` si no existe.
   *
   * Ejemplo:
   * const nombre = await redisClient.hget('usuario:1', 'nombre');
   * console.log(nombre); // Output: 'Carlos'
   */
  public async hget(key: string, field: string): Promise<string | undefined> {
    return await this.client.hGet(key, field)
  }

  /**
   * Obtiene todos los campos y valores de un hash.
   * @param key - La clave del hash.
   * @returns Un objeto con todos los campos y valores del hash.
   *
   * Ejemplo:
   * await redisClient.hset('usuario:1', 'nombre', 'Carlos');
   * await redisClient.hset('usuario:1', 'edad', '30');
   * const usuario = await redisClient.hgetall('usuario:1');
   * console.log(usuario); // Output: { nombre: 'Carlos', edad: '30' }
   */
  public async hgetall(key: string): Promise<{ [field: string]: string }> {
    return await this.client.hGetAll(key)
  }

  /**
   * Elimina un campo de un hash.
   * @param key - La clave del hash.
   * @param field - El campo a eliminar.
   *
   * Ejemplo:
   * await redisClient.hdel('usuario:1', 'nombre');
   * // Estructura en Redis: { 'usuario:1': { edad: '30' } }
   */
  public async hdel(key: string, field: string): Promise<void> {
    await this.client.hDel(key, field)
  }

  // Métodos para Listas

  /**
   * Agrega un valor al inicio de una lista.
   * @param key - La clave de la lista.
   * @param value - El valor a agregar.
   *
   * Ejemplo:
   * await redisClient.lpush('tareas', 'Hacer la compra');
   * await redisClient.lpush('tareas', 'Llamar al médico');
   * // Estructura en Redis: { 'tareas': ['Llamar al médico', 'Hacer la compra'] }
   */
  public async lpush(key: string, value: string): Promise<void> {
    await this.client.lPush(key, value)
  }

  /**
   * Agrega un valor al final de una lista.
   * @param key - La clave de la lista.
   * @param value - El valor a agregar.
   *
   * Ejemplo:
   * await redisClient.rpush('tareas', 'Pasear al perro');
   * // Estructura en Redis: { 'tareas': ['Llamar al médico', 'Hacer la compra', 'Pasear al perro'] }
   */
  public async rpush(key: string, value: string): Promise<void> {
    await this.client.rPush(key, value)
  }

  /**
   * Obtiene un rango de elementos de una lista.
   * @param key - La clave de la lista.
   * @param start - Índice de inicio.
   * @param stop - Índice de fin.
   * @returns Una lista de valores.
   *
   * Ejemplo:
   * const tareas = await redisClient.lrange('tareas', 0, -1);
   * console.log(tareas); // Output: ['Llamar al médico', 'Hacer la compra', 'Pasear al perro']
   */
  public async lrange(key: string, start: number, stop: number): Promise<string[]> {
    return await this.client.lRange(key, start, stop)
  }

  // Métodos para Conjuntos (Sets)

  /**
   * Agrega un valor a un conjunto.
   * @param key - La clave del conjunto.
   * @param value - El valor a agregar.
   *
   * Ejemplo:
   * await redisClient.sadd('etiquetas', 'redis');
   * await redisClient.sadd('etiquetas', 'db');
   * // Estructura en Redis: { 'etiquetas': ['redis', 'db'] }
   */
  public async sadd(key: string, value: string): Promise<void> {
    await this.client.sAdd(key, value)
  }

  /**
   * Obtiene todos los valores de un conjunto.
   * @param key - La clave del conjunto.
   * @returns Un array con los valores del conjunto.
   *
   * Ejemplo:
   * const etiquetas = await redisClient.smembers('etiquetas');
   * console.log(etiquetas); // Output: ['redis', 'db']
   */
  public async smembers(key: string): Promise<string[]> {
    return await this.client.sMembers(key)
  }

  /**
   * Elimina un valor de un conjunto.
   * @param key - La clave del conjunto.
   * @param value - El valor a eliminar.
   *
   * Ejemplo:
   * await redisClient.srem('etiquetas', 'redis');
   * // Estructura en Redis: { 'etiquetas': ['db'] }
   */
  public async srem(key: string, value: string): Promise<void> {
    await this.client.sRem(key, value)
  }

  // Métodos para Conjuntos Ordenados (Sorted Sets)

  /**
   * Agrega un valor a un conjunto ordenado con una puntuación.
   * @param key - La clave del conjunto ordenado.
   * @param score - La puntuación del valor.
   * @param value - El valor a agregar.
   *
   * Ejemplo:
   * await redisClient.zadd('ranking', 100, 'Juan');
   * await redisClient.zadd('ranking', 200, 'Ana');
   * // Estructura en Redis: { 'ranking': [{ score: 100, value: 'Juan' }, { score: 200, value: 'Ana' }] }
   */
  public async zadd(key: string, score: number, value: string): Promise<void> {
    await this.client.zAdd(key, { score, value })
  }

  /**
   * Obtiene un rango de valores de un conjunto ordenado.
   * @param key - La clave del conjunto ordenado.
   * @param start - Índice de inicio.
   * @param stop - Índice de fin.
   * @param withScores - Si se deben incluir las puntuaciones.
   * @returns Un array de valores (y puntuaciones si `withScores` es `true`).
   *
   * Ejemplo:
   * const ranking = await redisClient.zrange('ranking', 0, -1, true);
   * console.log(ranking); // Output: [{ value: 'Juan', score: 100 }, { value: 'Ana', score: 200 }]
   */
  public async zrange(
    key: string,
    start: number,
    stop: number,
    withScores: boolean = false
  ): Promise<string[] | { value: string; score: number }[]> {
    if (withScores) {
      return await this.client.zRangeWithScores(key, start, stop)
    } else {
      return await this.client.zRange(key, start, stop)
    }
  }

  // Métodos adicionales

  /**
   * Verifica si una clave existe.
   * @param key - La clave a verificar.
   * @returns `true` si la clave existe, `false` si no.
   *
   * Ejemplo:
   * const existe = await redisClient.exists('nombre');
   * console.log(existe); // Output: true
   */
  public async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key)
    return result === 1
  }

  /**
   * Incrementa el valor de una clave (solo para números).
   * @param key - La clave a incrementar.
   * @param increment - El valor a incrementar (por defecto 1).
   * @returns El nuevo valor.
   *
   * Ejemplo:
   * await redisClient.set('contador', '10');
   * await redisClient.incr('contador');
   * const contador = await redisClient.get('contador');
   * console.log(contador); // Output: '11'
   */
  public async incr(key: string, increment: number = 1): Promise<number> {
    return await this.client.incrBy(key, increment)
  }

  /**
   * Decrementa el valor de una clave (solo para números).
   * @param key - La clave a decrementar.
   * @param decrement - El valor a decrementar (por defecto 1).
   * @returns El nuevo valor.
   *
   * Ejemplo:
   * await redisClient.decr('contador', 5);
   * const contador = await redisClient.get('contador');
   * console.log(contador); // Output: '6'
   */
  public async decr(key: string, decrement: number = 1): Promise<number> {
    return await this.client.decrBy(key, decrement)
  }
}

const redisCache: RedisCache = RedisCache.getInstance()

export const redisHandle = new RedisClient(redisCache.client)
