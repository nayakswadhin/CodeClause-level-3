import { Employee } from "./Employee";
import { Task } from "./Task";

export interface Project {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  employees: Employee[];
  tasks: Task[];
}
