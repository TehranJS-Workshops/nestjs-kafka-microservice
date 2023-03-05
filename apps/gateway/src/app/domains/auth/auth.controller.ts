import { Body, Controller, Post } from "@nestjs/common";
// Services
import { AuthService } from "./auth.service";
// DTOs
import { LoginRequestDto } from "./dto/login-request.dto";

@Controller({
  path: "/auth",
  version: "1",
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(@Body() payload: LoginRequestDto) {
    return this.authService.login();
  }
}
