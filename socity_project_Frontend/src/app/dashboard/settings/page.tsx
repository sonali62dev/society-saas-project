"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/lib/stores/auth-store";
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Key,
  Smartphone,
  Mail,
  MessageSquare,
  Moon,
  Sun,
  Check,
  CheckCircle2,
  ChevronRight,
  Camera,
  LogOut,
  Building2,
  CreditCard,
  FileText,
  HelpCircle,
  Eye,
  EyeOff,
  Phone,
  MapPin,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useTheme } from "next-themes";
import { PIN_CODE_LENGTH } from "@/config/api.config";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const NOTIFICATION_PREFS_KEY = "notification-preferences";

const defaultNotificationPrefs = {
  email: true,
  push: true,
  sms: false,
  whatsapp: true,
};

export default function SettingsPage() {
  const { user, logout, updateUser } = useAuthStore();
  const themeContext = useTheme();
  const theme = themeContext?.theme ?? "system";
  const setTheme = themeContext?.setTheme ?? (() => {});
  const [notifications, setNotifications] = useState(defaultNotificationPrefs);
  const [showSuccess, setShowSuccess] = useState<string | null>(null);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const queryClient = useQueryClient();

  // Profile Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    pinCode: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  // Fetch fresh user data
  const { data: profileUser } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      try {
        const res = await api.get("/auth/me");
        return res.data;
      } catch (err) {
        return null;
      }
    },
  });

  useEffect(() => {
    if (profileUser) {
      setFormData((prev) => ({
        ...prev,
        name: profileUser.name || "",
        email: profileUser.email || "",
        phone: profileUser.phone || "",
        pinCode: profileUser.pinCode || "",
        password: "",
      }));
    } else if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        pinCode: user.pinCode || "",
      }));
    }
  }, [profileUser, user]);

  // Load notification preferences from localStorage on mount
  useEffect(() => {
    try {
      const stored =
        typeof window !== "undefined"
          ? localStorage.getItem(NOTIFICATION_PREFS_KEY)
          : null;
      if (stored) {
        const parsed = JSON.parse(stored) as typeof defaultNotificationPrefs;
        if (
          parsed &&
          typeof parsed.email === "boolean" &&
          typeof parsed.push === "boolean" &&
          typeof parsed.sms === "boolean" &&
          typeof parsed.whatsapp === "boolean"
        ) {
          setNotifications(parsed);
        }
      }
    } catch (_) {
      // keep default
    }
  }, []);

  const showNotification = (message: string) => {
    setShowSuccess(message);
    setTimeout(() => setShowSuccess(null), 3000);
  };

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.put("/auth/profile", data);
      return response.data;
    },
    onSuccess: (updatedUser) => {
      showNotification("Profile updated successfully!");
      setFormData((prev) => ({ ...prev, password: "" }));
      updateUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
    onError: (error: any) => {
      console.error("Update failed:", error);
      toast.error(error.response?.data?.error || "Failed to update profile");
    },
  });

  const validatePinCode = () => {
    if (user?.role?.toLowerCase() !== "individual") return true;
    const raw = (formData.pinCode ?? "").trim();
    if (!raw) {
      toast.error("PIN Code is required.");
      return false;
    }
    if (!/^\d+$/.test(raw)) {
      toast.error("PIN Code must contain only digits.");
      return false;
    }
    if (raw.length !== PIN_CODE_LENGTH) {
      toast.error(`PIN Code must be exactly ${PIN_CODE_LENGTH} digits.`);
      return false;
    }
    return true;
  };

  const handleProfileSave = () => {
    if (!validatePinCode()) return;
    updateProfileMutation.mutate(formData);
  };

  const handleReset = () => {
    console.log("Reset button clicked");
    if (profileUser) {
      setFormData({
        name: profileUser.name || "",
        email: profileUser.email || "",
        phone: profileUser.phone || "",
        pinCode: profileUser.pinCode || "",
        password: "",
      });
    } else {
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        pinCode: user?.pinCode || "",
        password: "",
      });
    }
  };

  const handleSave = () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(
          NOTIFICATION_PREFS_KEY,
          JSON.stringify(notifications),
        );
      }
      showNotification("Notification preferences saved!");
    } catch (_) {
      toast.error("Failed to save preferences");
    }
  };

  const handlePasswordChange = () => {
    setIsPasswordDialogOpen(false);
    showNotification("Password updated successfully!");
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handlePhotoUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("photo", file);

    try {
      const response = await api.post("/auth/profile/photo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      showNotification("Photo uploaded successfully!");
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });

      // Update store user if needed
      if (user) {
        updateUser({ ...user, avatar: response.data.profileImg });
      }
    } catch (error: any) {
      console.error("Upload failed:", error);
      toast.error(error.response?.data?.error || "Failed to upload photo");
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/auth/login";
  };

  const isAdmin = user?.role === "admin";
  const isGuard = user?.role === "guard";

  const [activeTab, setActiveTab] = useState<
    "profile" | "notifications" | "appearance" | "security" | "society"
  >("profile");

  const tabButtonClass = (tab: string) =>
    `inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-md px-3 py-2 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
      activeTab === tab
        ? "bg-white dark:bg-gray-800 text-teal-600 dark:text-teal-400 shadow-sm border border-gray-200 dark:border-gray-700"
        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900"
    }`;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 pb-10"
    >
      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"
          >
            <CheckCircle2 className="h-5 w-5" />
            {showSuccess}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between"
      >
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1e3a5f]">Settings</h1>
              <p className="text-muted-foreground text-sm">
                Manage your account and preferences
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tab buttons - controlled */}
      <motion.div variants={itemVariants}>
        <div className="overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0">
          <div
            role="tablist"
            className="bg-gray-100 dark:bg-gray-800 p-1.5 h-auto inline-flex flex-nowrap sm:flex-wrap gap-1 w-max sm:w-auto rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "profile"}
              onClick={() => setActiveTab("profile")}
              className={tabButtonClass("profile")}
            >
              <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
              Profile
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "notifications"}
              onClick={() => setActiveTab("notifications")}
              className={tabButtonClass("notifications")}
            >
              <Bell className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
              <span className="hidden sm:inline">Notifications</span>
              <span className="sm:hidden">Alerts</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "appearance"}
              onClick={() => setActiveTab("appearance")}
              className={tabButtonClass("appearance")}
            >
              <Palette className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
              <span className="hidden sm:inline">Appearance</span>
              <span className="sm:hidden">Theme</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "security"}
              onClick={() => setActiveTab("security")}
              className={tabButtonClass("security")}
            >
              <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
              Security
            </button>
            {isAdmin && (
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "society"}
                onClick={() => setActiveTab("society")}
                className={tabButtonClass("society")}
              >
                <Building2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                Society
              </button>
            )}
          </div>
        </div>
      </motion.div>

      <div className="mt-6 min-h-[400px]">
        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-500" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Update your profile details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <Avatar className="h-24 w-24 ring-4 ring-teal-100">
                      <AvatarImage
                        src={profileUser?.profileImg || user?.avatar}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white text-2xl">
                        {user?.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-teal-600 hover:bg-teal-700 shadow-lg"
                      onClick={handlePhotoUpload}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Camera className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{user?.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {user?.email}
                    </p>
                    <Badge className="mt-2 bg-teal-100 text-teal-700">
                      {user?.role === "super_admin"
                        ? "Super Admin"
                        : user?.role === "admin"
                          ? "Administrator"
                          : user?.role === "guard"
                            ? "Security Guard"
                            : user?.role === "individual"
                              ? "Individual User"
                              : user?.role === "vendor"
                                ? "Service Provider"
                                : user?.role === "resident"
                                  ? "Resident"
                                  : user?.role || "User"}
                    </Badge>
                  </div>
                  
                  {/* Assigned Vendor Badge */}
                  <div className="mt-4 sm:ml-auto sm:mt-0 sm:text-right">
                     {profileUser?.assignedVendor ? (
                        <div className="flex flex-col items-start sm:items-end">
                            <span className="text-xs text-muted-foreground">Assigned Service Provider</span>
                            <Badge variant="outline" className="mt-1 border-teal-200 bg-teal-50 text-teal-700 flex items-center gap-1">
                                <Shield className="h-3 w-3" />
                                {profileUser.assignedVendor.name}
                            </Badge>
                        </div>
                     ) : (
                        <div className="flex flex-col items-start sm:items-end">
                             <span className="text-xs text-muted-foreground">Service Provider</span>
                             <span className="text-sm text-gray-400 italic">Pending Assignment</span>
                        </div>
                     )}
                  </div>
                </div>

                <Separator />

                {/* Profile Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      type="email"
                      placeholder="Enter email"
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed directly.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="Enter phone"
                    />
                  </div>
                  {user?.role?.toLowerCase() === "individual" && (
                    <div className="space-y-2">
                      <Label>
                        PIN Code <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value={formData.pinCode}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "").slice(0, PIN_CODE_LENGTH);
                          setFormData({ ...formData, pinCode: val });
                        }}
                        placeholder={`${PIN_CODE_LENGTH}-digit PIN Code (required for vendor assignment)`}
                        maxLength={PIN_CODE_LENGTH}
                        inputMode="numeric"
                        autoComplete="postal-code"
                        className={
                          formData.pinCode && formData.pinCode.length !== PIN_CODE_LENGTH
                            ? "border-red-500 focus-visible:ring-red-500"
                            : ""
                        }
                      />
                      {formData.pinCode && formData.pinCode.length !== PIN_CODE_LENGTH && (
                        <p className="text-xs text-red-500">
                          PIN Code must be exactly {PIN_CODE_LENGTH} digits.
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Used to assign the nearest serviceable vendor.
                      </p>
                    </div>
                  )}
                  {/* Assigned Vendor full details – only for individual with vendor */}
                  {user?.role?.toLowerCase() === "individual" && profileUser?.assignedVendor && (
                    <div className="col-span-1 md:col-span-2 space-y-3 border rounded-lg p-4 bg-muted/30">
                      <h4 className="text-sm font-semibold flex items-center gap-2">
                        <Shield className="h-4 w-4 text-teal-600" />
                        Assigned Service Provider – Full Details
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-start gap-2">
                          <Briefcase className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                          <div>
                            <span className="text-muted-foreground">Name</span>
                            <p className="font-medium">{profileUser.assignedVendor.name}</p>
                          </div>
                        </div>
                        {profileUser.assignedVendor.company && (
                          <div className="flex items-start gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                            <div>
                              <span className="text-muted-foreground">Company</span>
                              <p className="font-medium">{profileUser.assignedVendor.company}</p>
                            </div>
                          </div>
                        )}
                        <div className="flex items-start gap-2">
                          <Briefcase className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                          <div>
                            <span className="text-muted-foreground">Service Type</span>
                            <p className="font-medium">{profileUser.assignedVendor.serviceType}</p>
                          </div>
                        </div>
                        {profileUser.assignedVendor.contactPerson && (
                          <div className="flex items-start gap-2">
                            <User className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                            <div>
                              <span className="text-muted-foreground">Contact Person</span>
                              <p className="font-medium">{profileUser.assignedVendor.contactPerson}</p>
                            </div>
                          </div>
                        )}
                        <div className="flex items-start gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                          <div>
                            <span className="text-muted-foreground">Phone</span>
                            <p className="font-medium">
                              <a href={`tel:${profileUser.assignedVendor.contact}`} className="text-teal-600 hover:underline">
                                {profileUser.assignedVendor.contact}
                              </a>
                            </p>
                          </div>
                        </div>
                        {profileUser.assignedVendor.email && (
                          <div className="flex items-start gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                            <div>
                              <span className="text-muted-foreground">Email</span>
                              <p className="font-medium">
                                <a href={`mailto:${profileUser.assignedVendor.email}`} className="text-teal-600 hover:underline">
                                  {profileUser.assignedVendor.email}
                                </a>
                              </p>
                            </div>
                          </div>
                        )}
                        {profileUser.assignedVendor.address && (
                          <div className="flex items-start gap-2 sm:col-span-2">
                            <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                            <div>
                              <span className="text-muted-foreground">Address</span>
                              <p className="font-medium">{profileUser.assignedVendor.address}</p>
                            </div>
                          </div>
                        )}
                        {profileUser.assignedVendor.servicePincodes && (
                          <div className="flex items-start gap-2 sm:col-span-2">
                            <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                            <div>
                              <span className="text-muted-foreground">Serviceable PIN Codes / Area</span>
                              <p className="font-medium text-foreground break-words">
                                {profileUser.assignedVendor.servicePincodes}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {user?.role?.toLowerCase() !== "individual" && (
                    <div className="space-y-2">
                      <Label>Unit Number</Label>
                      <Input
                        defaultValue="A-101"
                        placeholder="Your unit"
                        disabled={!isAdmin}
                      />
                    </div>
                  )}
                  <div className="space-y-2 col-span-1 md:col-span-2 border-t pt-4 mt-2">
                    <Label className="text-base font-semibold text-gray-900 mb-2 block">
                      Change Password
                    </Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        placeholder="Type new password to update (optional)"
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none z-10 cursor-pointer p-1"
                        title={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Leave empty if you don't want to change password.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={handleReset}>
                    Reset
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-teal-500 to-cyan-500"
                    onClick={handleProfileSave}
                    disabled={
                      updateProfileMutation.isPending ||
                      (user?.role?.toLowerCase() === "individual" &&
                        (!formData.pinCode?.trim() || formData.pinCode.length !== PIN_CODE_LENGTH))
                    }
                  >
                    {updateProfileMutation.isPending
                      ? "Saving..."
                      : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-orange-500" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Choose how you want to receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100">
                        <Mail className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Receive updates via email
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) =>
                        setNotifications((prev) => ({
                          ...prev,
                          email: checked,
                        }))
                      }
                    />
                  </div>
                  


                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-100">
                        <Smartphone className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Get instant app notifications
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(checked) =>
                        setNotifications((prev) => ({ ...prev, push: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-green-100">
                        <MessageSquare className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">WhatsApp Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Receive updates via WhatsApp
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.whatsapp}
                      onCheckedChange={(checked) =>
                        setNotifications((prev) => ({
                          ...prev,
                          whatsapp: checked,
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-orange-100">
                        <MessageSquare className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Get text message alerts
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.sms}
                      onCheckedChange={(checked) =>
                        setNotifications((prev) => ({ ...prev, sms: checked }))
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    className="bg-gradient-to-r from-teal-500 to-cyan-500"
                    onClick={handleSave}
                  >
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Appearance Tab */}
        {activeTab === "appearance" && (
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-pink-500" />
                  Appearance Settings
                </CardTitle>
                <CardDescription>
                  Customize how the app looks and feels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Theme</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <div
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        theme === "light"
                          ? "border-teal-500 bg-teal-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setTheme("light")}
                    >
                      <div className="flex items-center justify-center mb-2">
                        <Sun className="h-8 w-8 text-orange-500" />
                      </div>
                      <p className="text-center font-medium">Light</p>
                    </div>
                    <div
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        theme === "dark"
                          ? "border-teal-500 bg-teal-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setTheme("dark")}
                    >
                      <div className="flex items-center justify-center mb-2">
                        <Moon className="h-8 w-8 text-blue-600" />
                      </div>
                      <p className="text-center font-medium">Dark</p>
                    </div>
                    <div
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        theme === "system"
                          ? "border-teal-500 bg-teal-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setTheme("system")}
                    >
                      <div className="flex items-center justify-center mb-2">
                        <Settings className="h-8 w-8 text-gray-500" />
                      </div>
                      <p className="text-center font-medium">System</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Manage your password and security options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Dialog
                  open={isPasswordDialogOpen}
                  onOpenChange={setIsPasswordDialogOpen}
                >
                  <DialogTrigger asChild>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-100">
                          <Key className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">Change Password</p>
                          <p className="text-sm text-muted-foreground">
                            Update your password regularly
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                      <DialogDescription>
                        Enter your current password and choose a new one
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Current Password</Label>
                        <Input
                          type="password"
                          placeholder="Enter current password"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>New Password</Label>
                        <Input
                          type="password"
                          placeholder="Enter new password"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Confirm New Password</Label>
                        <Input
                          type="password"
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsPasswordDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="bg-gradient-to-r from-teal-500 to-cyan-500"
                        onClick={handlePasswordChange}
                      >
                        Update Password
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-100">
                      <Smartphone className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={twoFactorEnabled}
                    onCheckedChange={(checked) => {
                      setTwoFactorEnabled(checked);
                      showNotification(
                        checked ? "2FA enabled!" : "2FA disabled!",
                      );
                    }}
                  />
                </div>

                <Separator />

                <div className="p-4 rounded-lg bg-red-50 border border-red-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-red-100">
                        <LogOut className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-red-700">Sign Out</p>
                        <p className="text-sm text-red-600">
                          Log out from your account
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleLogout}
                    >
                      Sign Out
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Society Tab (Admin Only) */}
        {isAdmin && activeTab === "society" && (
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-indigo-500" />
                  Society Settings
                </CardTitle>
                <CardDescription>
                  Manage society-wide configurations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Society Name</Label>
                    <Input
                      defaultValue="Sunrise Heights"
                      placeholder="Society name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Registration Number</Label>
                    <Input
                      defaultValue="SOC/MH/2020/12345"
                      placeholder="Reg. number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Total Units</Label>
                    <Input defaultValue="180" type="number" />
                  </div>
                  <div className="space-y-2">
                    <Label>Total Blocks</Label>
                    <Input defaultValue="4" type="number" />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Billing Settings</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">
                        Maintenance Due Day
                      </Label>
                      <Select defaultValue="5">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1st of month</SelectItem>
                          <SelectItem value="5">5th of month</SelectItem>
                          <SelectItem value="10">10th of month</SelectItem>
                          <SelectItem value="15">15th of month</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">
                        Late Fee
                      </Label>
                      <Input defaultValue="500" type="number" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline">Cancel</Button>
                  <Button
                    className="bg-gradient-to-r from-teal-500 to-cyan-500"
                    onClick={handleSave}
                  >
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </motion.div>
  );
}
