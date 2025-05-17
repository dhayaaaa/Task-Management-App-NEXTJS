"use client";
import { Plus, User2, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { useModalStore } from "@/store/modalStore";
import { useDashboardStore } from "@/store/dashboardStore";

const Header = () => {
  const { setIsAddModalOpen } = useModalStore();
  const { boardView, user } = useDashboardStore();

  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-xl text-nowrap md:text-2xl font-bold dark:text-white">
        {boardView === "list" ? "List View" : "Board View"}
      </h2>

      <div className="flex items-center gap-2">
        {/* Add Task Button */}
        {!showProfile && (
          <Button size="sm" onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        )}

        {/* Profile Button */}
        <Button variant="outline" size="icon" onClick={() => setShowProfile(!showProfile)}>
          {showProfile ? <ArrowLeft className="h-4 w-4" /> : <User2 className="h-4 w-4" />}
        </Button>
      </div>

      {/* Profile Panel */}
      {showProfile && (
        <div className="absolute right-4 top-16 w-64 rounded-lg border bg-white dark:bg-gray-900 p-4 shadow-lg z-50">
          <p className="text-sm text-gray-600 dark:text-gray-300">Name:</p>
          <p className="mb-2 font-semibold text-black dark:text-white">
            {user?.name || "Guest"}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Email:</p>
          <p className="font-semibold text-black dark:text-white">
            {user?.email || "Not logged in"}
          </p>
        </div>
      )}
    </div>
  );
};

export default Header;
