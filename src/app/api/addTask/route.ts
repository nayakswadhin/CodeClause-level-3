import { EmployeeModel } from "@/models/employee.model";
import { ProjectModel } from "@/models/project.model";
import { TaskModel } from "@/models/task.model";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const { taskName, taskDescription, deadline, projectId, empId } =
      await req.json();

    const employee = await EmployeeModel.findOne({ _id: new ObjectId(empId) });
    const project = await ProjectModel.findOne({
      _id: new ObjectId(projectId),
    });
    if (!employee) {
      return Response.json(
        { success: false, message: "Employee not Found for this empId" },
        { status: 400 }
      );
    }
    if (!project) {
      return Response.json(
        { success: false, message: "Project not Found for this projectId" },
        { status: 400 }
      );
    }
    const newtask = await TaskModel.create({
      taskName: taskName,
      taskDescription: taskDescription,
      deadline: deadline,
      project: projectId,
      assignedTo: empId,
      isComplete: false,
    });

    employee.tasks.push(newtask);
    await employee.save();

    project.tasks.push(newtask);
    await project.save();

    return Response.json(
      {
        success: true,
        message: "Task created and assigned successfully",
        task: newtask,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      { success: false, message: error, ctach: "This is from error is coming" },
      { status: 400 }
    );
  }
}
