import dbConnect from "@/lib/dbConnect";
import { EmployeeModel } from "@/models/employee.model";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const developers = await EmployeeModel.find({ designation: "developer" });

    if (!developers || developers.length === 0) {
      return Response.json(
        { success: false, message: "No developers found" },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Developers retrieved successfully",
        data: developers,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching developers:", error);
    return Response.json(
      {
        success: false,
        message: "Failed to fetch developers",
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
