"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { connectSocket, connectPlatformAdmin } from "@/lib/socket";
import { useQueryClient } from "@tanstack/react-query";

/**
 * When a user (added by admin/superadmin) updates their profile (name/photo),
 * this listener invalidates user-list queries so the admin who added them sees the update.
 */
export default function ProfileUpdateNotificationListener() {
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || !user) return;
    // Only admins/superadmins need to refetch user lists when someone updates profile
    const isAdmin =
      user.role === "super_admin" ||
      user.role === "admin" ||
      user.role === "committee";
    if (!isAdmin) return;

    let socket:
      | ReturnType<typeof connectPlatformAdmin>
      | ReturnType<typeof connectSocket>
      | null = null;
    if (user.role === "super_admin") {
      socket = connectPlatformAdmin();
    } else if (user.societyId) {
      socket = connectSocket(user.societyId);
    }

    if (!socket) return;

    const handler = () => {
      queryClient.invalidateQueries({ queryKey: ["b2c-users"] });
      queryClient.invalidateQueries({ queryKey: ["society-admins"] });
      queryClient.invalidateQueries({ queryKey: ["platform-users"] });
      queryClient.invalidateQueries({ queryKey: ["users-for-chat"] });
    };

    socket.on("user-profile-updated", handler);
    return () => {
      socket?.off("user-profile-updated", handler);
    };
  }, [isAuthenticated, user?.id, user?.role, user?.societyId, queryClient]);

  return null;
}
