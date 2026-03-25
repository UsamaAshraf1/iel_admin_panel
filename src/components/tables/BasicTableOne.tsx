"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import supabase from "../../../SupabaseConfig";
// import { toast } from "sonner"; 

interface Profile {
  id: number | string;
  email: string;
  username: string;
  account: boolean;
  block: boolean;
  full_name:string;
}

export default function BasicTableOne() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | string | null>(null);

  useEffect(() => {
    async function fetchProfiles() {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("profiles")
          .select("id, email, username, account, block,full_name")
          .order("id", { ascending: true });

        if (error) throw error;

        // Exclude admin user
        const filteredData = (data || []).filter(
          (profile) => profile.email !== "iel@admin.com"
        );

        setProfiles(filteredData);
      } catch (err) {
        console.error("Error fetching profiles:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchProfiles();
  }, []);

  // Function to toggle block status
  const toggleBlockStatus = async (profile: Profile) => {
    const newBlockStatus = !profile.block;

    // Optimistic UI update
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === profile.id ? { ...p, block: newBlockStatus } : p
      )
    );

    setUpdatingId(profile.id);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ block: newBlockStatus })
        .eq("id", profile.id);

      if (error) throw error;

      // Optional: Show success toast
      // toast.success(`User ${newBlockStatus ? "blocked" : "unblocked"} successfully`);
    } catch (err) {
      console.error("Error updating block status:", err);

      // Revert optimistic update on error
      setProfiles((prev) =>
        prev.map((p) =>
          p.id === profile.id ? { ...p, block: profile.block } : p
        )
      );

      // Optional: Show error toast
      // toast.error("Failed to update user status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading profiles...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        {error}
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No users found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="w-full">
        <div className="w-full">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  User
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Email
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Account Status
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  User Status
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {profiles.map((profile) => (
                <TableRow key={profile.id}>
                  {/* User */}
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div>
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {profile.full_name || "N/A"}
                      </span>
                      <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                        User ID: {profile.id}
                      </span>
                    </div>
                  </TableCell>

                  {/* Email */}
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {profile.email}
                  </TableCell>

                  {/* Account Status */}
                  <TableCell className="px-4 py-3 text-start">
                    <Badge size="sm" color={profile.account ? "success" : "error"}>
                      {profile.account ? "Linked" : "Unlinked"}
                    </Badge>
                  </TableCell>

                  {/* User Status - Clickable to toggle block */}
                  <TableCell className="px-4 py-3 text-start">
                    <button
                      onClick={() => toggleBlockStatus(profile)}
                      disabled={updatingId === profile.id}
                      className={`focus:outline-none transition-all ${
    updatingId === profile.id 
      ? "opacity-50 cursor-not-allowed" 
      : "cursor-pointer hover:opacity-80"
  }`}
                    >
                      <Badge
                        size="sm"
                        color={profile.block ? "error" : "success"}
                        // className={updatingId === profile.id ? "opacity-50" : "cursor-pointer hover:opacity-80 transition"}
                      >
                        {updatingId === profile.id
                          ? "Updating..."
                          : profile.block
                          ? "User Blocked"
                          : "Active User"}
                      </Badge>
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}