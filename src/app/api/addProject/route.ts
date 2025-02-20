import { EmployeeModel } from "@/models/employee.model";
import { ProjectModel } from "@/models/project.model";
import { TaskModel } from "@/models/task.model";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const { projectName, description, managerId, deadline, teamMembers } =
      await req.json();

    // Validate manager exists
    const manager = await EmployeeModel.findOne({
      _id: new ObjectId(managerId),
    });
    if (!manager) {
      return Response.json(
        { success: false, message: "Manager not found" },
        { status: 400 }
      );
    }

    // Validate all team members exist
    const teamMemberIds = teamMembers.map((id: string) => new ObjectId(id));
    const foundTeamMembers = await EmployeeModel.find({
      _id: { $in: teamMemberIds },
    });

    if (foundTeamMembers.length !== teamMembers.length) {
      return Response.json(
        { success: false, message: "One or more team members not found" },
        { status: 400 }
      );
    }
    const newProject = await ProjectModel.create({
      projectName,
      description,
      manager: managerId,
      deadline: deadline,
      teamMembers: teamMemberIds,
      tasks: [],
    });

    manager.projects.push(newProject);
    manager.teams_managed.push(...teamMemberIds);
    await manager.save();

    await EmployeeModel.updateMany(
      { _id: { $in: teamMemberIds } },
      { $push: { projects: newProject._id } }
    );

    const populatedProject = await ProjectModel.findById(newProject._id)
      .populate("manager", "name empId")
      .populate("teamMembers", "name empId");

    return Response.json(
      {
        success: true,
        message: "Project created and team members assigned successfully",
        project: populatedProject,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating project:", error);
    return Response.json(
      {
        success: false,
        message: "Failed to create project",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 }
    );
  }
}
