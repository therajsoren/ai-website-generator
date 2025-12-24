"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import {
  FolderOpen,
  Plus,
  Search,
  Trash2,
  TrendingUp,
  Zap,
  Clock,
  Sparkles,
  Loader2,
  AlertTriangle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Project {
  id: number;
  projectId: string;
  name: string;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    projectId: string;
    projectName: string;
  }>({ open: false, projectId: "", projectName: "" });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/projects");
        if (res.ok) {
          const data = await res.json();
          setProjects(data.projects || []);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      fetchProjects();
    }
  }, [authLoading]);

  const handleCreate = async () => {
    if (!prompt.trim()) return;
    setCreating(true);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: prompt.slice(0, 50) }),
      });

      if (res.ok) {
        const data = await res.json();
        setProjects([data.project, ...projects]);
        setPrompt("");
      }
    } catch (error) {
      console.error("Failed to create project:", error);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.projectId) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/projects?id=${deleteModal.projectId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setProjects(
          projects.filter((p) => p.projectId !== deleteModal.projectId)
        );
        setDeleteModal({ open: false, projectId: "", projectName: "" });
      }
    } catch (error) {
      console.error("Failed to delete project:", error);
    } finally {
      setDeleting(false);
    }
  };

  const openDeleteModal = (projectId: string, projectName: string) => {
    setDeleteModal({ open: true, projectId, projectName });
  };

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    {
      label: "Total Projects",
      value: projects.length,
      trend: "+2 this week",
      icon: FolderOpen,
      color: "from-violet-500 to-indigo-500",
    },
    {
      label: "Messages Today",
      value: "25",
      trend: "Daily Limit",
      icon: Zap,
      color: "from-orange-400 to-amber-500",
    },
    {
      label: "Generated",
      value: projects.length * 3,
      trend: "Components",
      icon: Sparkles,
      color: "from-emerald-400 to-teal-500",
    },
    {
      label: "This Month",
      value: projects.filter((p) => {
        const date = new Date(p.createdAt);
        const now = new Date();
        return date.getMonth() === now.getMonth();
      }).length,
      trend: "Projects",
      icon: TrendingUp,
      color: "from-pink-400 to-rose-500",
    },
  ];

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Welcome back, {user?.name?.split(" ")[0] || "there"}!
          </h1>
          <p className="text-slate-600">Build something amazing today</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-5 border border-slate-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-xl bg-linear-to-br ${stat.color} flex items-center justify-center`}
                >
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-500">{stat.label}</p>
              <p className="text-xs text-slate-400 mt-1">{stat.trend}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-slate-200 p-6 mb-8"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-500" />
            AI Workspace
          </h2>
          <div className="flex gap-4">
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your website idea..."
              className="flex-1 h-12 bg-slate-50 border-slate-200"
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
            <Button
              onClick={handleCreate}
              disabled={creating || !prompt.trim()}
              className="h-12 px-6 bg-violet-600 hover:bg-violet-700"
            >
              {creating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-2" />
                  Create
                </>
              )}
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
        >
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Recent Projects</h2>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                className="pl-9 h-9 bg-slate-50 border-slate-200"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">
                {searchQuery ? "No matching projects" : "No projects yet"}
              </p>
              <p className="text-sm text-slate-400">
                Create your first project using the AI workspace above
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {filteredProjects.map((project) => (
                <div
                  key={project.projectId}
                  className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div
                    className="flex items-center gap-4 flex-1 cursor-pointer"
                    onClick={() =>
                      router.push(`/dashboard/projects/${project.projectId}`)
                    }
                  >
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
                      <FolderOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900">
                        {project.name}
                      </h3>
                      <p className="text-sm text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(project.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-slate-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() =>
                        openDeleteModal(project.projectId, project.name)
                      }
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {deleteModal.open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() =>
                !deleting &&
                setDeleteModal({ open: false, projectId: "", projectName: "" })
              }
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-6 mx-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      Delete Project
                    </h3>
                  </div>
                  <button
                    onClick={() =>
                      !deleting &&
                      setDeleteModal({
                        open: false,
                        projectId: "",
                        projectName: "",
                      })
                    }
                    className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
                <p className="text-slate-600 mb-2">
                  Are you sure you want to delete this project?
                </p>
                <p className="text-sm text-slate-500 mb-6 p-3 bg-slate-50 rounded-lg font-medium">
                  "{deleteModal.projectName}"
                </p>
                <p className="text-sm text-slate-500 mb-6">
                  This action cannot be undone. All generated content will be
                  permanently removed.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() =>
                      setDeleteModal({
                        open: false,
                        projectId: "",
                        projectName: "",
                      })
                    }
                    disabled={deleting}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-red-600 hover:bg-red-700"
                    onClick={handleDelete}
                    disabled={deleting}
                  >
                    {deleting ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Trash2 className="w-4 h-4 mr-2" />
                    )}
                    Delete
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
