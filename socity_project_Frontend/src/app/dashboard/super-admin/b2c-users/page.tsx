"use client";

import { useState } from "react";
import {
  User,
  Search,
  Filter,
  MoreVertical,
  Smartphone,
  Mail,
  Calendar,
  QrCode,
  Shield,
  Ban,
  CheckCircle2,
  TrendingUp,
  ExternalLink,
  Plus,
  Copy,
  Eye,
  EyeOff,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { PIN_CODE_LENGTH } from "@/config/api.config";
import { MapPin } from "lucide-react";

export default function SuperAdminB2CUsers() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);

  const { data: users = [], isLoading } = useQuery<any[]>({
    queryKey: ["b2c-users"],
    queryFn: async () => {
      const response = await api.get("/auth/all");
      return response.data.filter((u: any) => u.role === "individual");
    },
  });

  const { data: stats = { totalUsers: 0, activeScans: 0, totalBookings: 0 } } =
    useQuery({
      queryKey: ["b2c-stats"],
      queryFn: async () => {
        const response = await api.get("/auth/b2c-stats");
        return response.data;
      },
    });

  const addUserMutation = useMutation({
    mutationFn: async (userData: any) => {
      const response = await api.post("/auth/register", {
        ...userData,
        role: "INDIVIDUAL",
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["b2c-users"] });
      setCreatedCredentials({
        email: data.user.email,
        password: data.user.password,
      });
      setIsAddDialogOpen(false);
      setNewUser({ name: "", email: "", phone: "", pinCode: "", password: "" });
      setPinCodeError(null);
      toast.success("B2C user created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to create user");
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await api.patch(`/auth/${id}/status`, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["b2c-users"] });
      toast.success("User status updated");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to update status");
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => {
      if (
        !confirm(
          "Are you sure you want to delete this user? This action cannot be undone.",
        )
      )
        return;
      const response = await api.delete(`/auth/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["b2c-users"] });
      toast.success("User deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to delete user");
    },
  });

  const resetBarcodesMutation = useMutation({
    mutationFn: async (phone: string) => {
      if (!confirm(`Are you sure you want to reset all barcodes for ${phone}?`))
        return;
      const response = await api.post("/emergency/barcodes/reset", { phone });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["b2c-users"] });
      toast.success("Barcodes reset successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to reset barcodes");
    },
  });

  // New User Form State
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    pinCode: "",
    password: "",
  });
  const [pinCodeError, setPinCodeError] = useState<string | null>(null);

  // Credentials State for Success Modal
  const [createdCredentials, setCreatedCredentials] = useState<{
    email: string;
    password: string;
  } | null>(null);

  const filteredUsers = users.filter(
    (user: any) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCreateUser = () => {
    if (!newUser.name || !newUser.email || !newUser.phone) {
      toast.error("Please fill in Name, Email and Phone");
      return;
    }
    const pin = (newUser.pinCode || "").trim();
    if (!pin) {
      setPinCodeError("PIN Code is required for customer creation.");
      return;
    }
    if (!/^\d+$/.test(pin)) {
      setPinCodeError("PIN Code must contain only digits.");
      return;
    }
    if (pin.length !== PIN_CODE_LENGTH) {
      setPinCodeError(`PIN Code must be exactly ${PIN_CODE_LENGTH} digits.`);
      return;
    }
    setPinCodeError(null);
    addUserMutation.mutate(newUser);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Standalone Clients (B2C)
          </h1>
          <p className="text-gray-500 mt-1 font-medium">
            Manage and monitor individual users who are not part of any society.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-[#1e3a5f] hover:bg-[#2d4a6f] text-white rounded-xl h-11 px-6 font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
          >
            <Plus className="h-5 w-5 mr-2" /> Add Client
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 border-0 shadow-sm bg-white rounded-3xl ring-1 ring-black/5">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
            Total B2C Users
          </p>
          <p className="text-3xl font-black text-gray-900">
            {stats.totalUsers}
          </p>
        </Card>
        <Card className="p-6 border-0 shadow-sm bg-white rounded-3xl ring-1 ring-black/5">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
            Active Scans (Daily)
          </p>
          <p className="text-3xl font-black text-teal-600">
            {stats.activeScans}
          </p>
        </Card>
        <Card className="p-6 border-0 shadow-sm bg-white rounded-3xl ring-1 ring-black/5">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
            Total Bookings
          </p>
          <p className="text-3xl font-black text-blue-600">
            {stats.totalBookings}
          </p>
        </Card>
      </div>

      <Card className="border-0 shadow-sm bg-white rounded-[40px] ring-1 ring-black/5 overflow-hidden">
        <CardHeader className="border-b border-gray-50 p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search by name or email..."
                className="pl-12 h-14 rounded-2xl border-0 bg-gray-50 focus:bg-white transition-all font-bold"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow className="border-0">
                <TableHead className="px-8 text-[10px] font-black uppercase text-gray-400">
                  User Details
                </TableHead>
                <TableHead className="text-[10px] font-black uppercase text-gray-400">
                  Contact
                </TableHead>
                <TableHead className="text-[10px] font-black uppercase text-gray-400">
                  Activity
                </TableHead>
                <TableHead className="text-[10px] font-black uppercase text-gray-400">
                  <div
                    className="flex items-center gap-1 cursor-pointer hover:text-gray-600 transition-colors"
                    onClick={() => setShowCredentials(!showCredentials)}
                  >
                    Credentials
                    {showCredentials ? (
                      <EyeOff className="h-3 w-3" />
                    ) : (
                      <Eye className="h-3 w-3" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="text-[10px] font-black uppercase text-gray-400">
                  Status
                </TableHead>
                <TableHead className="text-[10px] font-black uppercase text-gray-400">
                  Joined
                </TableHead>
                <TableHead className="text-[10px] font-black uppercase text-gray-400 text-right px-8">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-10 text-gray-500 font-bold"
                  >
                    No individual clients found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user: any) => (
                  <TableRow
                    key={user.id}
                    className="border-gray-50 group hover:bg-gray-50/50 transition-colors"
                  >
                    <TableCell className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 rounded-full ring-2 ring-gray-100">
                          <AvatarImage src={user.profileImg} alt={user.name} />
                          <AvatarFallback className="bg-[#1e3a5f] text-white font-bold text-sm">
                            {user.name?.charAt(0) || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-gray-900">{user.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                            ID: {user.id}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                          <Mail className="h-3 w-3" /> {user.email}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold">
                          <Smartphone className="h-3 w-3" /> {user.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="rounded-full gap-1 font-bold text-[10px] border-gray-100"
                        >
                          <QrCode className="h-3 w-3" /> {user.activeBarcodes}{" "}
                          QR
                        </Badge>
                        <Badge
                          variant="outline"
                          className="rounded-full gap-1 font-bold text-[10px] border-gray-100"
                        >
                          <TrendingUp className="h-3 w-3" />{" "}
                          {user.serviceRequests} SR
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 group/pass">
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono text-gray-600">
                          {showCredentials
                            ? user.password || "••••••••"
                            : "••••••••"}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover/pass:opacity-100 transition-opacity"
                          onClick={() => copyToClipboard(user.password || "")}
                        >
                          <Copy className="h-3 w-3 text-gray-400" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`border-0 rounded-full text-[10px] font-black px-2 shadow-none uppercase ${
                          user.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                        {user.registeredAt}
                      </div>
                    </TableCell>
                    <TableCell className="text-right px-8">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 rounded-xl hover:bg-white shadow-sm ring-1 ring-black/5 border-0 transition-all opacity-0 group-hover:opacity-100"
                          >
                            <MoreVertical className="h-4 w-4 text-gray-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-56 rounded-2xl p-2 shadow-2xl border-0 ring-1 ring-black/5"
                        >
                          <DropdownMenuItem
                            className="rounded-xl font-bold text-xs uppercase p-3"
                            onClick={() =>
                              (window.location.href = `/dashboard/super-admin/b2c-users/activity?id=${user.id}`)
                            }
                          >
                            <ExternalLink className="h-4 w-4 mr-2 text-blue-600" />{" "}
                            View Activity
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="rounded-xl font-bold text-xs uppercase p-3"
                            onClick={() =>
                              resetBarcodesMutation.mutate(user.phone)
                            }
                          >
                            <Shield className="h-4 w-4 mr-2 text-[#1e3a5f]" />{" "}
                            Reset Barcodes
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className={`rounded-xl font-bold text-xs uppercase p-3 ${user.status === "ACTIVE" ? "text-orange-600 focus:text-orange-600" : "text-green-600 focus:text-green-600"}`}
                            onClick={() =>
                              updateStatusMutation.mutate({
                                id: user.id,
                                status:
                                  user.status === "ACTIVE"
                                    ? "SUSPENDED"
                                    : "ACTIVE",
                              })
                            }
                          >
                            <Ban className="h-4 w-4 mr-2" />{" "}
                            {user.status === "ACTIVE"
                              ? "Suspend Account"
                              : "Activate Account"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="rounded-xl font-bold text-xs uppercase p-3 text-red-600 focus:text-red-600"
                            onClick={() => deleteUserMutation.mutate(user.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Delete Account
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl border-0 p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-xl font-black text-gray-900">
              Add Individual Client
            </DialogTitle>
            <DialogDescription className="font-medium text-gray-500">
              Create a new B2C user account. Login credentials will be generated
              automatically.
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-xs font-bold text-gray-900 uppercase tracking-wide"
              >
                Usage Name
              </Label>
              <Input
                id="name"
                placeholder="e.g. Rahul Sharma"
                className="h-11 rounded-xl bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-[#1e3a5f]"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-xs font-bold text-gray-900 uppercase tracking-wide"
              >
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="e.g. rahul@example.com"
                className="h-11 rounded-xl bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-[#1e3a5f]"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="text-xs font-bold text-gray-900 uppercase tracking-wide"
              >
                Phone Number
              </Label>
              <Input
                id="phone"
                placeholder="e.g. +91 9988776655"
                className="h-11 rounded-xl bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-[#1e3a5f]"
                value={newUser.phone}
                onChange={(e) =>
                  setNewUser({ ...newUser, phone: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="pinCode"
                className="text-xs font-bold text-gray-900 uppercase tracking-wide flex items-center gap-1"
              >
                <MapPin className="h-3.5 w-3.5" />
                PIN Code <span className="text-red-500">*</span>
              </Label>
              <Input
                id="pinCode"
                placeholder={`${PIN_CODE_LENGTH}-digit PIN Code (required for vendor assignment)`}
                className={`h-11 rounded-xl bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-[#1e3a5f] ${pinCodeError ? "ring-2 ring-red-200" : ""}`}
                value={newUser.pinCode}
                onChange={(e) => {
                  setNewUser({
                    ...newUser,
                    pinCode: e.target.value.replace(/\D/g, "").slice(0, PIN_CODE_LENGTH),
                  });
                  setPinCodeError(null);
                }}
                maxLength={PIN_CODE_LENGTH}
                inputMode="numeric"
              />
              {pinCodeError && (
                <p className="text-sm text-red-600 font-medium">{pinCodeError}</p>
              )}
              <p className="text-xs text-gray-500">
                Used to auto-assign the nearest serviceable vendor. API may return &quot;Service not available in your area.&quot; if no vendor covers this PIN Code.
              </p>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-xs font-bold text-gray-900 uppercase tracking-wide"
              >
                Password (Optional)
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type="text"
                  placeholder="Auto-generated if empty"
                  className="h-11 rounded-xl bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-[#1e3a5f] pr-10"
                  value={newUser.password || ""}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Shield className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="p-6 pt-0">
            <div className="flex gap-3 w-full">
              <Button
                variant="outline"
                className="flex-1 rounded-xl h-11 border-gray-200 font-bold"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 rounded-xl h-11 bg-[#1e3a5f] hover:bg-[#2d4a6f] text-white font-bold"
                onClick={handleCreateUser}
              >
                Create Client
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Credentials Success Dialog */}
      <Dialog
        open={!!createdCredentials}
        onOpenChange={(open) => !open && setCreatedCredentials(null)}
      >
        <DialogContent className="sm:max-w-md rounded-3xl border-0 p-0 overflow-hidden">
          <div className="bg-green-500 p-8 text-center text-white">
            <div className="mx-auto w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <DialogTitle className="text-2xl font-black mb-2">
              Account Created!
            </DialogTitle>
            <DialogDescription className="text-green-100 font-medium">
              Please share these login credentials with the user securely.
            </DialogDescription>
          </div>
          <div className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl space-y-2 relative group">
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
                  Email / Username
                </span>
                <div className="flex items-center justify-between">
                  <p className="font-bold text-lg text-gray-900">
                    {createdCredentials?.email}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 hover:bg-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() =>
                      copyToClipboard(createdCredentials?.email || "")
                    }
                  >
                    <Copy className="h-4 w-4 text-gray-400" />
                  </Button>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl space-y-2 relative group">
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
                  Password
                </span>
                <div className="flex items-center justify-between">
                  <p className="font-bold text-lg text-gray-900 font-mono tracking-wider">
                    {createdCredentials?.password}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 hover:bg-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() =>
                      copyToClipboard(createdCredentials?.password || "")
                    }
                  >
                    <Copy className="h-4 w-4 text-gray-400" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-xl text-yellow-800 text-sm font-medium">
              <Shield className="h-5 w-5 shrink-0" />
              <p>
                For security, this password will only be shown once. Please
                ensure it is saved or shared immediately.
              </p>
            </div>
          </div>
          <DialogFooter className="p-6 pt-0">
            <Button
              className="w-full rounded-xl h-12 bg-gray-900 text-white font-bold shadow-lg"
              onClick={() => setCreatedCredentials(null)}
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
