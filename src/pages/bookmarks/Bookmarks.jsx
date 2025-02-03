import React, { useState, useEffect } from "react";
import CustomSidebar from "@/components/ui/CustomSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bookmark, Trash2, ExternalLink } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [newAddress, setNewAddress] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Load bookmarks from localStorage on component mount
    const savedBookmarks = localStorage.getItem("ethBookmarks");
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }
  }, []);

  const saveBookmarks = (updatedBookmarks) => {
    localStorage.setItem("ethBookmarks", JSON.stringify(updatedBookmarks));
    setBookmarks(updatedBookmarks);
  };

  const handleAddBookmark = (e) => {
    e.preventDefault();
    if (!newAddress || !newLabel) {
      setError("Please provide both address and label");
      return;
    }

    const addressExists = bookmarks.some(
      (bookmark) => bookmark.address.toLowerCase() === newAddress.toLowerCase()
    );

    if (addressExists) {
      setError("This address is already bookmarked");
      return;
    }

    const newBookmark = {
      id: Date.now(),
      address: newAddress,
      label: newLabel,
      dateAdded: new Date().toISOString(),
    };

    const updatedBookmarks = [...bookmarks, newBookmark];
    saveBookmarks(updatedBookmarks);
    setNewAddress("");
    setNewLabel("");
    setError("");
    setSuccess("Bookmark added successfully!");
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleRemoveBookmark = (id) => {
    const updatedBookmarks = bookmarks.filter((bookmark) => bookmark.id !== id);
    saveBookmarks(updatedBookmarks);
    setSuccess("Bookmark removed successfully!");
    setTimeout(() => setSuccess(""), 3000);
  };

  const formatAddress = (address) => {
    return `${address}`;
  };

  return (
    <SidebarProvider>
      <CustomSidebar />
      <div className={`flex-1 min-h-screen bg-background p-8 `}>
        <div className="flex-1 p-8 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Bookmarks</h1>
            <p className="text-muted-foreground">
              Save and manage your favorite Ethereum addresses
            </p>
          </div>

          <Card className="w-full max-w-6xl mx-auto">
            <CardHeader>
              <CardTitle>Add New Bookmark</CardTitle>
              <CardDescription>
                Save an Ethereum address with a custom label
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddBookmark} className="space-y-4">
                <div className="flex gap-4">
                  <Input
                    placeholder="Ethereum Address"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Label"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    className="w-1/3"
                  />
                  <Button type="submit">Add Bookmark</Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 text-green-600 border-green-200">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-6 max-w-6xl mx-auto">
            {bookmarks.map((bookmark) => (
              <Card key={bookmark.id} className="group w-full">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1 mr-4">
                      <h3 className="font-semibold">{bookmark.label}</h3>
                      <p className="text-sm text-muted-foreground font-mono break-all">
                        {formatAddress(bookmark.address)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveBookmark(bookmark.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Added: {new Date(bookmark.dateAdded).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {bookmarks.length === 0 && (
            <div className="text-center p-8 text-muted-foreground">
              <Bookmark className="mx-auto h-12 w-12 mb-4" />
              <h3 className="font-medium mb-1">No bookmarks yet</h3>
              <p>Add your first bookmark using the form above</p>
            </div>
          )}
        </div>
      </div>
    </SidebarProvider>
  );
}

export default Bookmarks;
