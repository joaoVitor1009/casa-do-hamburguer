import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });

//Forma moderna prestar atenção onde devesse ser substituido
const prisma = new PrismaClient({ adapter });

//Forma antiga de usr o prisma client
//const prisma = new PrismaClient();

export { prisma };

export async function connection() {
  await prisma.$connect;
  console.log("Conectado");
}
