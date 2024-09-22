// // Prisma schema for a Freshdesk-like system

// datasource db {
//     provider = "postgresql"
//     url      = env("DATABASE_URL")
//   }
  
//   generator client {
//     provider = "prisma-client-js"
//   }
  
//   // User Model (could be an agent or a customer)
//   model User {
//     id          Int       @id @default(autoincrement())
//     email       String    @unique
//     name        String
//     role        Role      // Can be 'AGENT', 'CUSTOMER', etc.
//     tickets     Ticket[]  @relation("TicketOwner")
//     assignedTickets Ticket[]  @relation("AssignedTicket")
//     createdAt   DateTime  @default(now())
//     updatedAt   DateTime  @updatedAt
//   }
  
//   // Enum for user roles
//   enum Role {
//     CUSTOMER
//     AGENT
//     ADMIN
//   }
  
//   // Team model for agents
//   model Team {
//     id          Int       @id @default(autoincrement())
//     name        String    @unique
//     agents      User[]    @relation("TeamAgents")
//     tickets     Ticket[]  @relation("TeamTickets")
//     createdAt   DateTime  @default(now())
//     updatedAt   DateTime  @updatedAt
//   }
  
//   // Ticket Model
//   model Ticket {
//     id            Int       @id @default(autoincrement())
//     subject       String
//     description   String
//     status        TicketStatus
//     priority      TicketPriority
//     category      String
//     createdAt     DateTime   @default(now())
//     updatedAt     DateTime   @updatedAt
//     owner         User       @relation("TicketOwner", fields: [ownerId], references: [id])
//     ownerId       Int
//     assignedAgent User?      @relation("AssignedTicket", fields: [assignedAgentId], references: [id])
//     assignedAgentId Int?
//     team          Team?      @relation("TeamTickets", fields: [teamId], references: [id])
//     teamId        Int?
//     messages      Message[]  @relation("TicketMessages")
//   }
  
//   // Enum for ticket status
//   enum TicketStatus {
//     OPEN
//     PENDING
//     RESOLVED
//     CLOSED
//   }
  
//   // Enum for ticket priority
//   enum TicketPriority {
//     LOW
//     MEDIUM
//     HIGH
//     URGENT
//   }
  
//   // Message model for ticket conversation history
//   model Message {
//     id         Int       @id @default(autoincrement())
//     content    String
//     sentAt     DateTime  @default(now())
//     sender     User      @relation(fields: [senderId], references: [id])
//     senderId   Int
//     ticket     Ticket    @relation("TicketMessages", fields: [ticketId], references: [id])
//     ticketId   Int
//   }
  
//   // Interaction model (like replies, notes, or system logs)
//   model Interaction {
//     id         Int       @id @default(autoincrement())
//     type       InteractionType
//     content    String
//     ticket     Ticket    @relation(fields: [ticketId], references: [id])
//     ticketId   Int
//     user       User      @relation(fields: [userId], references: [id])
//     userId     Int
//     createdAt  DateTime  @default(now())
//   }
  
//   // Enum for different types of interactions on tickets
//   enum InteractionType {
//     NOTE
//     REPLY
//     SYSTEM_LOG
//   }
  
//   // SLA model (Service Level Agreement)
//   model SLA {
//     id         Int       @id @default(autoincrement())
//     name       String
//     responseTime Int     // Time in minutes
//     resolutionTime Int   // Time in minutes
//     tickets    Ticket[]  @relation("TicketSLA")
//     createdAt  DateTime  @default(now())
//     updatedAt  DateTime  @updatedAt
//   }
  