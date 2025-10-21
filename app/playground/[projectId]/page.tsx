"use client";
import { useParams } from "next/navigation";
import ChatSection from "../_components/ChatSection";
import ElementSettingSection from "../_components/ElementSettingSection";
import PlaygroundHeader from "../_components/PlaygroundHeader";
import WebsiteDesign from "../_components/WebsiteDesign";

const PlayGround = () => {
  const { projectId } = useParams();
  const params = new URLSearchParams();
  const frameId = params.get("frameId");


  
  return (
    <div>
      <PlaygroundHeader />
      <div className="flex">
        <ChatSection />
        <WebsiteDesign />
        <ElementSettingSection />
      </div>
    </div>
  );
};
export default PlayGround;
