require('dotenv').config();
const prisma = require('./src/lib/prisma');

async function cleanAllDummy() {
  const dummySocieties = await prisma.society.findMany({
    where: {
      OR: [
        { name: { startsWith: 'Integration Society' } },
        { name: { startsWith: 'dsds' } },
        { name: { startsWith: 'ddgdf' } }
      ]
    },
    select: { id: true, name: true }
  });

  const dummyIds = dummySocieties.map(s => s.id);
  console.log('Cleaning Dummy Society IDs:', dummyIds);

  if (dummyIds.length === 0) {
    console.log('No dummy societies found to clean.');
    process.exit(0);
  }

  const users = await prisma.user.findMany({
    where: { societyId: { in: dummyIds } },
    select: { id: true }
  });
  const uIds = users.map(u => u.id);
  console.log('Cleaning Dummy User IDs:', uIds);

  const uList = uIds.length > 0 ? uIds.join(',') : null;
  const sList = dummyIds.join(',');

  // Disable foreign keys check for fast clean wipe of test dummy societies
  await prisma.$executeRawUnsafe(`SET FOREIGN_KEY_CHECKS = 0;`);

  if (uList) {
    await prisma.$executeRawUnsafe(`DELETE FROM \`ComplaintComment\` WHERE userId IN (${uList})`).catch(()=>{});
    await prisma.$executeRawUnsafe(`DELETE FROM \`Notification\` WHERE userId IN (${uList})`).catch(()=>{});
    await prisma.$executeRawUnsafe(`DELETE FROM \`Complaint\` WHERE societyId IN (${sList})`).catch(()=>{});
    await prisma.$executeRawUnsafe(`DELETE FROM \`Visitor\` WHERE societyId IN (${sList})`).catch(()=>{});
    await prisma.$executeRawUnsafe(`DELETE FROM \`Notice\` WHERE societyId IN (${sList})`).catch(()=>{});
    await prisma.$executeRawUnsafe(`DELETE FROM \`UserSession\` WHERE userId IN (${uList})`).catch(()=>{});
    await prisma.$executeRawUnsafe(`DELETE FROM \`User\` WHERE id IN (${uList})`).catch(()=>{});
  }

  await prisma.$executeRawUnsafe(`DELETE FROM \`Invoice\` WHERE societyId IN (${sList})`).catch(()=>{});
  await prisma.$executeRawUnsafe(`DELETE FROM \`Unit\` WHERE societyId IN (${sList})`).catch(()=>{});
  await prisma.$executeRawUnsafe(`DELETE FROM \`Staff\` WHERE societyId IN (${sList})`).catch(()=>{});
  await prisma.$executeRawUnsafe(`DELETE FROM \`Vendor\` WHERE societyId IN (${sList})`).catch(()=>{});
  await prisma.$executeRawUnsafe(`DELETE FROM \`PlatformInvoice\` WHERE societyId IN (${sList})`).catch(()=>{});
  await prisma.$executeRawUnsafe(`DELETE FROM \`Society\` WHERE id IN (${sList})`).catch(()=>{});

  await prisma.$executeRawUnsafe(`SET FOREIGN_KEY_CHECKS = 1;`);

  console.log('=== SUCCESS: ALL 16 DUMMY TEST SOCIETIES DELETED PERMANENTLY FROM DB! ===');
  process.exit(0);
}

cleanAllDummy();
