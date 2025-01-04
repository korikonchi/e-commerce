import { Kafka, logLevel, Partitioners } from 'kafkajs'

const kafka = new Kafka({
  clientId: 'kafka-backend',
  brokers: [process.env.KAFKA_SERVICE!], // Usa 127.0.0.1 en lugar de localhost
  logLevel: logLevel.DEBUG
})

const producer = kafka.producer()
// const consumer = kafka.consumer({ groupId: 'test-group' })
// const admin = kafka.admin()

export async function connectKafka() {
  try {
    await producer.connect()
    console.log('Kafka connected')
  } catch (error) {
    console.error('Failed to connect to Kafka:', error)
  }
  //   await consumer.connect()
  //   await consumer.subscribe({ topic: 'test-topic', fromBeginning: true })
  await new Promise((resolve) => setTimeout(resolve, 10000))

  //   await admin.connect()
  //   const clusterMetadata = await admin.describeCluster()
  //   console.log('Cluster metadata:', clusterMetadata)

  //   await admin.createTopics({
  //     topics: [
  //       {
  //         topic: 'test-topic',
  //         numPartitions: 1,
  //         replicationFactor: 1
  //       }
  //     ]
  //   })
  //   await admin.disconnect()

  //   await consumer.subscribe({ topic: 'test-topic', fromBeginning: true })

  console.log('Kafka connected')
}

// export async function runConsumer() {
//   await consumer.run({
//     eachMessage: async ({ topic, partition, message }) => {
//       console.log({
//         topic,
//         partition,
//         value: message.value?.toString()
//       })
//     }
//   })
// }

export const emitUserCreated = async (user: string) => {
  try {
    await producer.send({
      topic: 'test-topic',
      messages: [{ value: JSON.stringify(user) }]
    })
    console.log(`Mensaje enviado: ${user}`)
  } catch (error) {
    console.error('Failed to send message:', error)
  }
}
