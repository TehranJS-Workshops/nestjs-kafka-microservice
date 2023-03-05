import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
// Services
import { AppService } from "./app.service";
// DTOs
import { LoginDto } from "./dto/login.dto";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern("authorizer.login")
  getData(@Payload("payload") payload: LoginDto) {
    console.log({
      payload,
    });
    return this.appService.getData();
  }
}
