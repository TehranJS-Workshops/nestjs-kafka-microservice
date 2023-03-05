import { Logger } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
// Utilities
import { lastValueFrom, Observable } from "rxjs";
// Types
import type { BeforeApplicationShutdown, LoggerService, OnApplicationBootstrap, OnModuleInit } from "@nestjs/common";
import type { KafkaServiceInfoProp } from "./kafka.type";
import { kindOf } from "../utils/kind-of.util";

export abstract class KafkaService implements OnModuleInit, OnApplicationBootstrap, BeforeApplicationShutdown {
  private readonly $logger: LoggerService;
  protected constructor(
    protected readonly kafka: ClientKafka,
    protected readonly topics: Array<string>,
    protected readonly info: KafkaServiceInfoProp = <KafkaServiceInfoProp>{},
  ) {
    this.$logger = new Logger(info.parentSpan);
  }

  private async connect(): Promise<void> {
    await this.kafka.connect();
  }

  private async disconnect(): Promise<void> {
    await this.kafka.close();
  }

  async onApplicationBootstrap() {
    await this.connect();
  }

  async onModuleInit() {
    for (const topic of this.topics) {
      this.kafka.subscribeToResponseOf(topic);
    }
  }

  async beforeApplicationShutdown() {
    await this.disconnect();
  }

  private async getValueFromTopic(response: Observable<any>) {
    return lastValueFrom(response);
  }

  protected async publish<T>(topic: string, message: any): Promise<T> {
    const before = Date.now();

    try {
      this.$logger.log(
        JSON.stringify({
          message: "KafkaService",
          process: "start",
          type: "request",
          kafka: {
            process: "start",
            topic,
            time: new Date(before).toISOString(),
          },
          span: "kafka",
          payload: message,
        }),
        "KafkaService",
      );
      const result = await this.getValueFromTopic(
        this.kafka.send(topic, {
          payload: message,
        }),
      );

      if (kindOf(result) === "object" && "issuer" in result && result.issue) {
        throw result;
      }

      const after = Date.now();
      this.$logger.log(
        JSON.stringify({
          message: "KafkaService",
          process: "finish",
          type: "response",
          kafka: {
            process: "finish",
            topic,
            time: new Date(after).toISOString(),
            duration: after - before,
          },
          span: "kafka",
          payload: message,
          result,
        }),
        "KafkaService",
      );

      return result;
    } catch (e: any) {
      const after = Date.now();
      this.$logger.log(
        JSON.stringify({
          message: "KafkaService",
          process: "finish",
          type: "exception",
          kafka: {
            process: "finish",
            topic,
            time: new Date(after).toISOString(),
            duration: after - before,
          },
          span: "kafka",
          payload: message,
          error: e?.message,
          errorStack: e?.stack ?? "unknown",
          errorDescription: e?.description ?? e?.reason ?? "unknown",
          errorStatus: e?.status,
          errorType: e?.error,
        }),
        "KafkaService",
      );

      throw e;
    }
  }
}
