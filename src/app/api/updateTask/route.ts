import dbConnect from "@/lib/dbConnect";
import { EmployeeModel } from "@/models/employee.model";
import { ProjectModel } from "@/models/project.model";
import { TaskModel } from "@/models/task.model";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { taskId, isComplete } = await req.json();

    if (!ObjectId.isValid(taskId)) {
      return Response.json(
        {
          success: false,
          message: "Invalid task ID format",
        },
        { status: 400 }
      );
    }

    const updatedTask = await TaskModel.findByIdAndUpdate(
      new ObjectId(taskId),
      { isComplete },
      { new: true }
    ).populate({
      path: "project",
      select: "projectName",
    });

    if (!updatedTask) {
      return Response.json(
        {
          success: false,
          message: "Task not found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Task updated successfully",
        task: updatedTask,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating task:", error);
    return Response.json(
      {
        success: false,
        message: "Failed to update task",
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
