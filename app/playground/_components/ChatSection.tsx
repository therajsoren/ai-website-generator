"use client";
import { Button } from "@/components/ui/button";
import { Messages } from "../[projectId]/page";
import { ArrowUp } from "lucide-react";
import { useState } from "react";

type Props = {
  messages: Messages[];
  onSend: (input: string) => void | Promise<void>;
  loading: boolean;
};
const ChatSection = ({ messages, onSend, loading }: Props) => {
  console.log("ChatSection received messages:", messages);
  const [input, setInput] = useState<string>();

  const handleSend = () => {
    if (!input?.trim()) return;
    onSend(input);
    setInput("");
  };
  return (
    <div className="w-96 shadow h-[91vh] p-4 flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col">
        {messages?.length === 0 ? (
          <p className="text-gray-400 text-center">No Messages</p>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role == "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-2 rounded-lg maxw-[80%]
                ${
                  message.role === "user"
                    ? "bg-white text-black"
                    : "bg-gray-100 text-black"
                }
                `}
              >
                {message.content}
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className="flex justify-center items-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-zinc-800" />
            <span className="ml-2 text-zinc-800">
              Thinking... Working on your request
            </span>
          </div>
        )}
      </div>

      <div className="p-3 border-t flex items-center gap-2">
        <textarea
          value={input}
          placeholder="Describe your website design idea"
          className="flex-1 resize-none border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 overflow-y-hidden"
          onChange={(e) => {
            setInput(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          rows={1}
        />
        <Button onClick={handleSend} disabled={!input?.trim()}>
          <ArrowUp />
        </Button>
      </div>
    </div>
  );
};
export default ChatSection;
