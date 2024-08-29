import { ApiProperty } from '@nestjs/swagger';
import { Role, User } from '@prisma/client';

export class UserEntity implements User {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty({ enum: Role, default: Role.USER })
  role: Role;

  @ApiProperty()
  active: boolean;

  @ApiProperty({ type: Boolean })
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
