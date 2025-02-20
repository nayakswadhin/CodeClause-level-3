import mongoose, { Schema } from "mongoose";
import { Employee } from "./employee.model";
import { Task } from "./task.model";

export interface Project {
  projectName: string;
  description: string;
  manager: Employee;
  deadline: Date;
  teamMembers: Employee[];
  tasks: Task[];
}

const ProjectSchema: Schema<Project> = new Schema({
  projectName: { type: String, required: true },
  description: { type: String },
  manager: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
  deadline: { type: Date, required: true },
  teamMembers: [{ type: Schema.Types.ObjectId, ref: "Employee", default: [] }],
  tasks: [{ type: Schema.Types.ObjectId, ref: "Task", default: [] }],
});

export const ProjectModel =
  (mongoose.models.Project as mongoose.Model<Project>) ||
  mongoose.model<Project>("Project", ProjectSchema);
