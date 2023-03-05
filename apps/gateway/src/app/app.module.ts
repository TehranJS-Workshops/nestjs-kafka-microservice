import { Module } from "@nestjs/common";
// Domain Modules
import { AuthModule } from "./domains/auth/auth.module";
// Controller
import { AppController } from "./app.controller";
// Services
import { AppService } from "./app.service";

@Module({
  imports: [AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
