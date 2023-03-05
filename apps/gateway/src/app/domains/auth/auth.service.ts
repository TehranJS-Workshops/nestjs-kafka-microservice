import { Inject, Injectable } from "@nestjs/common";
import { KafkaService } from "@indra/kafka";
import { ClientKafka } from "@nestjs/microservices";
import { KAFKA_AUTHORIZER_CLIENT_NAME } from "./auth.kafka";

@Injectable()
export class AuthService extends KafkaService {
  constructor(@Inject(KAFKA_AUTHORIZER_CLIENT_NAME) protected readonly kafka: ClientKafka) {
    super(kafka, ["authorizer.login"], {
      parentSpan: "Gateway",
    });
  }
  async login() {
    return this.publish("authorizer.login", {
      username: "test",
      password: "test",
    });
  }
}
