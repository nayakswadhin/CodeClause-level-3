import mongoose, { Document, ObjectId, Schema } from "mongoose";
import { Project } from "./project.model";
import { Task } from "./task.model";
import { boolean } from "zod";

export interface Employee extends Document {
  _id: mongoose.Types.ObjectId;
  empId: string;
  name: string;
  address: string;
  email: string;
  password: string;
  phone: string;
  dob: Date;
  doj: Date;
  department: string;
  designation: string;
  otp: string;
  projects: Project[];
  teams_managed: Employee[];
  tasks: (Task | ObjectId)[];
}

const EmployeeSchema: Schema<Employee> = new Schema({
  empId: { type: String, required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  email: { type: String, required: true, match: /.+\@.+\..+/, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  dob: { type: Date, required: true, default: null },
  doj: { type: Date, required: true, default: Date.now },
  department: { type: String, required: true },
  designation: { type: String, required: true, enum: ["manager", "developer"] },
  otp: { type: String, required: true },
  projects: [{ type: Schema.Types.ObjectId, ref: "Project", default: [] }],
  teams_managed: [
    { type: Schema.Types.ObjectId, ref: "Employee", default: [] },
  ],
  tasks: [{ type: Schema.Types.ObjectId, ref: "Task", default: [] }],
});

export const EmployeeModel =
  (mongoose.models.Employee as mongoose.Model<Employee>) ||
  mongoose.model<Employee>("Employee", EmployeeSchema);
