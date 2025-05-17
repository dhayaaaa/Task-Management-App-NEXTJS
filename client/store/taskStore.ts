import { EmptyTask } from "@/lib/constants";
import { Task } from "@/types/types";
import { create } from "zustand";

export type State = {
  tasks: Task[];
  newTask: Task;
  taskToDelete: string;
  categorizedTasks: {
    assignedToMe: Task[];  
    createdByMe: Task[];
    overdue: Task[];
  };
};

export type Actions = {
  setNewTask: (task: Task) => void;
  setTaskToDelete: (_id: string) => void;
  addTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  updateTask: (task: Task) => void;
  setTasks: (tasks: Task[], userEmail: string) => void;
};

export const useTaskStore = create<State & Actions>((set) => ({
  tasks: [],
  newTask: EmptyTask,
  taskToDelete: "",
  categorizedTasks: {
    assignedToMe: [],
    createdByMe: [],
    overdue: [],
  },

  setNewTask: (task: Task) => set({ newTask: task }),

  setTaskToDelete: (_id: string) => set({ taskToDelete: _id }),

  addTask: (task: Task) => {
    set((state) => {
      const updatedTasks = [...state.tasks, { ...task }];
      return {
        tasks: updatedTasks,
      };
    });
  },

  deleteTask: (_id: string) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task._id !== _id),
    })),

  updateTask: (task: Task) =>
    set((state) => {
      const updatedTasks = state.tasks.map((t) =>
        t._id === task._id ? task : t
      );
      return {
        tasks: updatedTasks,
      };
    }),

  setTasks: (tasks: Task[], userEmail: string) => {
    const now = new Date();

    const assignedToMe = tasks.filter((task) => task.assignedTo === userEmail);
    const createdByMe = tasks.filter((task) => task.createdBy === userEmail);
    const overdue = tasks.filter(
      (task) =>
        task.assignedTo === userEmail &&
        task.dueDate &&
        new Date(task.dueDate) < now &&
        task.status !== "Completed"
    );

    set({
      tasks,
      categorizedTasks: {
        assignedToMe,
        createdByMe,
        overdue,
      },
    });
  },
}));
