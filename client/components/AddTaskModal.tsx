"use client";

import { useToast } from "@/hooks/use-toast";
import { EmptyTask } from "@/lib/constants";
import { useTaskStore } from "@/store/taskStore";
import { useModalStore } from "@/store/modalStore";
import { useDashboardStore } from "@/store/dashboardStore";
import { TaskPriority, TaskStatus, User } from "@/types/types";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const AddTaskModal = () => {
  const { newTask, updateTask, setNewTask, addTask } = useTaskStore();
  const { isAddModalOpen, setIsAddModalOpen } = useModalStore();
  const { user, users = [] } = useDashboardStore();
  const { toast } = useToast();

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
    setNewTask(EmptyTask);
  };

  const handleAddTask = async () => {
    try {
      if (newTask._id) {
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/updatetask`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTask),
        });

        updateTask(newTask);
        toast({
          title: "Task Updated",
          className: "bg-green-400 text-black",
          duration: 2000,
        });
      } else {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/addtask`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify({ ...newTask, user: user?.email }),
        });

        const data = await res.json();
        addTask(data.task);
        toast({
          title: "Task Added",
          className: "bg-green-400 text-black",
          duration: 2000,
        });
      }

      setNewTask(EmptyTask);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error adding/updating task:", error);
    }
  };

  return (
    <Dialog open={isAddModalOpen} onOpenChange={handleAddModalClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{newTask._id ? "Edit Task" : "Add New Task"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status">Status</Label>
            <Select
              value={newTask.status}
              onValueChange={(value: TaskStatus) =>
                setNewTask({ ...newTask, status: value })
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="To Do">To Do</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={newTask.priority}
              onValueChange={(value: TaskPriority) =>
                setNewTask({ ...newTask, priority: value })
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={
                newTask.dueDate ? format(new Date(newTask.dueDate), "yyyy-MM-dd") : ""
              }
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  dueDate: e.target.value ? new Date(e.target.value) : undefined,
                })
              }
              className="col-span-3"
            />
          </div>

        </div>

        <DialogFooter>
          <Button type="submit" onClick={handleAddTask}>
            {newTask._id ? "Save Changes" : "Add Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskModal;
