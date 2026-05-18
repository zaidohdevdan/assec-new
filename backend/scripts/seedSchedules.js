const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding schedules...');

    const schedules = await prisma.schedule.createMany({
        data: [
            {
                type: 'clube',
                title: 'Encontro do Clube',
                date: '2026-05-20',
                time: '14:00',
                info: 'Reunião mensal do clube',
                status: 'Confirmado',
            },
            {
                type: 'pousada',
                title: 'Hospedagem em Pousada',
                date: '2026-05-25',
                time: '10:00',
                info: 'Fim de semana na pousada',
                status: 'Agendado',
            },
            {
                type: 'juridico',
                title: 'Consulta Jurídica',
                date: '2026-05-22',
                time: '15:30',
                info: 'Consultoria com advogado',
                status: 'Confirmado',
            },
            {
                type: 'saude',
                title: 'Consulta Médica',
                date: '2026-05-23',
                time: '09:00',
                info: 'Checkup com médico',
                status: 'Confirmado',
            },
        ],
    });

    console.log(`✅ Created ${schedules.count} schedules`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
