"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";

export function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Do not render the main Navbar on admin routes
  if (pathname === "/admin" || pathname?.startsWith("/admin/")) {
    return null;
  }
  
  return <Navbar />;
}
