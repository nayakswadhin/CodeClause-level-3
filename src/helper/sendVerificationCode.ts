import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import { resend } from "@/lib/resend";

export async function sendVerificationCode(
  email: string,
  name: string,
  otp: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Task Management | Verification Code",
      react: VerificationEmail({ username: name, otp: otp }),
    });

    return { status: 200, message: "Email sent successfully" };
  } catch (error) {
    console.log("Error in sending email\n", error);
    return { status: 500, message: "Error in sending email" };
  }
}
