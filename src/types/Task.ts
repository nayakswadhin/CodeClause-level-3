import { Employee } from "./Employee";

export interface Task {
  id: number;
  title: string;
  description: string;
  assignedTo: Employee;
  progress: number;
  dueDate: string;
}
