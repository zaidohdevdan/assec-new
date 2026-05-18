const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    // Atualizar usuários que não têm CPF ou RG
    const users = await prisma.user.findMany({
        where: {
            OR: [
                { cpf: null },
                { rg: null },
            ],
        },
    });

    console.log(`📋 Encontrados ${users.length} usuários sem CPF/RG`);

    for (let i = 0; i < users.length; i++) {
        const user = users[i];

        // Gerar CPF fictício (para teste)
        const cpf = `${String(i + 1).padStart(3, '0')}.${String(i + 1).padStart(3, '0')}.${String(i + 1).padStart(3, '0')}-${String(i + 1).padStart(2, '0')}`;

        // Gerar RG fictício (para teste)
        const rg = `${String(i + 1000 + i).padStart(8, '0')}`;

        await prisma.user.update({
            where: { id: user.id },
            data: {
                cpf: cpf,
                rg: rg,
            },
        });

        console.log(`✅ Atualizado: ${user.email} - CPF: ${cpf}, RG: ${rg}`);
    }

    console.log('\n✅ Todos os usuários foram atualizados com sucesso!');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
