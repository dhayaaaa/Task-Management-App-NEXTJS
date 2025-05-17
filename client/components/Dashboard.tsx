"use client";

import Header from "./Header";
import Kanban from "./Kanban";
import Sidebar from "./Sidebar";
import { useEffect } from "react";
import Tasklist from "./Tasklist";
import { useRouter } from "next/navigation";
import { useTaskStore } from "@/store/taskStore";
import { useDashboardStore } from "@/store/dashboardStore";

export function DashboardComponent() {
  const { boardView, user, setUser } = useDashboardStore();
  const { setTasks, categorizedTasks } = useTaskStore();
  const router = useRouter();

  const fetchTasks = async () => {
    if (!user?.email) return;
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/alltasks`;
    const headers = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: user?.token || "",
      },
      body: JSON.stringify({ user: user?.email }),
    };

    const res = await fetch(url, headers);
    const result = await res.json();
    setTasks(result.tasks, user.email);
  };

  useEffect(() => {
    setUser(
      localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user") as string)
        : null
    );
  }, []);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  useEffect(() => {
    if (user?.email) {
      fetchTasks();
    }
  }, [user?.email]);

  if (!user) return null;

  return (
    <div className="flex max-sm:flex-col h-screen" style={{ backgroundColor: "#FFF2D7" }}>
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">
        <Header />

        {/* Task Categories Section */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <div className="bg-white rounded-xl p-4 shadow">
            <h2 className="text-xl font-semibold mb-2">
              Assigned to Me
            </h2>
            <ul className="space-y-2">
              {categorizedTasks.assignedToMe.map((task) => (
                <li key={task._id} className="border p-2 rounded bg-gray-50">{task.title}</li>
              ))}
              {categorizedTasks.assignedToMe.length === 0 && <p className="text-gray-500">No tasks.</p>}
            </ul>
          </div>

          <div className="bg-white rounded-xl p-4 shadow">
            <h2 className="text-xl font-semibold mb-2">
              Overdue Tasks ({categorizedTasks.overdue.length})
            </h2>
            <ul className="space-y-2">
              {categorizedTasks.overdue.map((task) => (
                <li key={task._id} className="border p-2 rounded bg-red-100 text-red-800">
                  {task.title}
                </li>
              ))}
              {categorizedTasks.overdue.length === 0 && <p className="text-gray-500">No overdue tasks.</p>}
            </ul>
          </div>
        </div>

        {/* Task View */}
        {boardView === "list" ? <Tasklist /> : <Kanban />}
      </div>
    </div>
  );
}
