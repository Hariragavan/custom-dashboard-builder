import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });
async function main() {
  console.log('Connecting...');
  await prisma.$connect();
  console.log('Connected!');
  const layout = await prisma.dashboardLayout.findFirst();
  console.log(layout ? 'Found layout' : 'No layout');
}
main().catch(e => console.error('ERROR:', e)).finally(() => prisma.$disconnect());
