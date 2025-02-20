"use client";
import React, { useState, useRef, useEffect } from "react";
import { z } from "zod";
import {
  Users,
  Plus,
  Calendar as CalendarIcon,
  UserPlus,
  Check,
  X,
  AlertCircle,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ProjectCard } from "./ProjectCard";
import { ProjectDetails } from "./ProjectDetails";
import { projectSchema } from "../schemas/projectSchema";
import { mockProjects } from "../data/mockData";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import axios from "axios";
import { Employee } from "@/models/employee.model";

type Project = z.infer<typeof projectSchema>;

function Manager() {
  const [developers, setDevelopers] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const calendarRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const [newProject, setNewProject] = useState({
    projectName: "",
    description: "",
    deadline: new Date(),
    teamMembers: [] as string[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "http://localhost:3000/api/getEmployees"
      );

      axios
        .post("http://localhost:3000/api/getProjects", {
          managerId: sessionStorage.getItem("userId"),
        })
        .then((res) => {
          setProjects(res.data.projects);
        })
        .catch((e) => {
          console.log(e);
        });

      // Ensure response.data is an array
      if (response.data && Array.isArray(response.data)) {
        setDevelopers(response.data);
      } else if (response.data && Array.isArray(response.data.data)) {
        // Some APIs wrap the data in a data property
        setDevelopers(response.data.data);
      } else {
        throw new Error("Invalid data format received from API");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch employees"
      );
      console.error("Error fetching developers:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Only fetch on mount

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        showNewProjectForm
      ) {
        setShowNewProjectForm(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNewProjectForm]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const newProjectData = {
        ...newProject,
        deadline: new Date(newProject.deadline || Date.now()),
        teamMembers: selectedEmployees,
      };
      console.log(newProjectData.deadline);
      // Validate the data
      const managerId = sessionStorage.getItem("userId");
      const validatedData = projectSchema.parse(newProjectData);
      console.log(validatedData);
      axios
        .post("http://localhost:3000/api/addProject", {
          projectName: validatedData.projectName,
          description: validatedData.description,
          managerId: managerId,
          deadline: validatedData.deadline,
          teamMembers: validatedData.teamMembers,
        })
        .then((res) => {
          console.log(res);
          fetchData();
          setProjects((prevProjects) => [...prevProjects, validatedData]);

          // Reset all form-related states
          setNewProject({
            projectName: "",
            description: "",
            deadline: new Date(),
            teamMembers: [],
          });
          setSelectedEmployees([]);
          setErrors({});
          setShowNewProjectForm(false);
        })
        .then((e) => {
          console.log(e);
        });
      // Use the validatedData instead of newProjectData
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            formattedErrors[err.path[0]] = err.message;
          }
        });
        setErrors(formattedErrors);
      }
    }
  };

  const toggleEmployeeSelection = (empId: string) => {
    setSelectedEmployees((prev) =>
      prev.includes(empId)
        ? prev.filter((id) => id !== empId)
        : [...prev, empId]
    );
  };

  const getDaysInMonth = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
          <p>Error loading Data: {error}</p>
        </div>
      </div>
    );
  }

  // Ensure developers is an array before rendering
  const developersArray = Array.isArray(developers) ? developers : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Project Manager</h1>
          <button
            onClick={() => setShowNewProjectForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus className="h-4 w-4" /> New Project
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.projectName}
              project={project}
              onClick={setSelectedProject}
            />
          ))}
        </div>

        {selectedProject && (
          <ProjectDetails
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}

        {/* Custom Modal */}
        {showNewProjectForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div
              ref={modalRef}
              className="bg-white rounded-xl shadow-xl w-full max-w-[600px] max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Create New Project
                  </h2>
                  <button
                    onClick={() => setShowNewProjectForm(false)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleCreateProject} className="p-6 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter project name"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-shadow ${
                        errors.projectName
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
                      }`}
                      value={newProject.projectName}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          projectName: e.target.value,
                        })
                      }
                    />
                    {errors.projectName && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.projectName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      placeholder="Enter project description"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-shadow resize-none"
                      value={newProject.description}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Deadline
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowCalendar(!showCalendar)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-shadow flex items-center justify-between bg-white"
                    >
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-gray-500" />
                        <span>{format(newProject.deadline, "PPP")}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    </button>

                    {showCalendar && (
                      <div
                        ref={calendarRef}
                        className="absolute top-full mt-2 bg-white rounded-lg shadow-xl border p-4 z-10 w-full"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <button
                            type="button"
                            onClick={() =>
                              setCurrentMonth(
                                new Date(
                                  currentMonth.setMonth(
                                    currentMonth.getMonth() - 1
                                  )
                                )
                              )
                            }
                            className="p-1 hover:bg-gray-100 rounded-full"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>
                          <h3 className="font-medium">
                            {format(currentMonth, "MMMM yyyy")}
                          </h3>
                          <button
                            type="button"
                            onClick={() =>
                              setCurrentMonth(
                                new Date(
                                  currentMonth.setMonth(
                                    currentMonth.getMonth() + 1
                                  )
                                )
                              )
                            }
                            className="p-1 hover:bg-gray-100 rounded-full"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(
                            (day) => (
                              <div
                                key={day}
                                className="text-center text-sm font-medium text-gray-500 py-1"
                              >
                                {day}
                              </div>
                            )
                          )}
                          {getDaysInMonth().map((date, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => {
                                setNewProject({
                                  ...newProject,
                                  deadline: date,
                                });
                                setShowCalendar(false);
                              }}
                              className={`p-2 text-sm rounded-full hover:bg-blue-50 ${
                                format(date, "yyyy-MM-dd") ===
                                format(newProject.deadline, "yyyy-MM-dd")
                                  ? "bg-blue-100 text-blue-600 font-medium"
                                  : ""
                              }`}
                            >
                              {format(date, "d")}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Team Members
                    </label>
                    <div className="mt-2 border border-gray-200 rounded-lg">
                      <div className="max-h-[200px] overflow-y-auto">
                        {developersArray.map((employee) => (
                          <div
                            key={employee._id.toString()}
                            onClick={() =>
                              toggleEmployeeSelection(employee._id.toString())
                            }
                            className={`flex items-center justify-between p-3 cursor-pointer transition-colors border-b last:border-b-0 ${
                              selectedEmployees.includes(employee.name)
                                ? "bg-blue-50"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                                <User className="h-4 w-4 text-gray-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {employee.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {employee.department}
                                </p>
                              </div>
                            </div>
                            {selectedEmployees.includes(employee.name) && (
                              <Check className="h-5 w-5 text-blue-500" />
                            )}
                          </div>
                        ))}
                      </div>
                      {selectedEmployees.length > 0 && (
                        <div className="p-3 border-t bg-gray-50">
                          <div className="flex flex-wrap gap-2">
                            {selectedEmployees.map((empId) => {
                              const employee = developersArray.find(
                                (e) => e._id.toString() === empId
                              );
                              return (
                                <span
                                  key={empId}
                                  className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                                >
                                  {employee?.name}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleEmployeeSelection(empId);
                                    }}
                                    className="hover:text-red-500"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowNewProjectForm(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Project
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Manager;
