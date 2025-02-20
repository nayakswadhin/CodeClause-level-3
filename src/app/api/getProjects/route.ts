import dbConnect from "@/lib/dbConnect";
import { EmployeeModel } from "@/models/employee.model";
import { ProjectModel } from "@/models/project.model";
import { ObjectId } from "mongodb";
import util from "util";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { managerId } = await req.json();

    const projects = await ProjectModel.find({
      manager: new ObjectId(managerId),
    })
      .populate({
        path: "teamMembers",
        select: "name",
      })
      .populate({
        path: "manager",
        select: "name",
      })
      .lean();

    const transformedProjects = projects.map((project) => ({
      ...project,
      _id: project._id.toString(),
      manager: {
        _id: project.manager._id.toString(),
        name: project.manager.name,
      },
      teamMembers: project.teamMembers.map((member) => ({
        _id: member._id.toString(),
        name: member.name,
      })),
    }));

    if (!transformedProjects || transformedProjects.length === 0) {
      return Response.json(
        { success: false, message: "No project found" },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Projects retrieved successfully",
        projects: transformedProjects,
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
