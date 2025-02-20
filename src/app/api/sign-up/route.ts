import { sendVerificationCode } from "@/helper/sendVerificationCode";
import dbConnect from "@/lib/dbConnect";
import { EmployeeModel } from "@/models/employee.model";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  await dbConnect();
  try {
    const {
      name,
      address,
      email,
      password,
      phone,
      dob,
      department,
      designation,
    } = await req.json();
    const existingUser = await EmployeeModel.findOne({ email: email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    if (existingUser) {
      return Response.json(
        {
          success: false,
          message: "Email already present!! Try with another Email",
        },
        { status: 500 }
      );
    }
    // Send Verification Email
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await EmployeeModel.create({
      empId: 1,
      name: name,
      address: address,
      email: email,
      password: hashedPassword,
      phone: phone,
      dob: dob,
      doj: new Date(),
      department: department,
      designation: designation,
      otp: verifyCode,
      projects: [],
      teams_managed: [],
      tasks: [],
    });
    const userId = newUser._id?.toString();
    console.log(userId);
    const emailResponse = await sendVerificationCode(email, name, verifyCode);
    if (emailResponse.status)
      return Response.json(
        {
          success: true,
          message: emailResponse,
          userId: userId,
          user: newUser,
        },
        { status: 200 }
      );
  } catch (error) {
    console.log("Error in registering user\n", error);
    return Response.json(
      { success: false, message: "Error in registering the user" },
      { status: 500 }
    );
  }
}
