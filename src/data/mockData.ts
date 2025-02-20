import { z } from "zod";
import { projectSchema } from "../schemas/projectSchema";

type Project = z.infer<typeof projectSchema>;

export const mockProjects: Project[] = [
  {
    projectName: "E-commerce Platform Redesign",
    description:
      "Redesigning the company's e-commerce platform with modern UI/UX",
    deadline: new Date("2024-03-20"),
    teamMembers: ["John Doe", "Jane Smith"],
  },
  {
    projectName: "Mobile App Development",
    description: "Developing a new mobile app for customer engagement",
    deadline: new Date("2024-03-30"),
    teamMembers: ["Mike Johnson"],
  },
];

export const mockEmployees = [
  {
    id: "1",
    name: "John Doe",
    role: "Senior Frontend Developer",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    id: "2",
    name: "Jane Smith",
    role: "Backend Developer",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    id: "3",
    name: "Mike Johnson",
    role: "UI/UX Designer",
    avatar:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    id: "4",
    name: "Sarah Wilson",
    role: "Full Stack Developer",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    id: "5",
    name: "David Brown",
    role: "DevOps Engineer",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
];
