import React, { useState } from "react";
import CustomSidebar from "@/components/ui/CustomSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bell, Moon, Sun, Globe, Shield, Eye } from "lucide-react";

function Settings() {
  const [settings, setSettings] = useState({
    darkMode: true,
    notifications: true,
    privacy: "public",
    currency: "USD",
    language: "English",
    twoFactor: false,
  });
  const [saved, setSaved] = useState(false);

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    // Here you would typically save to backend/localStorage
    localStorage.setItem("userSettings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <SidebarProvider>
      <CustomSidebar />
      <div className={`flex-1 min-h-screen bg-background p-8 `}>
        <div className="flex-1 p-8 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Manage your application preferences and account settings
            </p>
          </div>

          <div className="grid gap-6">
            {/* Appearance */}
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Customize how the application looks and feels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      {settings.darkMode ? <Moon /> : <Sun />}
                      <span className="font-medium">Dark Mode</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Toggle between light and dark theme
                    </p>
                  </div>
                  <Switch
                    checked={settings.darkMode}
                    onCheckedChange={(checked) =>
                      handleSettingChange("darkMode", checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>
                  Customize your trading and display preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Globe />
                      <span className="font-medium">Display Currency</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Choose your preferred currency
                    </p>
                  </div>
                  <Select
                    value={settings.currency}
                    onValueChange={(value) =>
                      handleSettingChange("currency", value)
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="JPY">JPY</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Bell />
                      <span className="font-medium">Notifications</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Receive alerts about transactions and price changes
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications}
                    onCheckedChange={(checked) =>
                      handleSettingChange("notifications", checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Security */}
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>
                  Manage your account security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Shield />
                      <span className="font-medium">
                        Two-Factor Authentication
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch
                    checked={settings.twoFactor}
                    onCheckedChange={(checked) =>
                      handleSettingChange("twoFactor", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Eye />
                      <span className="font-medium">Profile Privacy</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Control who can see your profile
                    </p>
                  </div>
                  <Select
                    value={settings.privacy}
                    onValueChange={(value) =>
                      handleSettingChange("privacy", value)
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="friends">Friends</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
              <Button onClick={handleSave} className="w-32">
                Save Changes
              </Button>
            </div>

            {saved && (
              <Alert className="bg-green-50 text-green-600 border-green-200">
                <AlertDescription>
                  Settings saved successfully!
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default Settings;
