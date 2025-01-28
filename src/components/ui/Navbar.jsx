import React from "react";
import { Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function Navbar({ onLogout }) {
  return (
    <nav className="bg-background shadow-lg border-b border-white/20">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
        <div className="flex items-center space-x-4">
          <Terminal className="h-6 w-6 text-muted-foreground" />
          <Link to="/" className="text-muted-foreground hover:text-foreground">
            Blockchain Explorer
          </Link>
        </div>
        <div className="flex space-x-6">
          <Link
            to="/dashboard"
            className="text-muted-foreground hover:text-foreground"
          >
            Dashboard
          </Link>
          <Link
            to="/settings"
            className="text-muted-foreground hover:text-foreground"
          >
            Settings
          </Link>
          <Button
            variant="destructive"
            onClick={onLogout}
            className="text-muted-foreground hover:text-foreground"
          >
            Log out
          </Button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
