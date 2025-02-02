import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Sidebar } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import CustomSidebar from "@/components/ui/CustomSidebar";

function Wallet() {
  return (
    <SidebarProvider>
      <CustomSidebar />
      <h3>Wallet</h3>
    </SidebarProvider>
  );
}

export default Wallet;
