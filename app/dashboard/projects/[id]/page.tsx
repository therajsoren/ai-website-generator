"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import JSZip from "jszip";
import {
  ArrowLeft,
  Loader2,
  Wand2,
  Code2,
  Eye,
  Download,
  Copy,
  Check,
  Sparkles,
  AlertCircle,
  Smartphone,
  Tablet,
  Monitor,
  FileCode2,
  FolderOpen,
  FileText,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Project {
  id: number;
  projectId: string;
  name: string;
  createdAt: string;
}

interface Frame {
  id: number;
  frameId: string;
  designCode: string;
  createdAt: string;
}

interface CodeFiles {
  html: string;
  css: string;
  js: string;
}

type ViewMode = "desktop" | "tablet" | "mobile";
type FileType = "html" | "css" | "js";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [frames, setFrames] = useState<Frame[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [viewMode, setViewMode] = useState<ViewMode>("desktop");
  const [activeFile, setActiveFile] = useState<FileType>("html");
  const [copied, setCopied] = useState(false);
  const [codeFiles, setCodeFiles] = useState<CodeFiles>({
    html: "",
    css: "",
    js: "",
  });
  const [error, setError] = useState("");

  const viewWidths = {
    desktop: "100%",
    tablet: "768px",
    mobile: "375px",
  };

  const files = [
    {
      type: "html" as FileType,
      name: "index.html",
      icon: FileCode2,
      color: "text-orange-500",
    },
    {
      type: "css" as FileType,
      name: "styles.css",
      icon: FileText,
      color: "text-blue-500",
    },
    {
      type: "js" as FileType,
      name: "script.js",
      icon: FileCode2,
      color: "text-yellow-500",
    },
  ];

  const parseCodeFiles = (designCode: string): CodeFiles => {
    try {
      const parsed = JSON.parse(designCode);
      return {
        html: parsed.html || "",
        css: parsed.css || "",
        js: parsed.js || "",
      };
    } catch {
      // Legacy single-file format
      return { html: designCode, css: "", js: "" };
    }
  };

  const generatePreviewHtml = (): string => {
    if (!codeFiles.html) return "";

    let html = codeFiles.html;

    if (codeFiles.css) {
      html = html.replace(
        /<link[^>]*href=["']styles\.css["'][^>]*>/gi,
        `<style>${codeFiles.css}</style>`
      );
    }

    if (codeFiles.js) {
      html = html.replace(
        /<script[^>]*src=["']script\.js["'][^>]*><\/script>/gi,
        `<script>${codeFiles.js}</script>`
      );
    }

    return html;
  };

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch(`/api/projects/${projectId}`);
        if (res.ok) {
          const data = await res.json();
          setProject(data.project);
          setFrames(data.frames || []);
          if (data.frames?.[0]?.designCode) {
            setCodeFiles(parseCodeFiles(data.frames[0].designCode));
          }
        } else {
          router.push("/dashboard/projects");
        }
      } catch (err) {
        console.error("Failed to fetch project:", err);
        router.push("/dashboard/projects");
      } finally {
        setLoading(false);
      }
    }

    if (projectId) {
      fetchProject();
    }
  }, [projectId, router]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a description for your website");
      return;
    }

    setError("");
    setGenerating(true);

    try {
      const res = await fetch(`/api/projects/${projectId}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.files) {
          setCodeFiles(data.files);
        } else if (data.code) {
          setCodeFiles(parseCodeFiles(data.code));
        }
        if (data.frame) {
          setFrames([data.frame, ...frames]);
        }
        setPrompt("");
      } else {
        setError(data.error || "Failed to generate website");
      }
    } catch (err) {
      console.error("Generation failed:", err);
      setError("Generation failed. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = async () => {
    const content = codeFiles[activeFile];
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    const zip = new JSZip();

    zip.file("index.html", codeFiles.html);
    zip.file("styles.css", codeFiles.css);
    zip.file("script.js", codeFiles.js);

    zip.file(
      "README.md",
      `# ${project?.name || "Website"}

Generated by Venn AI Website Builder

## Files
- \`index.html\` - Main HTML file
- \`styles.css\` - Stylesheet
- \`script.js\` - JavaScript

## How to Run
1. Open \`index.html\` in your browser
2. Or use a local server: \`npx serve .\`

Generated on: ${new Date().toLocaleDateString()}
`
    );

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${
      project?.name?.replace(/\s+/g, "-").toLowerCase() || "website"
    }.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadFrame = (frame: Frame) => {
    setCodeFiles(parseCodeFiles(frame.designCode));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
      </div>
    );
  }

  const hasCode = codeFiles.html || codeFiles.css || codeFiles.js;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard/projects")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {project?.name}
            </h1>
            <p className="text-sm text-slate-500">
              Created {new Date(project?.createdAt || "").toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleCopy} disabled={!hasCode}>
            {copied ? (
              <Check className="w-4 h-4 mr-2" />
            ) : (
              <Copy className="w-4 h-4 mr-2" />
            )}
            {copied ? "Copied!" : "Copy"}
          </Button>
          <Button
            variant="outline"
            onClick={handleDownload}
            disabled={!hasCode}
          >
            <Download className="w-4 h-4 mr-2" />
            Download ZIP
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Wand2 className="w-5 h-5 text-violet-500" />
              <h2 className="font-semibold text-slate-900">AI Generator</h2>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              Describe the website you want to create
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A modern portfolio website with a hero section, about page, projects gallery, and contact form..."
              className="w-full h-32 p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <Button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full mt-4 bg-violet-600 hover:bg-violet-700"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Website
                </>
              )}
            </Button>
          </div>

          {frames.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">History</h3>
              <div className="space-y-2">
                {frames.slice(0, 5).map((frame) => (
                  <button
                    key={frame.frameId}
                    onClick={() => loadFrame(frame)}
                    className="w-full text-left p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <p className="text-sm text-slate-500">
                      {new Date(frame.createdAt).toLocaleString()}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200">
              <div className="flex">
                <button
                  onClick={() => setActiveTab("preview")}
                  className={`px-6 py-3 text-sm font-medium flex items-center gap-2 ${
                    activeTab === "preview"
                      ? "bg-violet-50 text-violet-600 border-b-2 border-violet-600"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
                <button
                  onClick={() => setActiveTab("code")}
                  className={`px-6 py-3 text-sm font-medium flex items-center gap-2 ${
                    activeTab === "code"
                      ? "bg-violet-50 text-violet-600 border-b-2 border-violet-600"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Code2 className="w-4 h-4" />
                  Code
                </button>
              </div>

              {activeTab === "preview" && hasCode && (
                <div className="flex items-center gap-1 pr-4">
                  <button
                    onClick={() => setViewMode("mobile")}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "mobile"
                        ? "bg-violet-100 text-violet-600"
                        : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                    }`}
                    title="Mobile View (375px)"
                  >
                    <Smartphone className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("tablet")}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "tablet"
                        ? "bg-violet-100 text-violet-600"
                        : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                    }`}
                    title="Tablet View (768px)"
                  >
                    <Tablet className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("desktop")}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "desktop"
                        ? "bg-violet-100 text-violet-600"
                        : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                    }`}
                    title="Desktop View (100%)"
                  >
                    <Monitor className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="h-[500px]">
              {!hasCode ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-white">
                  <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center mb-4">
                    <Wand2 className="w-8 h-8 text-violet-500" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-800 mb-2">
                    No generation yet
                  </h3>
                  <p className="text-slate-500 max-w-sm">
                    Describe your website in the prompt box and click Generate
                    to create your AI-powered website
                  </p>
                </div>
              ) : activeTab === "preview" ? (
                <div className="h-full flex items-start justify-center p-4 overflow-auto bg-slate-100">
                  <div
                    className="bg-white shadow-2xl rounded-lg overflow-hidden transition-all duration-300"
                    style={{
                      width: viewWidths[viewMode],
                      maxWidth: "100%",
                      height: viewMode === "desktop" ? "100%" : "auto",
                      minHeight: viewMode === "desktop" ? "100%" : "468px",
                    }}
                  >
                    <iframe
                      srcDoc={generatePreviewHtml()}
                      className="w-full h-full border-0"
                      style={{ minHeight: "468px" }}
                      title="Website Preview"
                      sandbox="allow-scripts"
                    />
                  </div>
                </div>
              ) : (
                <div className="h-full flex">
                  <div className="w-56 border-r border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium text-slate-700 mb-2">
                      <FolderOpen className="w-4 h-4 text-violet-500" />
                      <span>project</span>
                    </div>
                    <div className="ml-4 space-y-1">
                      {files.map((file) => (
                        <button
                          key={file.type}
                          onClick={() => setActiveFile(file.type)}
                          className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors ${
                            activeFile === file.type
                              ? "bg-violet-100 text-violet-700"
                              : "text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          <file.icon className={`w-4 h-4 ${file.color}`} />
                          <span>{file.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 overflow-auto">
                    <div className="sticky top-0 bg-slate-800 px-4 py-2 flex items-center gap-2 text-sm text-slate-400 border-b border-slate-700">
                      <ChevronRight className="w-3 h-3" />
                      <span className="text-slate-300">
                        {files.find((f) => f.type === activeFile)?.name}
                      </span>
                    </div>
                    <pre className="p-4 bg-slate-900 text-slate-100 text-sm min-h-full">
                      <code>{codeFiles[activeFile] || "// Empty file"}</code>
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
