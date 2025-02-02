import CustomSidebar from "@/components/ui/CustomSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Sidebar } from "lucide-react";
import React from "react";

function Profile() {
  return (
    <SidebarProvider>
      <CustomSidebar />
      <h3>Profile</h3>
    </SidebarProvider>
  );
}

export default Profile;
