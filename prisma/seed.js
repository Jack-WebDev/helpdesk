import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
const prisma = new PrismaClient();


async function main() {
  // Clear existing tickets
  await prisma.ticket.deleteMany();

  // Randomly select either 'OPEN' or 'CLOSED' for status
  function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  // Randomly select 'OPEN' or 'CLOSED' for status
  const randomStatus = () => {
    return randomChoice(['OPEN', 'CLOSED']);
  };
  
  // Randomly select 'LOW', 'NORMAL', or 'HIGH' for priority
  const randomPriority = () => {
    return randomChoice(['LOW', 'NORMAL', 'HIGH']);
  };

  const randomTicketType = () => {
    return randomChoice(['Active', 'Deleted', 'Archived']);
  };
  
  // Randomly select a user or null for unassigned
  const randomUsers = ()=> {
    return randomChoice(['user1', faker.person.firstName(), faker.person.firstName(), null]);
  };

  const tickets = Array.from({ length: 30 }, (_, index) => ({
    title: `Ticket ${index + 1}`,
    description: faker.company.catchPhrase(),
    status: randomStatus(), // Use randomStatus to pick either 'OPEN' or 'CLOSED'
    priority: randomPriority(), // Use randomPriority to pick 'LOW', 'NORMAL', or 'HIGH'
    assignedTo: randomUsers(), // Use randomUsers to pick a user or unassigned (null)
    dueDate:faker.date.anytime(), // Randomly assign some tickets without a due date
    ticketType: randomTicketType(), // Use randomTicketType to pick 'Active', 'Deleted', or 'Archived'
  }));

  // Create tickets in the database
  await prisma.ticket.createMany({
    data: tickets,
  });

  console.log("Seeded tickets:", tickets);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
