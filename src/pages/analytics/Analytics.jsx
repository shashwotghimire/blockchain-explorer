import CustomSidebar from "@/components/ui/CustomSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

function Analytics() {
  return (
    <SidebarProvider>
      <CustomSidebar />
      <h3>Analytics</h3>
    </SidebarProvider>
  );
}

export default Analytics;
