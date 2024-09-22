"use server";

import db from "@/prisma/db";
import { Priority, Status } from "@prisma/client";

export async function deleteTicket(ticketId: string) {
  const ticket = await db.ticket.findUnique({
    where: { id: ticketId },
  });

  if (!ticket) {
    throw new Error("Ticket not found");
  }
  await db.ticket.update({
    where: { id: ticketId },
    data: {
      ticketType: "DELETED",
    },
  });
}

export async function archiveTicket(ticketId: string) {
  // Find the ticket by ID
  const ticket = await db.ticket.findUnique({
    where: { id: ticketId },
  });

  if (!ticket) {
    throw new Error("Ticket not found");
  }

  await db.ticket.update({
    where: { id: ticketId },
    data: {
      ticketType: "ARCHIVED",
    },
  });

  // Optionally, delete the original ticket
}

export async function deleteRestoreTicket(ticketId: string) {
  const ticket = await db.ticket.findUnique({
    where: { id: ticketId },
  });

  if (!ticket) {
    throw new Error("Ticket not found");
  }
  await db.ticket.update({
    where: { id: ticketId },
    data: {
      ticketType: "ACTIVE",
    },
  });
}

export async function archiveRestoreTicket(ticketId: string) {
  // Find the ticket by ID
  const ticket = await db.ticket.findUnique({
    where: { id: ticketId },
  });

  if (!ticket) {
    throw new Error("Ticket not found");
  }

  await db.ticket.update({
    where: { id: ticketId },
    data: {
      ticketType: "ACTIVE",
    },
  });

}
export async function replyToTicket(ticketId: string, content: string) {
  const ticket = await db.ticket.findUnique({
    where: { id: ticketId },
  });

  if (!ticket) {
    throw new Error("Ticket not found");
  }

  // Create a new reply
  await db.reply.create({
    data: {
      content,
      ticketId,
      authorId: "user1", // Replace with the actual user ID
      createdAt: new Date(),
    },
  });

  // Update the ticket history
  await db.ticketHistory.create({
    data: {
      action: "Reply Added",
      description: content,
      ticketId,
      createdAt: new Date(),
    },
  });

  // Update the ticket status
  await db.ticket.update({
    where: { id: ticketId },
    data: {
      status: "OPEN",
    },
  });
}

export async function forwardTicket(ticketId: string, userId: string) {
  const ticket = await db.ticket.findUnique({
    where: { id: ticketId },
  });

  if (!ticket) {
    throw new Error("Ticket not found");
  }

  // Add the user ID to the forwardedTo array
  await db.ticket.update({
    where: { id: ticketId },
    data: {
      forwardedTo: {
        push: userId,
      },
    },
  });

  // Update the ticket history
  await db.ticketHistory.create({
    data: {
      action: "Forwarded",
      description: `Forwarded to ${userId}`,
      ticketId,
      createdAt: new Date(),
    },
  });
}

export async function updateTicketStatus(ticketId: string, status: Status) {
  const ticket = await db.ticket.findUnique({
    where: { id: ticketId },
  });

  if (!ticket) {
    throw new Error("Ticket not found");
  }

  // Update the ticket status
  await db.ticket.update({
    where: { id: ticketId },
    data: {
      status,
    },
  });

  // Update the ticket history
  await db.ticketHistory.create({
    data: {
      action: "Status Changed",
      description: `Status changed to ${status}`,
      ticketId,
      createdAt: new Date(),
    },
  });
}

export async function updateTicketPriority(
  ticketId: string,
  priority: Priority
) {
  const ticket = await db.ticket.findUnique({
    where: { id: ticketId },
  });

  if (!ticket) {
    throw new Error("Ticket not found");
  }

  // Update the ticket priority
  await db.ticket.update({
    where: { id: ticketId },
    data: {
      priority,
    },
  });

  // Update the ticket history
  await db.ticketHistory.create({
    data: {
      action: "Priority Updated",
      description: `Priority updated to ${priority}`,
      ticketId,
      createdAt: new Date(),
    },
  });
}

export async function updateTicketDueDate(ticketId: string, dueDate: Date) {
  const ticket = await db.ticket.findUnique({
    where: { id: ticketId },
  });

  if (!ticket) {
    throw new Error("Ticket not found");
  }

  // Update the ticket due date
  await db.ticket.update({
    where: { id: ticketId },
    data: {
      dueDate,
    },
  });

  // Update the ticket history
  await db.ticketHistory.create({
    data: {
      action: "Due Date Updated",
      description: `Due date updated to ${dueDate.toLocaleDateString()}`,
      ticketId,
      createdAt: new Date(),
    },
  });
}

export async function updateTicketAssignedTo(
  ticketId: string,
  assignedTo: string
) {
  const ticket = await db.ticket.findUnique({
    where: { id: ticketId },
  });

  if (!ticket) {
    throw new Error("Ticket not found");
  }

  // Update the ticket assigned to
  await db.ticket.update({
    where: { id: ticketId },
    data: {
      assignedTo,
    },
  });

  // Update the ticket history
  await db.ticketHistory.create({
    data: {
      action: "Assigned to",
      description: `Assigned to ${assignedTo}`,
      ticketId,
      createdAt: new Date(),
    },
  });
}
