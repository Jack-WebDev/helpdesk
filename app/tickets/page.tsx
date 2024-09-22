import React from "react";
import TicketsPanel from "../components/TicketsPanel";
import db from "@/prisma/db";
import SideBar from "../components/SideBar";

export default async function Tickets() {
  const tickets = await db.ticket.findMany({
    include: {
      history: true,
      replies: true,
    },
  });

  return (
    <div className="flex justify-center">
      <SideBar />

      <TicketsPanel tickets={tickets} />
    </div>
  );
}
