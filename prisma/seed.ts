import { PrismaClient } from '@prisma/client'
import{ faker }from '@faker-js/faker'
import { parse } from 'path'
const prisma = new PrismaClient()

async function main() {
    for (let i = 0; i < 50; i++) {
        await prisma.sutemeny.create({
            data: {
                name: faker.food.adjective(),
                description: faker.food.description(),
                price: Number(faker.finance.amount({min: 500,max: 5000, dec:0}))
            }
        })
    }
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })