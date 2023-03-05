// Types
import type tls from "tls";
import type { LoggerService } from "@nestjs/common";
import type { ITopicConfig } from "kafkajs";
import type { SASLOptions } from "@nestjs/microservices/external/kafka.interface";

export interface TopicInitializerOptions {
  serviceName: string;
  logger: LoggerService;
  logLevel?: Array<"info" | "warn">;
  topics: Array<ITopicConfig>;
  brokers: Array<string>;
  ssl?: tls.ConnectionOptions | boolean;
  sasl?: SASLOptions;
  validateOnly?: boolean;
  waitForLeaders?: boolean;
  timeout?: number;
}
