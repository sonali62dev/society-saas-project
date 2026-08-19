const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const hash = bcrypt.hashSync('password123', 10);
  const accounts = [
    { email: 'superadmin@gatesecurity.com', name: 'Main Super Admin', role: 'SUPER_ADMIN' },
    { email: 'superadmin@society.com', name: 'Platform Admin', role: 'SUPER_ADMIN' },
    { email: 'admin@society.com', name: 'Sanjay Admin', role: 'ADMIN' },
    { email: 'resident@society.com', name: 'John Resident', role: 'RESIDENT' },
    { email: 'guard@society.com', name: 'Bahadur Guard', role: 'GUARD' },
    { email: 'test4@gmail.com', name: 'Expert Services', role: 'VENDOR' },
    { email: 'individual@example.com', name: 'Amit Individual', role: 'INDIVIDUAL' }
  ];

  for (const acc of accounts) {
    await prisma.user.upsert({
      where: { email: acc.email },
      update: { password: hash, status: 'ACTIVE' },
      create: { email: acc.email, name: acc.name, role: acc.role, password: hash, status: 'ACTIVE' }
    });
    console.log('Updated/Created:', acc.email);
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
