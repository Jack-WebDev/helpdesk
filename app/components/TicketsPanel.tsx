"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { Archive, ArchiveRestore, Forward, Trash2, User } from "lucide-react";
import {
  archiveRestoreTicket,
  archiveTicket,
  deleteRestoreTicket,
  deleteTicket,
  forwardTicket,
  replyToTicket,
  updateTicketAssignedTo,
} from "../actions/tickets";
import { Priority, Status } from "@prisma/client";
// This type is equivalent to your Prisma model for Ticket
type Ticket = {
  id: string;
  title: string;
  description: string;
  status: Status; // Prisma-generated enum
  priority: Priority; // Prisma-generated enum
  assignedTo: string | null; // Optional user assignment
  dueDate: Date | null; // Optional due date
  forwardedTo: string[]; // List of forwarded user IDs
  createdAt: Date;
  ticketType: string; // Prisma-generated enum
  updatedAt: Date;
  replies: Reply[]; // Relation to the Reply model
  history: TicketHistory[]; // Relation to the TicketHistory model
};

// This type represents a reply on a ticket
type Reply = {
  id: string;
  content: string;
  ticketId: string;
  authorId: string;
  createdAt: Date;
};

// This type represents a history entry for a ticket
type TicketHistory = {
  id: string;
  action: string;
  description: string;
  ticketId: string;
  createdAt: Date;
};

export default function TicketsPanel({ tickets }: { tickets: Ticket[] }) {
  const searchParams = useSearchParams();
  const search = searchParams.get("filter");
  const router = useRouter();
  const ticketIdInUrl = searchParams.get("ticketId");
  const [replyContent, setReplyContent] = useState("");

  const handleDeleteTicket = async (ticketId: string) => {
    const res = await deleteTicket(ticketId);
    console.log(res);
  };

  const handleForwardTicket = async (ticketId: string) => {
    const res = await forwardTicket(ticketId, "Sandy");
    console.log(res);
  };

  const handleDeleteRestore = async (ticketId: string) => {
    const res = await deleteRestoreTicket(ticketId);
    console.log(res);
  };

  const handleArchiveRestore = async (ticketId: string) => {
    const res = await archiveRestoreTicket(ticketId);
    console.log(res);
  };

  const handleReplyTicket = async (ticketId: string) => {
    console.log("reply");
    const res = await replyToTicket(ticketId, replyContent);
    console.log(res);
    setReplyContent("");
  };

  const handleAssignTicket = async (ticketId: string) => {
    const res = await updateTicketAssignedTo(ticketId, "user1");
    console.log(res);
  };

  const handleArchiveTicket = async (ticketId: string) => {
    const res = await archiveTicket(ticketId);
    console.log(res);
  };

  const handleTicketClick = (ticketId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("ticketId", ticketId);

    // Update the URL with shallow routing to avoid full navigation
    router.push(`/tickets?${params.toString()}`);
  };

  // Function to apply filters based on search params
  const filterTickets = (tickets: Ticket[]) => {
    switch (search) {
      case "my_tickets":
        return tickets.filter((ticket) => ticket.assignedTo === "user1"); // Replace 'user1' with the actual logged-in user ID
      case "unassigned":
        return tickets.filter((ticket) => !ticket.assignedTo);
      case "past_due":
        return tickets.filter(
          (ticket) =>
            ticket.dueDate &&
            new Date(ticket.dueDate) < new Date() &&
            ticket.status === "OPEN"
        );
      case "high_priority":
        return tickets.filter((ticket) => ticket.priority === "HIGH");

      case "trash":
        return tickets.filter((ticket) => ticket.ticketType === "DELETED");

      case "archive":
        return tickets.filter((ticket) => ticket.ticketType === "ARCHIVED");
      case "all":
      default:
        return tickets; // No filtering for 'all'
    }
  };

  // Get the filtered tickets
  const filteredTickets = filterTickets(tickets);

  // Find the selected ticket based on the ticketId in the URL
  const selectedTicket = ticketIdInUrl
    ? tickets.find((ticket) => ticket.id === ticketIdInUrl)
    : null;

  return (
    <div className="grid grid-cols-2 w-[70%] h-[90vh]">
      <div>
        <h1 className="text-2xl font-bold">TicketsPanel</h1>
        <div className="mt-6 h-[90vh] overflow-y-scroll w-full">
          {filteredTickets.length > 0 ? (
            filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className={`mb-4 p-4 border rounded-lg shadow-md cursor-pointer ${
                  ticket.id === ticketIdInUrl ? "bg-blue-100" : ""
                }`}
                onClick={() => handleTicketClick(ticket.id)} // Call handleTicketClick on click
              >
                <h2 className="text-xl font-semibold">{ticket.title}</h2>{" "}
                <span>{ticket.status}</span> <span>{ticket.priority}</span>
              </div>
            ))
          ) : (
            <p>No tickets found for this filter.</p>
          )}
        </div>
      </div>

      {/* Display selected ticket details */}
      {selectedTicket && (
        <div className="w-1/2 mx-auto mt-8 p-6 border rounded-lg shadow-md">
          <div className="flex justify-between">
            <div className="flex gap-x-8">

              {selectedTicket.ticketType === "DELETED" ? (
                <ArchiveRestore onClick={() => handleDeleteRestore(selectedTicket.id)} />
              ):(
                <Trash2
                onClick={() => handleDeleteTicket(selectedTicket.id)}
                className="text-2xl font-bold cursor-pointer"
              />
              )}
              
              {selectedTicket.ticketType === "ARCHIVED" ? (
                <ArchiveRestore onClick={() => handleArchiveRestore(selectedTicket.id)} />
              ):(
                <Archive
                onClick={() => handleArchiveTicket(selectedTicket.id)}
                className="text-2xl font-bold cursor-pointer"
              />
              )}
              <User
                onClick={() => handleAssignTicket(selectedTicket.id)}
                className="text-2xl font-bold cursor-pointer"
              />
            </div>

            <div>
              <Forward
                onClick={() => handleForwardTicket(selectedTicket.id)}
                className="text-2xl font-bold cursor-pointer"
              />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold">Selected Ticket Details</h2>
            <p>
              <strong>Title:</strong> {selectedTicket.title}
            </p>
            <p>
              <strong>Description:</strong> {selectedTicket.description}
            </p>
            <p>
              <strong>Status:</strong> {selectedTicket.status}
            </p>
            <p>
              <strong>Priority:</strong> {selectedTicket.priority}
            </p>
            <p>
              <strong>Due Date:</strong>{" "}
              {selectedTicket.dueDate
                ? new Date(selectedTicket.dueDate).toLocaleDateString()
                : "No due date"}
            </p>
            <p>
              <strong>Assigned To:</strong>{" "}
              {selectedTicket.assignedTo || "Unassigned"}
            </p>
          </div>

          <div>
            <textarea
              name=""
              id=""
              placeholder={`Reply to ${selectedTicket.title}`}
              onChange={(e) => setReplyContent(e.target.value)}
              className="w-full h-32 p-4 border rounded-lg shadow-md"
            ></textarea>
            <button onClick={() => handleReplyTicket(selectedTicket.id)}>
              Send
            </button>
          </div>
          <p>test</p>
          <div>
            <h2>Ticket History</h2>
            {selectedTicket?.history?.map((h) => {
              console.log(h);
              return (
                <div key={h.id}>
                  <p>
                    {h.action}: {h.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
