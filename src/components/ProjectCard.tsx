"use client";
import React from "react";
import { z } from "zod";
import { Users, Calendar } from "lucide-react";
import { projectSchema } from "../schemas/projectSchema";

type Project = z.infer<typeof projectSchema>;

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onClick,
}) => {
  return (
    <div
      onClick={() => onClick(project)}
      className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
    >
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        {project.projectName}
      </h3>
      <p className="text-gray-600 mb-4">{project.description}</p>

      <div className="flex items-center justify-between text-gray-500">
        <div className="flex items-center gap-2">
          <Users size={20} />
          <span>{project.teamMembers.length} members</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={20} />
          <span>{new Date(project.deadline).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};
