import mongoose, { Schema } from "mongoose";
import { Employee } from "./employee.model";
import { Project } from "./project.model";

export interface Task {
  taskName: string;
  taskDescription: string;
  deadline: Date;
  project: Project;
  assignedTo: Employee;
  isComplete: boolean;
}

const TaskSchema: Schema<Task> = new Schema({
  taskName: { type: String, required: true },
  taskDescription: { type: String, required: true },
  deadline: { type: Date, required: true },
  project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  assignedTo: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
  isComplete: { type: Boolean, required: true, default: false },
});

export const TaskModel =
  (mongoose.models.Task as mongoose.Model<Task>) ||
  mongoose.model<Task>("Task", TaskSchema);
