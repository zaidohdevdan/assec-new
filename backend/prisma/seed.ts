import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Admin user
  const adminEmail = 'admin@assec.com.br';
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Administrador ASSEC',
        role: 'ADMIN',
        status: 'Ativo',
      },
    });
    console.log(`Admin user created: ${adminUser.email}`);
  } else {
    console.log('Admin user already exists');
  }

  // Demo user
  const demoEmail = 'marcos@assec.com.br';
  const existingDemo = await prisma.user.findUnique({
    where: { email: demoEmail },
  });

  if (!existingDemo) {
    const hashedPassword = await bcrypt.hash('123456', 10);
    const demoUser = await prisma.user.create({
      data: {
        email: demoEmail,
        password: hashedPassword,
        name: 'SGT. MARCOS OLIVEIRA',
        role: 'USER',
        cpf: '123.456.789-00',
        rg: '20010023456-X',
        matricula: 'ASSEC-2024-8891',
        status: 'Ativo',
        org: 'Polícia Militar do Ceará',
      },
    });
    console.log(`Demo user created: ${demoUser.email}`);

    // Schedules for demo user
    await prisma.schedule.createMany({
      data: [
        {
          userId: demoUser.id,
          type: 'Clube',
          title: 'Churrasqueira 04',
          date: '15/05/2026',
          time: '09:00 - 18:00',
          info: 'Reserva para 15 convidados',
          status: 'Confirmado',
        },
        {
          userId: demoUser.id,
          type: 'Assessoria Jurídica',
          title: 'Consulta Dr. André',
          date: '18/05/2026',
          time: '14:30',
          info: 'Sala 02 (Sede)',
          status: 'Agendado',
        },
      ],
    });
    console.log('Demo schedules created');
  } else {
    console.log('Demo user already exists');
  }

  // Inns
  const innsCount = await prisma.inn.count();
  if (innsCount === 0) {
    await prisma.inn.createMany({
      data: [
        {
          name: 'Colônia de Férias Beberibe',
          location: 'Beberibe - Praia das Fontes',
          description:
            'Nossa maior unidade, com 24 apartamentos mobiliados em frente ao mar, ideal para grandes grupos e famílias.',
          image: 'https://picsum.photos/seed/beberibe/800/600',
          amenities: ['Waves', 'Wifi', 'Coffee', 'Utensils'],
        },
        {
          name: 'Pousada Serrana - Guaramiranga',
          location: 'Guaramiranga - Serra de Baturité',
          description:
            'Clima serrano e tranquilidade absoluta. Chalés privativos com lareira e vista privilegiada para o vale.',
          image: 'https://picsum.photos/seed/guaramiranga/800/600',
          amenities: ['Coffee', 'Tv', 'Info'],
        },
        {
          name: 'Unidade de Lazer Fortaleza',
          location: 'Fortaleza - Porto das Dunas',
          description:
            'Localização estratégica próxima ao Beach Park, com estrutura de lazer completa e apartamentos confortáveis.',
          image: 'https://picsum.photos/seed/fortaleza-lazer/800/600',
          amenities: ['Waves', 'Wifi', 'Utensils', 'Tv'],
        },
      ],
    });
    console.log('Inns seeded');
  } else {
    console.log('Inns already exist');
  }

  // Dan user
  const danEmail = 'dan@gmail.com';
  const existingDan = await prisma.user.findUnique({
    where: { email: danEmail },
  });

  if (!existingDan) {
    const hashedPassword = await bcrypt.hash('daniel@123', 10);
    const danUser = await prisma.user.create({
      data: {
        email: danEmail,
        password: hashedPassword,
        name: 'Dan',
        role: 'USER',
        status: 'Ativo',
      },
    });
    console.log(`Dan user created: ${danUser.email}`);
  } else {
    console.log('Dan user already exists');
  }

  // Notices
  const noticesCount = await prisma.notice.count();
  if (noticesCount === 0) {
    await prisma.notice.createMany({
      data: [
        {
          title: 'Assembleia Geral Extraordinária',
          content:
            'Pauta: Discussão sobre o novo plano de cargos e carreiras. Participe!',
          type: 'info',
        },
        {
          title: 'Novos Convênios Odontológicos',
          content:
            'Agora associados ASSEC têm 40% de desconto na rede Sorriso +, em todo o CE.',
          type: 'promo',
        },
      ],
    });
    console.log('Notices seeded');
  } else {
    console.log('Notices already exist');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
