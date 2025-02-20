import dbConnect from "@/lib/dbConnect";
import { EmployeeModel } from "@/models/employee.model";
import { ProjectModel } from "@/models/project.model";
import { TaskModel } from "@/models/task.model";
import { ObjectId } from "mongodb";
import util from "util";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { developerId } = await req.json();

    const tasks = await TaskModel.find({
      assignedTo: new ObjectId(developerId),
    }).populate({
      path: "project",
      select: "projectName",
    });

    if (!tasks || tasks.length == 0) {
      return Response.json(
        {
          success: true,
          message: "No task Assigned",
          tasks: tasks,
        },
        { status: 200 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Projects retrieved successfully",
        tasks: tasks,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching projects:", error);
    return Response.json(
      {
        success: false,
        message: "Failed to fetch projects",
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
