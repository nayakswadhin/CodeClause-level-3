import React, { useState, useEffect } from "react";
import {
  Briefcase,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  ListTodo,
} from "lucide-react";
import axios from "axios";

interface Task {
  _id: string;
  taskName: string;
  taskDescription: string;
  deadline: string;
  project: {
    _id: string;
    projectName: string;
  };
  assignedTo: string;
  isComplete: boolean;
}

function Developer() {
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const developerId = sessionStorage.getItem("userId");

  const fetchTasks = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/getTasksByDeveloper",
        {
          developerId: developerId,
        }
      );
      setTasks(response.data.tasks || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]);
    }
  };

  // Group tasks by project
  const groupedTasks =
    tasks && tasks.length > 0
      ? tasks.reduce<Record<string, { projectName: string; tasks: Task[] }>>(
          (acc, task) => {
            const projectId = task.project._id;
            if (!acc[projectId]) {
              acc[projectId] = {
                projectName: task.project.projectName,
                tasks: [],
              };
            }
            acc[projectId].tasks.push(task);
            return acc;
          },
          {}
        )
      : {};

  const toggleProject = (projectId: string) => {
    setExpandedProject(expandedProject === projectId ? null : projectId);
  };

  const toggleTaskCompletion = async (
    taskId: string,
    currentStatus: boolean
  ) => {
    setLoading(true);
    try {
      await axios.post(`http://localhost:3000/api/updateTask`, {
        taskId,
        isComplete: !currentStatus,
      });
      setTasks(
        tasks.map((task) =>
          task._id === taskId ? { ...task, isComplete: !task.isComplete } : task
        )
      );
    } catch (error) {
      console.error("Error updating task status:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!tasks || tasks.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <Briefcase className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-semibold text-gray-800">My Tasks</h1>
            </div>
            <p className="text-gray-500 text-center py-8">No tasks found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <Briefcase className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-semibold text-gray-800">My Tasks</h1>
          </div>

          <div className="space-y-4">
            {Object.entries(groupedTasks).map(([projectId, project]) => (
              <div
                key={projectId}
                className="border rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleProject(projectId)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <ListTodo className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-700">
                      {project.projectName}
                    </span>
                    <span className="bg-blue-100 text-blue-700 text-sm px-2 py-1 rounded-full">
                      {project.tasks.length} tasks
                    </span>
                  </div>
                  {expandedProject === projectId ? (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  )}
                </button>

                {expandedProject === projectId && (
                  <div className="border-t bg-gray-50">
                    <div className="p-4 space-y-3">
                      {project.tasks.map((task) => (
                        <div
                          key={task._id}
                          className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm"
                        >
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() =>
                                toggleTaskCompletion(task._id, task.isComplete)
                              }
                              className={`focus:outline-none transition-opacity ${
                                loading
                                  ? "opacity-50 cursor-not-allowed"
                                  : "hover:opacity-80"
                              }`}
                              disabled={loading}
                            >
                              {task.isComplete ? (
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                              ) : (
                                <Clock className="w-5 h-5 text-orange-500" />
                              )}
                            </button>
                            <div className="flex flex-col">
                              <span
                                className={`${
                                  task.isComplete
                                    ? "line-through text-gray-500"
                                    : "text-gray-700"
                                }`}
                              >
                                {task.taskName}
                              </span>
                              <span className="text-sm text-gray-500">
                                {task.taskDescription}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500">
                              Due:{" "}
                              {new Date(task.deadline).toLocaleDateString()}
                            </span>
                            {task.isComplete ? (
                              <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                Completed
                              </span>
                            ) : (
                              <span className="text-sm text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                                In Progress
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Developer;
