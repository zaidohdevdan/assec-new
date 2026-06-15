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

  // Benefits
  const benefitsCount = await prisma.benefit.count();
  if (benefitsCount === 0) {
    await prisma.benefit.createMany({
      data: [
        // Static Benefits
        {
          title: 'Assessoria Jurídica Integral',
          tag: 'Jurídico',
          description: 'Nossa equipe jurídica especialista em direito militar e administrativo defende e acompanha os associados em sindicâncias e processos correlatos.',
          details: 'A ASSEC oferece assistência jurídica completa em diversas instâncias. Nossos associados contam com plantões de atendimento presencial e virtual, representação em processos disciplinares, sindicâncias corporativas, além de assessoria em direito civil e familiar para resguardar todos os direitos dos servidores públicos militares.',
          icon: 'Shield',
        },
        {
          title: 'Convênios com Saúde e Odontologia',
          tag: 'Saúde',
          description: 'Parcerias de ampla cobertura com os maiores planos de saúde e odontologia do estado, oferecendo condições exclusivas de contratação.',
          details: 'Nossos convênios de saúde e odontologia cobrem atendimentos clínicos, consultas com especialistas renomados, exames especializados de alta complexidade, procedimentos cirúrgicos e internações com valores e tabelas exclusivas negociados diretamente para a família associada da ASSEC.',
          icon: 'Heart',
        },
        {
          title: 'Convênios de Educação e Comércio',
          tag: 'Educação',
          description: 'Descontos expressivos em mensalidades de faculdades, escolas de idiomas, academias e hotéis parceiros.',
          details: 'Parcerias sólidas com as maiores universidades, centros educacionais, escolas de idiomas, redes de academias e hotéis pelo país garantem aos associados e seus dependentes descontos expressivos de até 50% nas mensalidades e diárias.',
          icon: 'Key',
        },
        {
          title: 'Auxílio Emergencial e Seguro',
          tag: 'Assistência',
          description: 'Seguros de vida coletivos e programas assistenciais voltados a amparar a família do servidor em momentos de extrema necessidade.',
          details: 'Com o objetivo de apoiar a família do associado nas horas mais delicadas, a ASSEC disponibiliza seguros de vida coletivos com coberturas amplas, auxílio financeiro emergencial imediato e assistência funeral completa de urgência.',
          icon: 'ShieldCheck',
        },
        // Inns (Lazer Category Benefits)
        {
          title: 'Colônia de Férias Beberibe',
          tag: 'Lazer',
          description: 'Nossa maior unidade, com 24 apartamentos mobiliados em frente ao mar, ideal para grandes grupos e famílias.',
          details: 'Desfrute de momentos de lazer e descanso na Colônia de Férias Beberibe, localizada na privilegiada região de Beberibe - Praia das Fontes. A pousada oferece suítes climatizadas, cozinha de apoio, área de lazer equipada com churrasqueira e piscinas. Diárias promocionais exclusivas para associados da ASSEC.',
          image: 'https://picsum.photos/seed/beberibe/800/600',
          amenities: ['Waves', 'Wifi', 'Coffee', 'Utensils'],
          location: 'Beberibe - Praia das Fontes',
          icon: 'Landmark',
        },
        {
          title: 'Pousada Serrana - Guaramiranga',
          tag: 'Lazer',
          description: 'Clima serrano e tranquilidade absoluta. Chalés privativos com lareira e vista privilegiada para o vale.',
          details: 'Desfrute de momentos de lazer e descanso na Pousada Serrana Guaramiranga, localizada na privilegiada região de Guaramiranga. A pousada oferece chalés aconchegantes com lareira e uma linda vista da serra. Diárias promocionais exclusivas para associados da ASSEC.',
          image: 'https://picsum.photos/seed/guaramiranga/800/600',
          amenities: ['Coffee', 'Tv', 'Info'],
          location: 'Guaramiranga - Serra de Baturité',
          icon: 'Landmark',
        },
        {
          title: 'Unidade de Lazer Fortaleza',
          tag: 'Lazer',
          description: 'Localização estratégica próxima ao Beach Park, com estrutura de lazer completa e apartamentos confortáveis.',
          details: 'Desfrute de momentos de lazer e descanso na Unidade de Lazer Fortaleza, localizada próxima ao Beach Park. A unidade oferece quartos completos com ar-condicionado, piscina, Wi-Fi e área de convivência com cozinha. Diárias promocionais exclusivas para associados da ASSEC.',
          image: 'https://picsum.photos/seed/fortaleza-lazer/800/600',
          amenities: ['Waves', 'Wifi', 'Utensils', 'Tv'],
          location: 'Fortaleza - Porto das Dunas',
          icon: 'Landmark',
        },
      ],
    });
    console.log('Benefits seeded');
  } else {
    console.log('Benefits already exist');
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

  // Professionals
  const professionals = [
    { email: 'fisioterapeuta@assec.com.br', name: 'Dr. Roberto Santos (Fisioterapia)', specialty: 'Fisioterapia' },
    { email: 'advogado@assec.com.br', name: 'Dr. André Sousa (Advocacia)', specialty: 'Assistência Jurídica' },
    { email: 'enfermeiro@assec.com.br', name: 'Dra. Cláudia Lima (Enfermagem)', specialty: 'Enfermaria' },
    { email: 'psicologo@assec.com.br', name: 'Dra. Patrícia Mota (Psicologia)', specialty: 'Psicologia' },
    { email: 'administrativo@assec.com.br', name: 'Mariana Alves (Administrativo)', specialty: 'Administrativo' },
  ];

  for (const prof of professionals) {
    const existingProf = await prisma.user.findUnique({
      where: { email: prof.email },
    });

    if (!existingProf) {
      const hashedPassword = await bcrypt.hash('123456', 10);
      const createdProf = await prisma.user.create({
        data: {
          email: prof.email,
          password: hashedPassword,
          name: prof.name,
          role: 'PROFESSIONAL',
          specialty: prof.specialty,
          status: 'Ativo',
        },
      });
      console.log(`Professional created: ${createdProf.email} (${createdProf.specialty})`);

      // Seed some slots for this professional
      await prisma.scheduleSlot.createMany({
        data: [
          {
            professionalId: createdProf.id,
            date: '2026-06-15',
            time: '09:00',
            status: 'Disponível',
          },
          {
            professionalId: createdProf.id,
            date: '2026-06-15',
            time: '10:00',
            status: 'Disponível',
          },
          {
            professionalId: createdProf.id,
            date: '2026-06-16',
            time: '14:00',
            status: 'Disponível',
          },
          {
            professionalId: createdProf.id,
            date: '2026-06-16',
            time: '15:00',
            status: 'Disponível',
          },
        ],
      });
      console.log(`Slots created for ${createdProf.email}`);
    } else {
      console.log(`Professional ${prof.email} already exists`);
    }
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

  // President/Director user
  const presidentEmail = 'presidente@assec.com.br';
  const existingPresident = await prisma.user.findUnique({
    where: { email: presidentEmail },
  });

  if (!existingPresident) {
    const hashedPassword = await bcrypt.hash('presi123', 10);
    const presidentUser = await prisma.user.create({
      data: {
        email: presidentEmail,
        password: hashedPassword,
        name: 'Maria Helena (Presidente ASSEC)',
        role: 'PRESIDENT',
        status: 'Ativo',
      },
    });
    console.log(`President user created: ${presidentUser.email}`);
  } else {
    console.log('President user already exists');
  }

  // Financial records
  const financialCount = await prisma.financialRecord.count();
  if (financialCount === 0) {
    await prisma.financialRecord.createMany({
      data: [
        {
          description: 'Arrecadação de Mensalidades - Março/2026',
          amount: 24500.00,
          type: 'INCOME',
          category: 'Mensalidades',
          date: new Date('2026-03-10T00:00:00.000Z'),
        },
        {
          description: 'Arrecadação de Mensalidades - Abril/2026',
          amount: 25100.00,
          type: 'INCOME',
          category: 'Mensalidades',
          date: new Date('2026-04-10T00:00:00.000Z'),
        },
        {
          description: 'Arrecadação de Mensalidades - Maio/2026',
          amount: 25800.00,
          type: 'INCOME',
          category: 'Mensalidades',
          date: new Date('2026-05-10T00:00:00.000Z'),
        },
        {
          description: 'Arrecadação de Mensalidades - Junho/2026',
          amount: 26200.00,
          type: 'INCOME',
          category: 'Mensalidades',
          date: new Date('2026-06-10T00:00:00.000Z'),
        },
        {
          description: 'Manutenção Pousada Guaramiranga',
          amount: -3200.00,
          type: 'EXPENSE',
          category: 'Lazer',
          date: new Date('2026-05-15T00:00:00.000Z'),
        },
        {
          description: 'Honorários Advocatícios - Assessoria Jurídica',
          amount: -8500.00,
          type: 'EXPENSE',
          category: 'Jurídico',
          date: new Date('2026-05-05T00:00:00.000Z'),
        },
        {
          description: 'Seguro Coletivo de Vida - Convênio Bradesco',
          amount: -4100.00,
          type: 'EXPENSE',
          category: 'Assistência',
          date: new Date('2026-05-20T00:00:00.000Z'),
        },
        {
          description: 'Suprimentos de Escritório e Sede',
          amount: -1250.00,
          type: 'EXPENSE',
          category: 'Administrativo',
          date: new Date('2026-06-02T00:00:00.000Z'),
        },
        {
          description: 'Patrocínio Evento Esportivo Servidores',
          amount: -2500.00,
          type: 'EXPENSE',
          category: 'Eventos',
          date: new Date('2026-06-08T00:00:00.000Z'),
        },
        {
          description: 'Parceria de Publicidade - Rede de Farmácias',
          amount: 1500.00,
          type: 'INCOME',
          category: 'Eventos',
          date: new Date('2026-06-11T00:00:00.000Z'),
        },
      ],
    });
    console.log('Financial records seeded');
  } else {
    console.log('Financial records already exist');
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
