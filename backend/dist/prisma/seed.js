"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
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
    }
    else {
        console.log('Admin user already exists');
    }
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
    }
    else {
        console.log('Demo user already exists');
    }
    const innsCount = await prisma.inn.count();
    if (innsCount === 0) {
        await prisma.inn.createMany({
            data: [
                {
                    name: 'Colônia de Férias Beberibe',
                    location: 'Beberibe - Praia das Fontes',
                    description: 'Nossa maior unidade, com 24 apartamentos mobiliados em frente ao mar, ideal para grandes grupos e famílias.',
                    image: 'https://picsum.photos/seed/beberibe/800/600',
                    amenities: ['Waves', 'Wifi', 'Coffee', 'Utensils'],
                },
                {
                    name: 'Pousada Serrana - Guaramiranga',
                    location: 'Guaramiranga - Serra de Baturité',
                    description: 'Clima serrano e tranquilidade absoluta. Chalés privativos com lareira e vista privilegiada para o vale.',
                    image: 'https://picsum.photos/seed/guaramiranga/800/600',
                    amenities: ['Coffee', 'Tv', 'Info'],
                },
                {
                    name: 'Unidade de Lazer Fortaleza',
                    location: 'Fortaleza - Porto das Dunas',
                    description: 'Localização estratégica próxima ao Beach Park, com estrutura de lazer completa e apartamentos confortáveis.',
                    image: 'https://picsum.photos/seed/fortaleza-lazer/800/600',
                    amenities: ['Waves', 'Wifi', 'Utensils', 'Tv'],
                },
            ],
        });
        console.log('Inns seeded');
    }
    else {
        console.log('Inns already exist');
    }
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
    }
    else {
        console.log('Dan user already exists');
    }
    const noticesCount = await prisma.notice.count();
    if (noticesCount === 0) {
        await prisma.notice.createMany({
            data: [
                {
                    title: 'Assembleia Geral Extraordinária',
                    content: 'Pauta: Discussão sobre o novo plano de cargos e carreiras. Participe!',
                    type: 'info',
                },
                {
                    title: 'Novos Convênios Odontológicos',
                    content: 'Agora associados ASSEC têm 40% de desconto na rede Sorriso +, em todo o CE.',
                    type: 'promo',
                },
            ],
        });
        console.log('Notices seeded');
    }
    else {
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
//# sourceMappingURL=seed.js.map