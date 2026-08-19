"use client";

import { useState } from "react";
import { BookOpen, Plus, Pencil, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SocietyService } from "@/services/society.service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/lib/stores/auth-store";

export default function PlatformUpdatesPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const canManage = true;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGuideline, setEditingGuideline] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "SOCIETY",
    content: "",
  });

  const {
    data: guidelines = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["guidelines-for-me", user?.id],
    queryFn: SocietyService.getGuidelinesForMe,
    enabled: !!user?.id,
  });

  const createMutation = useMutation({
    mutationFn: (data: { title: string; content: string; category: string }) =>
      SocietyService.createGuideline({
        ...data,
        societyId: user?.societyId ? Number(user.societyId) : null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: (query) => Boolean(query.queryKey[0]?.toString().includes("guideline")) });
      toast.success("Guideline posted successfully!");
      handleCloseDialog();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to create guideline");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: { title: string; content: string; category: string } }) =>
      SocietyService.updateGuideline(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: (query) => Boolean(query.queryKey[0]?.toString().includes("guideline")) });
      toast.success("Guideline updated successfully!");
      handleCloseDialog();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update guideline");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => SocietyService.deleteGuideline(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: (query) => Boolean(query.queryKey[0]?.toString().includes("guideline")) });
      toast.success("Guideline deleted!");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete guideline");
    },
  });

  const handleOpenAdd = () => {
    setEditingGuideline(null);
    setFormData({ title: "", category: "SOCIETY", content: "" });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (guideline: any) => {
    setEditingGuideline(guideline);
    setFormData({
      title: guideline.title || "",
      category: guideline.category || "SOCIETY",
      content: guideline.content || "",
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingGuideline(null);
    setFormData({ title: "", category: "SOCIETY", content: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error("Please fill title and content");
      return;
    }

    if (editingGuideline) {
      updateMutation.mutate({ id: editingGuideline.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this guideline?")) {
      deleteMutation.mutate(id);
    }
  };

  if (error) {
    toast.error("Failed to load updates and guidelines.");
  }

  return (
    <div className="space-y-6 container mx-auto p-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-900 dark:text-white">
            <BookOpen className="h-8 w-8 text-teal-600" />
            Updates & Guidelines
          </h1>
          <p className="text-muted-foreground text-sm">
            Important updates and community guidelines for you.
          </p>
        </div>

        {canManage && (
          <Button
            onClick={handleOpenAdd}
            size="sm"
            className="bg-teal-600 hover:bg-teal-700 text-white gap-2 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Post New Guideline
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border border-gray-200">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-2/3 mb-2" />
                <Skeleton className="h-4 w-1/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : guidelines.length === 0 ? (
        <Card className="border border-gray-200">
          <CardContent className="py-12 text-center text-gray-500">
            No updates or guidelines have been shared with you yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {guidelines.map((g: any) => (
            <Card
              key={g.id}
              className="border-l-4 border-l-teal-500 border border-gray-200 hover:shadow-md transition-shadow relative"
            >
              <CardHeader className="pb-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {g.title}
                    </CardTitle>
                    {g.category && (
                      <Badge variant="secondary" className="text-xs">
                        {g.category}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        g.society?.name
                          ? "bg-teal-100 text-teal-700 hover:bg-teal-100 border-teal-200"
                          : "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200"
                      }
                    >
                      {g.society?.name || "Official Platform"}
                    </Badge>
                    {canManage && (
                      <div className="flex items-center gap-1 ml-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                          onClick={() => handleOpenEdit(g)}
                          title="Edit Guideline"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(g.id)}
                          title="Delete Guideline"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-700 whitespace-pre-wrap">
                  {g.content}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Dialog Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingGuideline ? "Edit Guideline / Update" : "Post New Guideline / Update"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                placeholder="e.g. Physical Security & Visitor Management Rules"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={formData.category}
                onValueChange={(val) => setFormData({ ...formData, category: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SOCIETY">Society Rule</SelectItem>
                  <SelectItem value="SECURITY">Security & Safety</SelectItem>
                  <SelectItem value="COMMUNITY">Community Living</SelectItem>
                  <SelectItem value="MAINTENANCE">Maintenance & Dues</SelectItem>
                  <SelectItem value="GENERAL">General Notice</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Content / Details *</Label>
              <Textarea
                rows={5}
                placeholder="Enter detailed rules, instructions or update description..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 text-white"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {editingGuideline
                  ? updateMutation.isPending
                    ? "Saving..."
                    : "Update Guideline"
                  : createMutation.isPending
                  ? "Posting..."
                  : "Post Guideline"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
