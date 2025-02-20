import React, { useEffect, useState } from "react";
import { z } from "zod";
import { X, Plus, Users, Calendar } from "lucide-react";
import { addTaskSchema, updateTaskSchema } from "../schemas/taskSchema";
import { projectSchema } from "../schemas/projectSchema";
import axios from "axios";
import { Task } from "@/models/task.model";

interface TeamMember {
  _id: string;
  name: string;
}

export interface Project {
  _id: string;
  projectName: string;
  description: string;
  manager: {
    _id: string;
    name: string;
  };
  deadline: string;
  teamMembers: { _id: string; name: string }[];
  tasks: Task[];
  __v: number;
}

interface ProjectDetailsProps {
  project: Project;
  onClose: () => void;
}

interface TaskType {
  _id: string;
  taskName: string;
  taskDescription: string;
  deadline: string;
  project: string;
  assignedTo: {
    _id: string;
    name: string;
  };
  isComplete: boolean;
  __v: number;
}

export const ProjectDetails: React.FC<ProjectDetailsProps> = ({
  project,
  onClose,
}) => {
  const [newTask, setNewTask] = useState({
    taskName: "",
    taskDescription: "",
    deadline: new Date(),
    project: "",
    assignedTo: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tasks, setTasks] = useState<TaskType[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.post(`http://localhost:3000/api/getTask`, {
          projectId: project._id.toString(),
        });
        setTasks(response.data.tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [project._id]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validatedData = addTaskSchema.parse(newTask);
      const response = await axios.post("http://localhost:3000/api/addTask", {
        taskName: validatedData.taskName,
        taskDescription: validatedData.taskDescription,
        deadline: validatedData.deadline,
        projectId: project._id.toString(),
        empId: validatedData.assignedTo,
      });

      // Refresh tasks after adding a new one
      const updatedTasksResponse = await axios.post(
        `http://localhost:3000/api/getTask`,
        {
          projectId: project._id.toString(),
        }
      );
      setTasks(updatedTasksResponse.data.tasks);

      document.getElementById("add-task-form")?.classList.add("hidden");
      setNewTask({
        taskName: "",
        taskDescription: "",
        deadline: new Date(),
        project: project.projectName,
        assignedTo: "",
      });
      setErrors({});
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {project.projectName}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar size={20} />
              <span>
                Deadline: {new Date(project.deadline).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Users size={20} />
              <span>{project.teamMembers.length} team members</span>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Team Members</h3>
            <div className="flex flex-wrap gap-4">
              {project.teamMembers.map((member) => (
                <div
                  key={member._id.toString()}
                  className="flex items-center gap-3 bg-gray-50 rounded-lg p-3"
                >
                  <div>
                    <p className="font-medium">{member.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Tasks ({tasks.length})</h3>
              <button
                onClick={() =>
                  document
                    .getElementById("add-task-form")
                    ?.classList.remove("hidden")
                }
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Plus size={20} />
                Add Task
              </button>
            </div>

            {/* Task List */}
            <div className="space-y-4 mb-6">
              {tasks.map((task) => (
                <div key={task._id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-lg">{task.taskName}</h4>
                      <p className="text-gray-600 mt-1">
                        {task.taskDescription}
                      </p>
                      <div className="mt-2 flex items-center gap-4">
                        <span className="text-sm text-gray-500">
                          Due: {new Date(task.deadline).toLocaleDateString()}
                        </span>
                        <span className="text-sm text-gray-500">
                          Assigned to: {task.assignedTo.name}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          task.isComplete
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {task.isComplete ? "Completed" : "In Progress"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <form
              id="add-task-form"
              onSubmit={handleAddTask}
              className="hidden mb-6 bg-gray-50 p-4 rounded-lg"
            >
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Task Name
                  </label>
                  <input
                    type="text"
                    value={newTask.taskName}
                    onChange={(e) =>
                      setNewTask({ ...newTask, taskName: e.target.value })
                    }
                    className={`w-full p-2 border rounded-lg ${
                      errors.taskName ? "border-red-500" : ""
                    }`}
                  />
                  {errors.taskName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.taskName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    value={newTask.taskDescription}
                    onChange={(e) =>
                      setNewTask({
                        ...newTask,
                        taskDescription: e.target.value,
                      })
                    }
                    className={`w-full p-2 border rounded-lg ${
                      errors.taskDescription ? "border-red-500" : ""
                    }`}
                    rows={3}
                  />
                  {errors.taskDescription && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.taskDescription}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={newTask.deadline.toISOString().split("T")[0]}
                    onChange={(e) =>
                      setNewTask({
                        ...newTask,
                        deadline: new Date(e.target.value),
                      })
                    }
                    className={`w-full p-2 border rounded-lg ${
                      errors.deadline ? "border-red-500" : ""
                    }`}
                  />
                  {errors.deadline && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.deadline}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Assign To
                  </label>
                  <select
                    value={newTask.assignedTo}
                    onChange={(e) =>
                      setNewTask({ ...newTask, assignedTo: e.target.value })
                    }
                    className={`w-full p-2 border rounded-lg ${
                      errors.assignedTo ? "border-red-500" : ""
                    }`}
                  >
                    <option value="">Select team member</option>
                    {project.teamMembers.map((member) => (
                      <option
                        key={member._id.toString()}
                        value={member._id.toString()}
                      >
                        {member.name}
                      </option>
                    ))}
                  </select>
                  {errors.assignedTo && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.assignedTo}
                    </p>
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      document
                        .getElementById("add-task-form")
                        ?.classList.add("hidden")
                    }
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add Task
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
