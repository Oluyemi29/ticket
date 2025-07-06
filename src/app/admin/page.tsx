import AdminDashboard from "@/components/AdminDashboard";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import React from "react";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

const page = async () => {
  noStore();
  const [category, myticket] = await Promise.all([
    await prisma.category.findMany(),
    await prisma.ticket.findMany({
      include: {
        Category: true,
      },
    }),
  ]);

  return (
    <div>
      <AdminDashboard category={category} myticket={myticket} />
    </div>
  );
};

export default page;
