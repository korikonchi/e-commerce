import { Kafka, logLevel, Partitioners } from 'kafkajs'

const kafka = new Kafka({
  clientId: 'kafka-backend',
  brokers: [process.env.KAFKA_SERVICE!],
  logLevel: logLevel.DEBUG,
  retry: {
    initialRetryTime: 1000, // Initial retry delay (1 second)
    maxRetryTime: 60000, // Maximum retry delay (60 seconds)
    retries: 15 // Increase the number of retries
  }
})

// const producer = kafka.producer({
//   createPartitioner: Partitioners.DefaultPartitioner // Try a different partitioner
// })
const admin = kafka.admin()

export async function connectKafka() {
  try {
    // await producer.connect()
    await admin.connect()

    const topics = await admin.listTopics()
    if (!topics.includes('test-topic')) {
      await admin.createTopics({
        topics: [
          {
            topic: 'test-topic',
            numPartitions: 3,
            replicationFactor: 1
          }
        ]
      })
      console.log('Topic "test-topic" created successfully')
    } else {
      console.log('Topic "test-topic" already exists')
    }

    // await producer.send({
    //   topic: 'test-topic',
    //   messages: [{ value: JSON.stringify('test') }]
    // })
    // console.log('Message sent successfully')

    console.log('Kafka connected and topic created')
  } catch (error) {
    console.error('Error:', error)
    // Retry logic can be added here
  } finally {
    await admin.disconnect()
    // await producer.disconnect()
    console.log('Kafka disconnected')
  }
}
