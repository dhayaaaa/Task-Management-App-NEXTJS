"use client";

import React from "react";
import { format } from "date-fns";
import { Badge } from "./ui/badge";
import { Task } from "@/types/types";
import { Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import EditDeleteMenu from "./EditDeleteMenu";
import { useTaskStore } from "@/store/taskStore";
import { useDashboardStore } from "@/store/dashboardStore";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const Kanban = () => {
  const { user } = useDashboardStore();
  const { toast } = useToast();
  const { tasks, setTasks } = useTaskStore();

  const updateTaskStatus = async (task: Task) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/updatetask`;
      const headers = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...task, status: task.status }),
      };
      await fetch(url, headers);
      toast({
        title: "Task Updated",
        variant: "default",
        className: "bg-green-400 text-black",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Error updating task status",
        variant: "default",
        className: "bg-red-400 text-black",
        duration: 2000,
      });
      console.error("Error updating task status:", error);
    }
  };

  const onDragEnd = (result: any) => {
    if (!result.destination || !user?.email) return;

    const draggedItemId = result.draggableId;
    const sourceColumn = result.source.droppableId;
    const destinationColumn = result.destination.droppableId;
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceColumn === destinationColumn) {
      const newTasks = Array.from(tasks);
      const [movedTask] = newTasks.splice(sourceIndex, 1);
      newTasks.splice(destinationIndex, 0, movedTask);
      setTasks(newTasks, user.email);
    } else {
      const taskIndex = tasks.findIndex((task) => task._id === draggedItemId);
      const updatedTask = { ...tasks[taskIndex], status: destinationColumn };
      const newTasks = [
        ...tasks.slice(0, taskIndex),
        updatedTask,
        ...tasks.slice(taskIndex + 1),
      ];
      setTasks(newTasks, user.email);
      updateTaskStatus(updatedTask);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 justify-evenly max-lg:flex-wrap">
        {["To Do", "In Progress", "Completed"].map((status) => (
          <div
            key={status}
            className="dark:bg-secondary bg-gray-200 p-4 rounded-lg w-full"
          >
            <h3 className="font-semibold mb-4">{status}</h3>
            <Droppable droppableId={status}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2 min-h-[100px]"
                >
                  {tasks
                    .filter((task) => task.status === status)
                    .sort((a, b) => a.title.localeCompare(b.title))
                    .map((task, index) => (
                      <Draggable
                        key={task._id}
                        draggableId={task._id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-background p-4 rounded shadow flex justify-between"
                          >
                            <div className="flex flex-col items-start">
                              <Badge className="bg-primary">{task.priority}</Badge>
                              <div className="capitalize">
                                <h3 className="font-semibold text-lg">
                                  {task.title}
                                </h3>
                                {task.description && (
                                  <p className="text-sm text-gray-500 dark:text-gray-400 my-1">
                                    {task.description}
                                  </p>
                                )}
                              </div>
                              {task.dueDate && (
                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {format(new Date(task.dueDate), "MMM d, yyyy")}
                                </div>
                              )}
                            </div>

                            <EditDeleteMenu task={task} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default Kanban;
