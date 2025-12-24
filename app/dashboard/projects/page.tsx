"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import {
  FolderOpen,
  Plus,
  Search,
  Trash2,
  ExternalLink,
  Clock,
  Loader2,
  Grid,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Project {
  id: number;
  projectId: string;
  name: string;
  createdAt: string;
}

export default function ProjectsPage() {
  const router = useRouter();
  const { loading: authLoading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [creating, setCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

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
    if (!newProjectName.trim()) return;
    setCreating(true);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newProjectName }),
      });

      if (res.ok) {
        const data = await res.json();
        setProjects([data.project, ...projects]);
        setNewProjectName("");
        setShowCreateModal(false);
      }
    } catch (error) {
      console.error("Failed to create project:", error);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm("Delete this project?")) return;

    try {
      const res = await fetch(`/api/projects?id=${projectId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setProjects(projects.filter((p) => p.projectId !== projectId));
      }
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Projects
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage all your AI-generated websites
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-violet-600 hover:bg-violet-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Project
        </Button>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="pl-9 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="icon"
            onClick={() => setViewMode("grid")}
            className="h-9 w-9"
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="icon"
            onClick={() => setViewMode("list")}
            className="h-9 w-9"
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-16">
          <FolderOpen className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">
            {searchQuery ? "No matching projects" : "No projects yet"}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            Create your first AI-powered website
          </p>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-violet-600 hover:bg-violet-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Project
          </Button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.projectId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
                  <FolderOpen className="w-6 h-6 text-white" />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-400 hover:text-red-500"
                  onClick={() => handleDelete(project.projectId)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1 truncate">
                {project.name}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-4">
                <Clock className="w-3 h-3" />
                {new Date(project.createdAt).toLocaleDateString()}
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  router.push(`/dashboard/projects/${project.projectId}`)
                }
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Project
              </Button>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700">
          {filteredProjects.map((project) => (
            <div
              key={project.projectId}
              className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-900 dark:text-white">
                    {project.name}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    router.push(`/dashboard/projects/${project.projectId}`)
                  }
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500"
                  onClick={() => handleDelete(project.projectId)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md"
          >
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Create Project
            </h2>
            <Input
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Project name..."
              className="mb-4"
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
            <div className="flex gap-3">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-violet-600 hover:bg-violet-700"
                onClick={handleCreate}
                disabled={creating || !newProjectName.trim()}
              >
                {creating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Create"
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
