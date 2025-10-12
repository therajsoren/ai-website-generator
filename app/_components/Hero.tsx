"use client";
import { Button } from "@/components/ui/button";
import { suggestions } from "@/types/suggestion";
import { SignInButton } from "@clerk/nextjs";
import { ArrowUp, ImagePlus } from "lucide-react";
import { useState } from "react";

const Hero = () => {
  const [userInput, setUserInput] = useState("");

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
          <SignInButton mode="modal" forceRedirectUrl={"/workspace"}>
            <Button disabled={!userInput}>
              <ArrowUp />
            </Button>
          </SignInButton>
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
