"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";

// Hidden Header Routes
const HIDDEN_ROUTES = ["/login", "/"];

export default function ConditionalHeader() {
  // Current Route
  const pathname = usePathname();

  if (HIDDEN_ROUTES.includes(pathname)) return null;

  return <Header />;
}