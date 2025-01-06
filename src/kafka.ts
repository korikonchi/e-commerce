import { Kafka, Consumer, Producer } from 'kafkajs'
import dotenv from 'dotenv'

dotenv.config()

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: [process.env.KAFKA_SERVICE || 'localhost:9092']
})

const consumer: Consumer = kafka.consumer({ groupId: 'my-group' })

export const startConsumer = async (topic: string) => {
  await consumer.connect()
  await consumer.subscribe({ topic, fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        value: message.value?.toString()
      })
    }
  })
}

const producer: Producer = kafka.producer()

export const sendMessage = async (topic: string, message: string) => {
  await producer.connect()
  await producer.send({
    topic,
    messages: [{ value: message }]
  })
  await producer.disconnect()
}
