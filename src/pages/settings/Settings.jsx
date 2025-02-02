import React from "react";
import CustomSidebar from "@/components/ui/CustomSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
function Settings() {
  return (
    <SidebarProvider>
      <CustomSidebar />
      <h3>Settings</h3>
    </SidebarProvider>
  );
}

export default Settings;
