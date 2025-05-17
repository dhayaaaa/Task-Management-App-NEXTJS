export type TaskStatus = "To Do" | "In Progress" | "Completed";
export type TaskPriority = "Low" | "Medium" | "High";
export type BoardView = "list" | "kanban";

export interface Task {
  _id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  dueDate?: Date;
  status: TaskStatus;
  assignedTo?: string;
  createdBy?: string;
}
export type User = {
  _id: string; 
  name: string;
  email: string;
  token: string;
};


