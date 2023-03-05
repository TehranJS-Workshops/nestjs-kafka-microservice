import { ClientsModule } from "@nestjs/microservices";
import { kafkaConfig } from "@indra/kafka";
import { clientId, groupId } from "../../utils/kafka.util";

export const KAFKA_AUTHORIZER_CLIENT_NAME = Symbol.for("KAFKA_AUTHORIZER_CLIENT_NAME");
export function AuthorizerKafkaClient() {
  return ClientsModule.register([
    {
      name: KAFKA_AUTHORIZER_CLIENT_NAME,
      ...kafkaConfig(process.env.NX_KAFKA_BROKERS.split(","), {
        client: {
          clientId: clientId("authorizer"),
        },
        consumer: {
          groupId: groupId("authorizer"),
        },
      }),
    },
  ]);
}
