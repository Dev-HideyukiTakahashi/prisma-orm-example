import { PrismaClient, User, Vehicle } from "@prisma/client"

const prisma = new PrismaClient();

async function createUser(user: Omit<User, "id">) {
  console.log("Criando novo usuario . . .")
  const created = await prisma.user.create({
    data: user
  });

  console.log(`----------Usuário criado id: ${created.id}----------`);
  return created;
}

async function createVehicle(vehicle: Omit<Vehicle, "id">) {
  console.log("Criando novo veículo . . .")
  const created = await prisma.vehicle.create({
    data: vehicle
  });

  console.log(`----------Veículo criado id: ${created.id}----------`);
}

async function getUsers() {
  console.log("Buscando todos os usuários")
  const users = await prisma.user.findMany();
  users.forEach(user => {
    console.log(user);
  })
  return users;
}

async function removeVehicles() {
  const deleted = await prisma.vehicle.deleteMany({
    where: {
      id: {
        gt: 0,
      }
    }
  });
  console.log("Veículos removidos...")
  console.log(deleted);
}

async function removeUsers(users: Array<User>) {
  users.forEach(async user => {
    console.log("Deleting user with id: " + user.id)
    await prisma.user.delete({
      where: {
        id: user.id
      }
    })
  })
}

async function getUsersWithVehicle() {
  // nessa busca é realizada um leftjoin, ou seja responde mesmo que usuario não tem vehicle
  console.log("Buscando usuários com veículos");
  return await prisma.user.findMany({
    include: {
      fleet: true
    }
  })
}

async function getOnlyUsersWithVehicle() {
  console.log("Buscando apenas usuários que possui veículos");
  return await prisma.user.findMany({
    include: {
      fleet: true
    },
    where: {
      fleet: {
        some: {
          NOT: {
            id: 0
          }
        }
      }
    }
  })

}

class UserRepository {
  public async findByFirstNameAndLastName(firstName: string, lastName: string) {
    return await prisma.user.findMany({
      where: {
        firstName, lastName
      }
    })
  }
}

async function main() {
  const user = await createUser({ firstName: "Timber", lastName: "Saw" });
  await createUser({ firstName: "Joao", lastName: "Silva" });
  const usrs = await getUsers();

  const vehicle = await createVehicle({ description: "Hyundai Tucson", year: 2022, userId: user.id });
  const usrs2 = await getUsers();

  const usersWithVehicle = await getUsersWithVehicle();
  console.log(usersWithVehicle);

  const onlyUsersWithVehicle = await getOnlyUsersWithVehicle()
  console.log(onlyUsersWithVehicle)

  const repository = new UserRepository()
  const u = await repository.findByFirstNameAndLastName("Joao", "Silva");
  console.log("----------Repository----------")
  console.log(u);

  await removeVehicles();
  await removeUsers(usrs);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    await prisma.$disconnect();
    console.log(e);
    process.exit(1);
  })