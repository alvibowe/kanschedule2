import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}


const prisma = new PrismaClient();

if (process.env.NODE_ENV !== 'production') global.prisma = prisma

async function main() {
  const encryptedPassword = await hash("password1234", 12);
  await prisma.user.upsert({
    where: { email: "alvinbowen4@gmail.com" },
    update: {},
    create: {
      email: "alvinbowen4@gmail.com",
      name: "Alvin Bowen",
      role: "admin",
      password: encryptedPassword,
    },
  });

  await prisma.user.upsert({
    where: { email: "davidkamere@gmail.com" },
    update: {},
    create: {
      email: "davidkamere@gmail.com",
      name: "David Kamere",
      role: "admin",
      password: encryptedPassword,
    },
  });

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
