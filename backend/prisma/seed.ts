import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Verificar se o usuário admin já existe
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@admin.com' },
  });

  if (!existingAdmin) {
    // Hash da senha
    const hashedPassword = await bcrypt.hash('AdminPassword123!', 10);

    // Criar um usuário com o perfil ADMIN
    await prisma.user.create({
      data: {
        email: 'admin@admin.com',
        name: 'Admin',
        password: hashedPassword,
        role: Role.ADMIN,
        active: true,
      },
    });

    console.log('Usuário administrador criado.');
  } else {
    console.log('O usuário administrador já existe.');
  }
}

// Executar o script de seed
main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
