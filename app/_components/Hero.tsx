"use client";
import { Button } from "@/components/ui/button";
import { suggestions } from "@/types/suggestion";
import { SignInButton, useUser } from "@clerk/nextjs";
import axios from "axios";
import { ArrowUp, ImagePlus, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

const generateRandomFrameNumbers = () => {
  const num = Math.floor(Math.random() * 10000);
  return num;
};

const Hero = () => {
  const router = useRouter();
  const [userInput, setUserInput] = useState<string>("");
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const CreateNewProject = async () => {
    const projectId = uuidv4();
    const frameId = generateRandomFrameNumbers();
    setLoading(true);
    const messages = [
      {
        role: "user",
        content: userInput,
      },
    ];

    try {
      const result = await axios.post("/api/projects", {
        projectId: projectId,
        frameId: frameId,
        messages: messages,
      });
      toast.success("Project Created");
      router.push(`/playground/${projectId}?frameId=${frameId}`);
      setLoading(false);
    } catch (error) {
      toast.error("Internal Server Error");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-2 justify-center items-center h-[50vh] mt-[2rem]">
      <h1 className="font-black md:text-7xl text-5xl">
        What should we design ?
      </h1>
      <p className="font-semibold md:text-xl text-lg">
        Generate, edit and explore designs with AI Export to code.
      </p>

      <div className="w-full max-w-3xl mx-auto border rounded-2xl p-5 mt-3">
        <textarea
          placeholder="Describe your page design"
          className="focus:outline-none focus:ring-0 resize-none
        w-full h-24
        "
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <div className="flex justify-between items-center">
          <Button variant={"ghost"}>
            <ImagePlus />
          </Button>
          {!user ? (
            <SignInButton mode="modal" forceRedirectUrl={"/workspace"}>
              <Button disabled={!userInput}>
                <ArrowUp />
              </Button>
            </SignInButton>
          ) : (
            <Button disabled={!userInput || loading} onClick={CreateNewProject}>
              {loading ? <Loader2Icon className="animate-spin" /> : <ArrowUp />}
            </Button>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        {suggestions.map((item, index) => (
          <Button
            key={index}
            variant={"outline"}
            onClick={() => setUserInput(item.prompt)}
            className="cursor-pointer"
          >
            <item.icon />
            {item.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
export default Hero;
