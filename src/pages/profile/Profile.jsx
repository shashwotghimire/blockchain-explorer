import React, { useState } from "react";
import {
  getAuth,
  updateProfile,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import CustomSidebar from "@/components/ui/CustomSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Mail, Lock, Camera } from "lucide-react";

function Profile() {
  const auth = getAuth();
  const user = auth.currentUser;

  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [newPassword, setNewPassword] = useState("");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const updates = {};
      if (displayName !== user.displayName) updates.displayName = displayName;
      if (photoURL !== user.photoURL) updates.photoURL = photoURL;

      if (Object.keys(updates).length > 0) {
        await updateProfile(user, updates);
      }

      if (email !== user.email) {
        await updateEmail(user, email);
      }

      if (newPassword) {
        await updatePassword(user, newPassword);
      }

      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SidebarProvider>
      <CustomSidebar />
      <div className={`flex-1 min-h-screen bg-background p-8 `}>
        <div className="flex-1 p-8 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Profile Settings
            </h1>
            <p className="text-muted-foreground">
              Manage your account preferences
            </p>
          </div>

          <div className="max-w-2xl rounded-lg border bg-card p-6 shadow-lg">
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              {/* Profile Picture Section */}
              <div className="flex items-center space-x-4">
                <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-10 w-10 text-muted-foreground" />
                  )}
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium">Profile Picture</h3>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="text"
                      placeholder="Enter image URL"
                      value={photoURL}
                      onChange={(e) => setPhotoURL(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Display Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="pl-9"
                      placeholder="Enter your display name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-9"
                      placeholder="Enter new password (optional)"
                    />
                  </div>
                </div>
              </div>

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

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Profile"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default Profile;
