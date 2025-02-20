"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Developer from "@/components/Developer";
import Manager from "@/components/Manager";

export default function Home() {
  const router = useRouter();
  const designation = sessionStorage.getItem("designation");

  useEffect(() => {
    if (
      !designation ||
      (designation !== "manager" && designation !== "developer")
    ) {
      router.push("/auth");
    }
  }, [designation, router]);

  if (
    !designation ||
    (designation !== "manager" && designation !== "developer")
  ) {
    return null; // Return null to prevent flash of "invalid user" while redirecting
  }

  return <div>{designation === "manager" ? <Manager /> : <Developer />}</div>;
}
