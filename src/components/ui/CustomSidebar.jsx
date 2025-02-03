import React, { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";

import {
  Calendar,
  Home,
  ChartNoAxesCombined,
  LayoutDashboard,
  Settings,
  Bookmark,
  Wallet,
  User2,
  ChevronUp,
  Landmark,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useNavigate } from "react-router-dom";

function CustomSidebar() {
  const [username, setUsername] = useState("");
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigate("/signin");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    if (user.displayName) {
      setUsername(user.displayName);
    } else {
      setUsername(user.email);
    }
  }, []);
  const handleProfile = () => {
    navigate("/profile");
  };
  const items = [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: ChartNoAxesCombined,
    },
    {
      title: "Bookmarks",
      url: "/bookmarks",
      icon: Bookmark,
    },
    {
      title: "Market",
      url: "/market",
      icon: Landmark,
    },

    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
  ];
  return (
    <Sidebar>
      <SidebarContent className="bg-black">
        <SidebarGroup>
          <SidebarGroupLabel>
            <button
              className="text-2xl font-bold tracking-tight flex items-center gap-2"
              onClick={() => navigate("/")}
            >
              <img
                src="https://coin-images.coingecko.com/coins/images/279/large/ethereum.png?1696501628"
                className="w-15 h-10 rounded-full"
              />
              <span>ETH EXP</span>
            </button>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <br></br>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.url}
                      className="flex ite</SidebarMenuButton>ms-center gap-2"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-black">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <div className="flex items-center gap-2">
                    <User2 />
                    <span>{username}</span>
                    <ChevronUp className="ml-auto" />
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width] bg-black"
              >
                <DropdownMenuItem>
                  <button onClick={handleProfile}>Profile</button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <button variant="destructive" onClick={handleSignOut}>
                    Log out
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default CustomSidebar;
