import { sendVerificationCode } from "@/helper/sendVerificationCode";
import dbConnect from "@/lib/dbConnect";
import { EmployeeModel } from "@/models/employee.model";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { email, verifyCode } = await req.json();
    const findUser = await EmployeeModel.findOne({ email: email });
    if (!findUser) {
      return Response.json(
        { success: false, message: "User not found with this email address." },
        { status: 404 }
      );
    }
    console.log(findUser);
    if (findUser.otp == verifyCode) {
      return Response.json(
        {
          success: true,
          message: "Email Verified successfully!!",
          isVerified: true,
        },
        { status: 200 }
      );
    }

    return Response.json(
      {
        success: false,
        message: "Send Correct OTP",
        isVerified: false,
      },
      { status: 400 }
    );
  } catch (error) {
    console.log(error);
    Response.json({ success: false, message: error }, { status: 400 });
  }
}
