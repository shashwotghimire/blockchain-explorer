import CustomSidebar from "@/components/ui/CustomSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

function Market() {
  return (
    <SidebarProvider>
      <CustomSidebar />
      <h3>Market</h3>
    </SidebarProvider>
  );
}

export default Market;
