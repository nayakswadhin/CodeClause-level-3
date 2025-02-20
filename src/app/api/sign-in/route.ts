import { sendVerificationCode } from "@/helper/sendVerificationCode";
import dbConnect from "@/lib/dbConnect";
import { EmployeeModel } from "@/models/employee.model";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { email, password } = await req.json();
    const findUser = await EmployeeModel.findOne({ email: email });
    console.log(findUser);
    if (!findUser) {
      return Response.json(
        { success: false, message: "User not found with this email address." },
        { status: 404 }
      );
    }

    const isPasswordMatch = await bcrypt.compare(password, findUser.password);
    if (!isPasswordMatch) {
      return Response.json(
        { success: false, message: "Incorrect Password!!" },
        { status: 400 }
      );
    }
    // sending email
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    findUser.otp = verifyCode;
    await findUser.save();

    const emailResponse = await sendVerificationCode(
      email,
      findUser.name,
      verifyCode
    );
    if (!emailResponse.status) {
      return Response.json(
        { success: false, message: emailResponse },
        { status: 400 }
      );
    }
    const userId = findUser._id?.toString();
    return Response.json(
      {
        success: true,
        message: "Verification mail has been sent to your email",
        user: findUser,
        userId: userId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    Response.json({ success: false, message: error }, { status: 400 });
  }
}
