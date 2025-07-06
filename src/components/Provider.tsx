"use client";
import React from "react";
import { HeroUIProvider } from "@heroui/react";
import { SessionProvider } from "next-auth/react";

const Provider = ({ children }: { children: React.ReactNode }) => {
  return <HeroUIProvider><SessionProvider>{children}</SessionProvider></HeroUIProvider>;
};

export default Provider;
