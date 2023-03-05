import { KafkaOptions, Transport } from "@nestjs/microservices";
import {
  CompressionTypes,
  ConsumerConfig,
  KafkaConfig,
  logLevel,
} from "@nestjs/microservices/external/kafka.interface";

export interface KafkaConfigOptions {
  client: Partial<KafkaConfig>;
  consumer: Partial<ConsumerConfig>;
}

export function kafkaConfig(
  brokers: Array<string>,
  options = { client: {}, consumer: {} } as unknown as KafkaConfigOptions,
): KafkaOptions {
  return {
    transport: Transport.KAFKA,
    options: {
      send: {
        compression: CompressionTypes.GZIP,
      },
      producer: {
        idempotent: true,
        maxInFlightRequests: 1,
        retry: {
          retries: 10,
        },
      },
      subscribe: {
        fromBeginning: true,
      },
      run: {
        autoCommit: true,
        partitionsConsumedConcurrently: 10,
      },
      client: {
        clientId: "1",
        ...options.client,
        brokers,
        logLevel: logLevel.ERROR,
      },
      consumer: {
        heartbeatInterval: 1000,
        sessionTimeout: 30000,
        allowAutoTopicCreation: false,
        maxInFlightRequests: 1,
        metadataMaxAge: 3000,
        minBytes: 5,
        maxBytes: 1e6,
        // wait for at most 0.5 seconds before receiving new data
        maxWaitTimeInMs: 500,
        ...options.consumer,
        groupId: options.consumer.groupId ?? "my-kafka-consumer",
        retry: {
          retries: 10,
        },
      },
    },
  };
}
