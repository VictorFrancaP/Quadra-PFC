import { prismaClient } from "./src/infrastruture/database/db";

const list = async () => {
  const users = await prismaClient.user.findMany();
  console.log(users);

  console.log(process.env.DATABASE_URL);
};

list();
