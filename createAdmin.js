const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function createAdmin() {
  const email = "admin@ifcm.com";
  const password = "123456";

  const hash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name: "Admin IFCM",
      email,
      password: hash,
      role: "ADMIN_GENERAL",
    },
  });

  console.log("✅ Admin créé :", user);
}

createAdmin();