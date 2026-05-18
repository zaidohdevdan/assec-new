const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
(async () => {
    const prisma = new PrismaClient();
    const email = process.argv[2];
    const user = await prisma.user.findUnique({ where: { email } });
    console.log(JSON.stringify(user, null, 2));
    await prisma.$disconnect();
})();
