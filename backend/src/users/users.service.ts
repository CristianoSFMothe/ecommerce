import { BadRequestException, Injectable } from '@nestjs/common';
import { hashPassword } from './utils/user.utils';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ReturnUserDto } from './dto/return-user.dto';
import { User } from '@prisma/client';

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

  async findAll(): Promise<ReturnUserDto[]> {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }

  async findUserById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
      },
    });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    return user;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!email) {
      throw new BadRequestException('Usuário não encontrado');
    }

    return user;
  }
}
