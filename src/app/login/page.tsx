import Login from "@/components/Login";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Login",
};
const page = async () => {
  return (
    <div>
      <Login />
    </div>
  );
};

export default page;
