const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.notice.findMany({ select: { id: true, title: true, active: true } })
  .then(r => { console.log(JSON.stringify(r, null, 2)); return p.$disconnect(); })
  .catch(e => { console.error(e); process.exit(1); });
