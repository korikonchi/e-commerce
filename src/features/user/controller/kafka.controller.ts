import { Request, Response } from 'express'
import { sendMessage } from '~/kafka'

class KafkaController {
  public async sendMessage(req: Request, res: Response) {
    const { message } = req.body
    await sendMessage(process.env.KAFKA_TOPIC || 'my-topic', message)
    res.send('Message sent to Kafka')
  }
}

export const kafkaController: KafkaController = new KafkaController()
