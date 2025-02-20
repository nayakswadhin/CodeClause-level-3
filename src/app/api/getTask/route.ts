import dbConnect from "@/lib/dbConnect";
import { TaskModel } from "@/models/task.model";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { projectId } = await req.json();

    const tasks = await TaskModel.find({
      project: new ObjectId(projectId),
    }).populate({ path: "assignedTo", select: "name" });

    console.log(tasks);

    return Response.json(
      {
        success: true,
        message: "tasks retrieved successfully",
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
