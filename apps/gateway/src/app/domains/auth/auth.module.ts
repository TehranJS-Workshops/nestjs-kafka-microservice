import { Module } from "@nestjs/common";
// Connectors
import { AuthorizerKafkaClient } from "./auth.kafka";
// Controller
import { AuthController } from "./auth.controller";
// Services
import { AuthService } from "./auth.service";

@Module({
  imports: [AuthorizerKafkaClient()],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
