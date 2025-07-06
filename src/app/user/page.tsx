import Dashboard from "@/components/Dashboard";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { unstable_noStore as noStore } from "next/cache";
import React from "react";

export const metadata: Metadata = {
  title: "Dashboard",
};

const page = async () => {
  noStore();
  const session =await getServerSession()
  const userId = session?.user.id as number
  const [category,myticket] = await Promise.all([
    await prisma.category.findMany(),
    await prisma.ticket.findMany({
      where:{
        userId
      },
      include:{
        Category:true
      }
    })
  ])
  return (
    <div>
      <Dashboard category={category} myticket={myticket} />
    </div>
  );
};

export default page;
