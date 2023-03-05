import { Logger, VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app/app.module";
import { setupSwagger } from "./main.swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    autoFlushLogs: true,
    abortOnError: false,
    bufferLogs: true,
  });
  app.enableVersioning({
    type: VersioningType.URI,
  });
  const globalPrefix = "api";
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3333;
  const swaggerPath = await setupSwagger(app, globalPrefix);
  await app.listen(port, "0.0.0.0");

  const appUrl = await app.getUrl();

  Logger.log(`Address: ${appUrl}`);
  Logger.log(`Docs: ${appUrl}/${swaggerPath}`);
}

bootstrap();
