import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
// Domain Modules
import { AppModule } from "./app/app.module";
// Types
import { type MicroserviceOptions } from "@nestjs/microservices";
// Utilities
import { microserviceConnectorConfig } from "./utils/kafka-connection.util";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    autoFlushLogs: true,
    abortOnError: false,
    bufferLogs: true,
  });
  const microserviceConfig = microserviceConnectorConfig();
  app.connectMicroservice<MicroserviceOptions>(microserviceConfig, {
    inheritAppConfig: true,
  });
  const globalPrefix = "api";
  app.setGlobalPrefix(globalPrefix);

  app.enableShutdownHooks();

  try {
    await app.startAllMicroservices();
    const port = process.env.PORT || 3333;
    await app.listen(port, "0.0.0.0");
    const appUrl = await app.getUrl();

    Logger.log(`Authorizer Microservice Mode is running`);
    Logger.log(`🚀 Application is running on: ${appUrl}`);
  } catch (e) {
    process.exit(1);
  }
}

bootstrap();
