const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    const newPassword = 'Senha@123'; // Senha para teste
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const user = await prisma.user.update({
        where: { email: 'daniel.almeida@assec.com.br' },
        data: {
            password: hashedPassword,
        },
        select: {
            id: true,
            email: true,
            name: true,
            status: true,
        },
    });

    console.log('✅ Senha atualizada com sucesso!');
    console.log('\n📧 Credenciais para teste:');
    console.log(`Email: ${user.email}`);
    console.log(`Senha: ${newPassword}`);
    console.log(`Status: ${user.status}`);
    console.log(`ID: ${user.id}`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
