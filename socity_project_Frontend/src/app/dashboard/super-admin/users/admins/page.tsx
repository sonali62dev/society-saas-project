"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  Building2,
  Eye,
  Edit,
  Ban,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
  Mail,
  User,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RoleGuard } from "@/components/auth/role-guard";
import { useSocietyStore } from "@/lib/stores/society-store";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

// Types
interface Admin {
  id: number;
  name: string;
  email: string;
  society: string;
  status: string;
  joinedDate: string;
  lastLogin: string;
  phone?: string;
  designation?: string;
  societyId?: number;
  isPaid?: boolean;
  subscriptionPlan?: string;
  role?: string;
  profileImg?: string | null;
}

export default function SocietyAdminsPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);

  // Fetch Admins with live auto-refresh
  const { data: adminsRaw = [], isLoading } = useQuery({
    queryKey: ["society-admins"],
    queryFn: async () => {
      const response = await api.get("/auth/admins");
      return response.data;
    },
    refetchInterval: 5000, // Live sync every 5s
  });

  const admins = Array.isArray(adminsRaw) ? adminsRaw : [];

  // Fetch Stats with live auto-refresh
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const response = await api.get("/auth/stats");
      return response.data;
    },
    refetchInterval: 5000,
  });

  // Fetch Societies (backend route is /api/society/all)
  const { data: realSocietiesRaw = [] } = useQuery({
    queryKey: ["societies"],
    queryFn: async () => {
      const response = await api.get("/society/all");
      return response.data;
    },
    refetchInterval: 10000,
  });

  const realSocieties = Array.isArray(realSocietiesRaw) ? realSocietiesRaw : [];

  // Mutations
  const addAdminMutation = useMutation({
    mutationFn: (data: any) => api.post("/auth/admins", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["society-admins"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      queryClient.invalidateQueries({ queryKey: ["platform-stats"] });
      queryClient.invalidateQueries({ queryKey: ["societies"] });
      setIsAddAdminOpen(false);
      setNewAdmin({
        name: "",
        email: "",
        phone: "",
        designation: "",
        password: "",
        societyId: "",
        role: "admin",
      });
      toast.success("Admin created successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || "Failed to create admin");
    },
  });

  const updateAdminMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      api.put(`/auth/admins/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["society-admins"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      queryClient.invalidateQueries({ queryKey: ["platform-stats"] });
      queryClient.invalidateQueries({ queryKey: ["societies"] });
      setEditAdmin(null);
      toast.success("Admin updated successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || "Failed to update admin");
    },
  });

  const deleteAdminMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/auth/admins/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["society-admins"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      queryClient.invalidateQueries({ queryKey: ["platform-stats"] });
      queryClient.invalidateQueries({ queryKey: ["societies"] });
      setDeleteAdminId(null);
      toast.success("Admin deleted successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || "Failed to delete admin");
    },
  });

  // New Admin Form State
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    phone: "",
    designation: "",
    password: "",
    societyId: "",
    role: "admin",
  });

  // States for View, Edit, Delete
  const [viewAdmin, setViewAdmin] = useState<Admin | null>(null);
  const [editAdmin, setEditAdmin] = useState<Admin | null>(null);
  const [deleteAdminId, setDeleteAdminId] = useState<number | null>(null);

  // Filter admins
  const filteredAdmins = admins.filter(
    (admin: Admin) =>
      (admin.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (admin.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (admin.society || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleAddAdmin = () => {
    if (
      !newAdmin.name ||
      !newAdmin.email ||
      !newAdmin.password ||
      !newAdmin.societyId
    ) {
      return toast.error("Please fill all required fields");
    }
    addAdminMutation.mutate(newAdmin);
  };

  const handleUpdateAdmin = () => {
    if (!editAdmin) return;
    updateAdminMutation.mutate({
      id: editAdmin.id,
      data: {
        name: editAdmin.name,
        email: editAdmin.email,
        phone: editAdmin.phone,
        societyId: editAdmin.societyId,
        status: editAdmin.status,
      },
    });
  };

  const handleDeleteAdmin = () => {
    if (deleteAdminId === null) return;
    deleteAdminMutation.mutate(deleteAdminId);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "suspended":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            <XCircle className="h-3 w-3 mr-1" />
            Suspended
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentBadge = (isPaid: boolean) => {
    return isPaid ? (
      <Badge className="bg-teal-100 text-teal-700 hover:bg-teal-100 border-teal-200">
        <CheckCircle className="h-3 w-3 mr-1" />
        Paid
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">
        <XCircle className="h-3 w-3 mr-1" />
        Unpaid
      </Badge>
    );
  };

  return (
    <RoleGuard allowedRoles={["super_admin"]}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Society Admins</h1>
            <p className="text-gray-600">
              Manage all society administrators on the platform
            </p>
          </div>
          <Button
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
            onClick={() => setIsAddAdminOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Admin
          </Button>
        </div>

        {/* Stats - Dynamic calculations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {stats?.activeAdmins ?? admins.filter((a: Admin) => (a.status || "active").toLowerCase() === "active").length}
                  </p>
                  <p className="text-sm text-gray-500">Active Admins</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {stats?.totalAdmins ?? admins.length}
                  </p>
                  <p className="text-sm text-gray-500">Total Admins</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {stats?.pendingAdmins ?? admins.filter((a: Admin) => (a.status || "").toLowerCase() === "pending").length}
                  </p>
                  <p className="text-sm text-gray-500">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {stats?.suspendedAdmins ?? admins.filter((a: Admin) => (a.status || "").toLowerCase() === "suspended" || (a.status || "").toLowerCase() === "inactive").length}
                  </p>
                  <p className="text-sm text-gray-500">Suspended</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, or society..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admins Table */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>All Society Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Admin</TableHead>
                  <TableHead>Society</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-10 w-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-10 w-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-10 w-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-10 w-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-10 w-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-10 w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredAdmins.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-10 text-gray-500"
                    >
                      No administrators found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAdmins.map((admin: Admin) => (
                    <TableRow key={admin.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage
                              src={admin.profileImg || undefined}
                              alt={admin.name}
                            />
                            <AvatarFallback className="bg-purple-100 text-purple-700 font-bold">
                              {admin.name
                                ?.split(" ")
                                .map((n: string) => n[0])
                                .join("") || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{admin.name}</p>
                            <p className="text-xs text-gray-500">
                              {admin.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-3 w-3 text-gray-400" />
                          <span className="text-sm font-medium">
                            {typeof admin.society === 'object' ? (admin.society as any).name : admin.society}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{getPaymentBadge(admin.isPaid ?? false)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {admin.role || 'admin'}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(admin.status)}</TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {admin.joinedDate}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {admin.lastLogin}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu modal={false}>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-gray-100 rounded-full"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onSelect={() =>
                                setTimeout(() => setViewAdmin(admin), 0)
                              }
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={() =>
                                setTimeout(() => setEditAdmin(admin), 0)
                              }
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Admin
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600 focus:bg-red-50"
                              onSelect={() =>
                                setTimeout(() => setDeleteAdminId(admin.id), 0)
                              }
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Admin
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

        {/* View Admin Dialog */}
        <Dialog open={!!viewAdmin} onOpenChange={() => setViewAdmin(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Admin Profile</DialogTitle>
            </DialogHeader>
            {viewAdmin && (
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-xl bg-purple-100 text-purple-700">
                      {viewAdmin.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-lg">{viewAdmin.name}</h3>
                    <p className="text-gray-500">
                      {viewAdmin.designation || "Administrator"}
                    </p>
                    <div className="flex gap-2 mt-2">
                      {getStatusBadge(viewAdmin.status)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="space-y-1">
                    <Label className="text-gray-500 text-xs">Email</Label>
                    <p className="font-medium">{viewAdmin.email}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-gray-500 text-xs">Phone</Label>
                    <p className="font-medium">{viewAdmin.phone || "N/A"}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-gray-500 text-xs">Society</Label>
                    <p className="font-medium">{typeof viewAdmin.society === 'object' ? (viewAdmin.society as any).name : viewAdmin.society}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-gray-500 text-xs">Payment Status</Label>
                    <div className="mt-1">{getPaymentBadge(viewAdmin.isPaid ?? false)}</div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-gray-500 text-xs">Joined Date</Label>
                    <p className="font-medium">{viewAdmin.joinedDate}</p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Admin Dialog */}
        <Dialog open={!!editAdmin} onOpenChange={() => setEditAdmin(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Administrator</DialogTitle>
              <DialogDescription>
                Update admin details and permissions.
              </DialogDescription>
            </DialogHeader>
            {editAdmin && (
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    value={editAdmin.name}
                    onChange={(e) =>
                      setEditAdmin({ ...editAdmin, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    value={editAdmin.email}
                    onChange={(e) =>
                      setEditAdmin({ ...editAdmin, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={editAdmin.phone || ""}
                    onChange={(e) =>
                      setEditAdmin({ ...editAdmin, phone: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Designation</Label>
                  <Input
                    value={editAdmin.designation || ""}
                    onChange={(e) =>
                      setEditAdmin({
                        ...editAdmin,
                        designation: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Society</Label>
                  <Select
                    value={editAdmin.societyId?.toString()}
                    onValueChange={(val) =>
                      setEditAdmin({ ...editAdmin, societyId: parseInt(val) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Society" />
                    </SelectTrigger>
                    <SelectContent>
                      {realSocieties.map((society: any) => (
                        <SelectItem
                          key={society.id}
                          value={society.id.toString()}
                        >
                          {society.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={editAdmin.status}
                    onValueChange={(val) =>
                      setEditAdmin({ ...editAdmin, status: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditAdmin(null)}>
                Cancel
              </Button>
              <Button
                onClick={handleUpdateAdmin}
                disabled={updateAdminMutation.isPending}
              >
                {updateAdminMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteAdminId !== null}
          onOpenChange={() => setDeleteAdminId(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Administrator</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this administrator? This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteAdminId(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteAdmin}
                disabled={deleteAdminMutation.isPending}
              >
                {deleteAdminMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Admin Dialog (Existing) */}
        <Dialog open={isAddAdminOpen} onOpenChange={setIsAddAdminOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Society Admin</DialogTitle>
              <DialogDescription>
                Create a new administrator account and assign them to a society.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="e.g. John Doe"
                    className="pl-10 h-11"
                    value={newAdmin.name}
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, name: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="e.g. admin@society.com"
                    className="pl-10 h-11"
                    value={newAdmin.email}
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input
                  placeholder="+91 98765 43210"
                  className="h-11"
                  value={newAdmin.phone}
                  onChange={(e) =>
                    setNewAdmin({ ...newAdmin, phone: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Designation</Label>
                <Input
                  placeholder="e.g. Secretary, Chairman"
                  className="h-11"
                  value={newAdmin.designation}
                  onChange={(e) =>
                    setNewAdmin({ ...newAdmin, designation: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Temporary Password</Label>
                <Input
                  type="password"
                  placeholder="********"
                  className="h-11"
                  value={newAdmin.password}
                  onChange={(e) =>
                    setNewAdmin({ ...newAdmin, password: e.target.value })
                  }
                />
                <p className="text-xs text-gray-500">
                  Must be at least 8 characters.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Assign Society</Label>
                <Select
                  value={newAdmin.societyId}
                  onValueChange={(val) =>
                    setNewAdmin({ ...newAdmin, societyId: val })
                  }
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select a society" />
                  </SelectTrigger>
                  <SelectContent>
                    {realSocieties.map((society: any) => (
                      <SelectItem
                        key={society.id}
                        value={society.id.toString()}
                      >
                        {society.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddAdminOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddAdmin}
                className="bg-purple-600 hover:bg-purple-700"
                disabled={
                  addAdminMutation.isPending ||
                  !newAdmin.name ||
                  !newAdmin.email ||
                  !newAdmin.password ||
                  !newAdmin.societyId
                }
              >
                {addAdminMutation.isPending ? "Creating..." : "Create Account"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </RoleGuard>
  );
}
