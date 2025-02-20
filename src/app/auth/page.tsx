"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema } from "@/schemas/signInSchema";
import { signUpSchema } from "@/schemas/signUpSchema";
import { Calendar, ChevronDown, Lock, Mail, User } from "lucide-react";
import { format } from "date-fns";
import axios from "axios";
import { useRouter } from "next/navigation";

type AuthMode = "signin" | "signup";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [showCalendar, setShowCalendar] = useState(false);

  const signInForm = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signUpForm = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      phone: "",
      password: "",
      dob: new Date(),
      department: "",
      designation: "developer",
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSignIn = async (data: any) => {
    console.log("Sign in data:", data);
    // Handle sign in logic here
    axios
      .post("http://localhost:3000/api/sign-in", {
        email: data.email,
        password: data.password,
      })
      .then((res) => {
        console.log(res);
        sessionStorage.setItem("email", data.email);
        sessionStorage.setItem("userId", res.data.userId);
        sessionStorage.setItem("designation", res.data.user.designation);
        sessionStorage.setItem("name", res.data.user.name);
        router.push("/");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSignUp = async (data: any) => {
    console.log("Sign up data:", data);
    // Handle sign up logic here
    axios
      .post("http://localhost:3000/api/sign-up", {
        name: data.name,
        address: data.address,
        email: data.email,
        password: data.password,
        phone: data.phone,
        dob: data.dob,
        department: data.department,
        designation: data.designation,
      })
      .then((res) => {
        console.log(res.data);
        sessionStorage.setItem("email", data.email);
        sessionStorage.setItem("userId", res.data.userId);
        sessionStorage.setItem("designation", res.data.user.designation);
        sessionStorage.setItem("name", res.data.user.name);
        router.push("/");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            {mode === "signin" ? (
              <Lock className="h-6 w-6 text-blue-600" />
            ) : (
              <User className="h-6 w-6 text-blue-600" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {mode === "signin" ? "Welcome back" : "Create an account"}
          </h2>
          <p className="text-gray-600">
            {mode === "signin"
              ? "Enter your credentials to access your account"
              : "Fill in the details below to get started"}
          </p>
        </div>

        {mode === "signin" ? (
          <form
            onSubmit={signInForm.handleSubmit(onSignIn)}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  {...signInForm.register("email")}
                  className="block w-full pl-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Enter your email"
                />
              </div>
              {signInForm.formState.errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {signInForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  {...signInForm.register("password")}
                  className="block w-full pl-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Enter your password"
                />
              </div>
              {signInForm.formState.errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {signInForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
            >
              Sign In
            </button>
          </form>
        ) : (
          <form
            onSubmit={signUpForm.handleSubmit(onSignUp)}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                {...signUpForm.register("name")}
                className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Enter your name"
              />
              {signUpForm.formState.errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {signUpForm.formState.errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                {...signUpForm.register("email")}
                className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Enter your email"
              />
              {signUpForm.formState.errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {signUpForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                {...signUpForm.register("address")}
                className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Enter your address"
              />
              {signUpForm.formState.errors.address && (
                <p className="mt-1 text-sm text-red-600">
                  {signUpForm.formState.errors.address.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                {...signUpForm.register("phone")}
                className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Enter your phone number"
              />
              {signUpForm.formState.errors.phone && (
                <p className="mt-1 text-sm text-red-600">
                  {signUpForm.formState.errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                {...signUpForm.register("password")}
                className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Create a password"
              />
              {signUpForm.formState.errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {signUpForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={format(signUpForm.getValues("dob"), "PPP")}
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer"
                />
                <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                {showCalendar && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                    <div className="p-2">
                      <input
                        type="date"
                        onChange={(e) => {
                          signUpForm.setValue("dob", new Date(e.target.value));
                          setShowCalendar(false);
                        }}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                  </div>
                )}
              </div>
              {signUpForm.formState.errors.dob && (
                <p className="mt-1 text-sm text-red-600">
                  {signUpForm.formState.errors.dob.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <input
                type="text"
                {...signUpForm.register("department")}
                className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Enter your department"
              />
              {signUpForm.formState.errors.department && (
                <p className="mt-1 text-sm text-red-600">
                  {signUpForm.formState.errors.department.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Designation
              </label>
              <div className="relative">
                <select
                  {...signUpForm.register("designation")}
                  className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none"
                >
                  <option value="developer">Developer</option>
                  <option value="manager">Manager</option>
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
              {signUpForm.formState.errors.designation && (
                <p className="mt-1 text-sm text-red-600">
                  {signUpForm.formState.errors.designation.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
            >
              Sign Up
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="text-blue-600 hover:text-blue-700 font-medium focus:outline-none"
          >
            {mode === "signin"
              ? "Don't have an account? Sign Up"
              : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}
