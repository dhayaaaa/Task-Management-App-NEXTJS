"use client";

import React, { useEffect, useState, useMemo } from "react";
import { format, isToday, isThisWeek, isBefore } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import EditDeleteMenu from "./EditDeleteMenu";
import { Button } from "@/components/ui/button";
import { useTaskStore } from "@/store/taskStore";
import { TaskPriority, TaskStatus } from "@/types/types";
import {
  Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface User {
  _id: string;
  name: string;
  email: string;
}

const Tasklist = () => {
  const { toast } = useToast();
  const { tasks, updateTask } = useTaskStore();

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortBy, setSortBy] = useState<"title" | "priority" | "dueDate" | "none">("none");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "all">("all");
  const [dueDateFilter, setDueDateFilter] = useState<"all" | "today" | "thisWeek" | "overdue" | "noDueDate">("all");
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/allusers`);
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const data = await res.json();
        setUsers(data.users || []);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUsers();
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus = statusFilter === "all" || task.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
      const matchesDueDate = (() => {
        if (dueDateFilter === "all") return true;
        if (!task.dueDate) return dueDateFilter === "noDueDate";
        const due = new Date(task.dueDate);
        if (dueDateFilter === "today") return isToday(due);
        if (dueDateFilter === "thisWeek") return isThisWeek(due);
        if (dueDateFilter === "overdue") return isBefore(due, new Date());
        return true;
      })();
      return matchesStatus && matchesPriority && matchesDueDate;
    });
  }, [tasks, statusFilter, priorityFilter, dueDateFilter]);

  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      if (sortBy === "title") {
        return sortOrder === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
      if (sortBy === "priority") {
        const priorityOrder = { Low: 0, Medium: 1, High: 2 };
        return sortOrder === "asc"
          ? priorityOrder[a.priority] - priorityOrder[b.priority]
          : priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      if (sortBy === "dueDate") {
        const aDate = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const bDate = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
      }
      return 0;
    });
  }, [filteredTasks, sortBy, sortOrder]);

  const handleUpdate = async (updatedTask: any) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/updatetask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask),
    });
    if (res.ok) {
      updateTask(updatedTask);
      toast({ title: "Task Updated", className: "bg-green-400 text-black", duration: 2000 });
    } else throw new Error("Update failed");
  } catch {
    toast({ title: "Update failed", variant: "destructive" });
  }
};


  return (
    <div>
      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-4 justify-start">
        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={(val) => {
          const valid = ["To Do", "In Progress", "Completed", "all"] as const;
          if (valid.includes(val as any)) setStatusFilter(val as TaskStatus | "all");
        }}>
          <SelectTrigger className="w-fit px-4 bg-background dark:bg-secondary">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="To Do">To Do</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        {/* Priority Filter */}
        <Select value={priorityFilter} onValueChange={(val) => {
          const valid = ["Low", "Medium", "High", "all"] as const;
          if (valid.includes(val as any)) setPriorityFilter(val as TaskPriority | "all");
        }}>
          <SelectTrigger className="w-fit px-4 bg-background dark:bg-secondary">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="High">High</SelectItem>
          </SelectContent>
        </Select>

        {/* Due Date Filter */}
        <Select value={dueDateFilter} onValueChange={(val) => {
          const valid = ["all", "today", "thisWeek", "overdue", "noDueDate"] as const;
          if (valid.includes(val as any)) setDueDateFilter(val as typeof dueDateFilter);
        }}>
          <SelectTrigger className="w-fit px-4 bg-background dark:bg-secondary">
            <SelectValue placeholder="Filter by due date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Due Dates</SelectItem>
            <SelectItem value="today">Due Today</SelectItem>
            <SelectItem value="thisWeek">Due This Week</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="noDueDate">No Due Date</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort By */}
        <Select value={sortBy} onValueChange={(val) => {
          const valid = ["title", "priority", "dueDate", "none"] as const;
          if (valid.includes(val as any)) setSortBy(val as typeof sortBy);
        }}>
          <SelectTrigger className="w-fit px-4 bg-background dark:bg-secondary">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Sorting</SelectItem>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="dueDate">Due Date</SelectItem>
          </SelectContent>
        </Select>

        {sortBy !== "none" && (
          <Button variant="outline" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
            {sortOrder === "asc" ? "Ascending" : "Descending"}
          </Button>
        )}
      </div>

      {/* Task Table */}
      <div className="py-4 space-y-2">
        {sortedTasks.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-6">No tasks found</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tasks</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Menu</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTasks.map((task) => (
                <TableRow key={task._id}>
                  <TableCell className="w-1/2 space-y-2 text-nowrap capitalize">
                    <div>
                      <h3 className="font-semibold text-base">{task.title}</h3>
                      {task.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{task.description}</p>
                      )}
                      <p className="text-xs italic text-muted-foreground mt-1">Created by: users.find((user.name))</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-nowrap">
                    <Select
  value={task.assignedTo || ""}
  onValueChange={(value) => {
    if (value !== task.assignedTo) {
      handleUpdate({ ...task, assignedTo: value });
    }
  }}
>
  <SelectTrigger className="w-32 bg-background dark:bg-secondary">
    <SelectValue>
      {
        users.find((user) => user.email === task.assignedTo)?.name || "Assign to"
      }
    </SelectValue>
  </SelectTrigger>
  <SelectContent>
    {users.map((user) => (
      <SelectItem key={user._id} value={user.email}>
        {user.name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

                  </TableCell>
                  <TableCell className="text-nowrap">
                    {task.dueDate ? format(new Date(task.dueDate), "MMM d, yyyy") : "No Due Date"}
                  </TableCell>
                  <TableCell className="text-nowrap">{task.priority}</TableCell>
                  <TableCell className="text-nowrap">
                    <Select
                      value={task.status}
                      onValueChange={(value) => {
                        if (value !== task.status) handleUpdate({ ...task, status: value });
                      }}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Status</SelectLabel>
                          <SelectItem value="To Do">To Do</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <EditDeleteMenu task={task} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={6}>Total Tasks: {sortedTasks.length}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        )}
      </div>
    </div>
  );
};

export default Tasklist;
