import * as bcrypt from 'bcrypt';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

/**
 * Faz o hash de uma senha usando bcrypt.
 * @param password - A senha em texto plano que deve ser hasheada.
 * @param saltRounds - O número de rounds de sal para usar (padrão é 10).
 * @returns A senha hasheada.
 */
export async function hashPassword(
  password: string,
  saltRounds: number = 10,
): Promise<string> {
  return bcrypt.hash(password, saltRounds);
}

/**
 * Encontra um usuário com sua senha no banco de dados.
 * @param prisma - A instância do PrismaService para interagir com o banco de dados.
 * @param id - O ID do usuário a ser encontrado.
 * @returns O usuário com sua senha.
 * @throws NotFoundException se o usuário não for encontrado.
 */
export async function findUserWithPassword(prisma: PrismaService, id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      password: true,
    },
  });

  if (!user) {
    throw new NotFoundException('Usuário não encontrado');
  }

  return user;
}

/**
 * Verifica se a senha fornecida corresponde à senha armazenada.
 * @param plainPassword - A senha em texto plano a ser comparada.
 * @param hashedPassword - A senha armazenada em formato hasheado.
 * @returns Verdadeiro se as senhas corresponderem, falso caso contrário.
 */
export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}
