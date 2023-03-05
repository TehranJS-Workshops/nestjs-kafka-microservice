import { ApiProperty } from "@nestjs/swagger";

export class LoginRequestDto {
  @ApiProperty({
    required: true,
    type: String,
    nullable: false,
    description: "نام کاربری",
    example: "alimaster",
  })
  username: string;

  @ApiProperty({
    required: true,
    type: String,
    nullable: false,
    description: "رمزعبور",
    example: "123456",
  })
  password: string;
}
