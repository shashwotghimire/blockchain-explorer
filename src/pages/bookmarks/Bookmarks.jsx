import CustomSidebar from "@/components/ui/CustomSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

function Bookmarks() {
  return (
    <SidebarProvider>
      <CustomSidebar />
      <h3>Bookmarks</h3>
    </SidebarProvider>
  );
}

export default Bookmarks;
