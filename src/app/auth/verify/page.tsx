"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function VerifyEmail() {
  const [code, setCode] = useState("");
  const router = useRouter();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle verification logic here
    const email = sessionStorage.getItem("email");

    if (!email) {
      alert("Email not found in session storage!");
      return;
    }

    axios
      .post("http://localhost:3000/api/verify-otp", {
        email: email,
        verifyCode: code,
      })
      .then((res) => {
        if (res.data.isVerified) {
          router.push("/");
        } else {
          alert("Invalid OTP");
        }
      })
      .catch((e) => {
        alert(e.response.data.message);
        console.log(e);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Verify your email
          </h2>
          <p className="text-gray-600">
            We have sent a verification code to your email address. Please enter
            it below.
          </p>
        </div>
        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="Enter verification code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full text-center text-2xl tracking-widest py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              maxLength={6}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
          >
            Verify Email
          </button>
        </form>
      </div>
    </div>
  );
}
