import { BadRequestException, Injectable } from '@nestjs/common';
import { hashPassword } from './utils/user.utils';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    const emailExisting = await this.prisma.user.findFirst({
      where: {
        email: createUserDto.email,
      },
    });

    if (emailExisting) {
      throw new BadRequestException('Email inválido ou incorreto');
    }

    createUserDto.password = await hashPassword(createUserDto.password);

    return this.prisma.user.create({
      data: createUserDto,
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }
}
