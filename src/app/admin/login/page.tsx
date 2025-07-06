import AdminLogin from "@/components/AdminLogin";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Admin login",
};
const page =async () => {
    const category = await prisma.category.findMany()
  return (
    <div>
      <AdminLogin category={category} />
    </div>
  );
};

export default page;
