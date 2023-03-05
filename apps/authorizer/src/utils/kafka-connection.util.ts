import { kafkaConfig } from "@indra/kafka";

const MICROSERVICE_NAME = "loan";
const { NODE_ENV, NX_KAFKA_BROKERS } = process.env;
export const clientId = (prefix: string) => `${MICROSERVICE_NAME}.${prefix}.${NODE_ENV}`;
export const groupId = (prefix: string) => `${prefix}.${NODE_ENV}`;

export const microserviceConnectorConfig = () =>
  kafkaConfig(NX_KAFKA_BROKERS.split(","), {
    client: {
      clientId: clientId("service"),
    },
    consumer: {
      groupId: groupId("loan"),
    },
  });
