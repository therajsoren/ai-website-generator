import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const MenuOptions = [
  {
    name: "Pricing",
    path: "/pricing",
  },
  {
    name: "Contact",
    path: "/contact",
  },
];

const Header = () => {
  return (
    <div className="flex items-center mt-[0.5rem] justify-between px-5 py-4 shadow-xl rounded-4xl">
      <div className="flex gap-2 items-center">
        <Image src={"/logo.svg"} alt="logo" width={35} height={35} />
        <h1 className="font-bold text-xl leading-normal">
          AI Website Generator
        </h1>
      </div>
      <div className="flex gap-4">
        {MenuOptions.map((menu, index) => (
          <Button
            className="text-lg cursor-pointer"
            key={index}
            variant={"ghost"}
          >
            {menu.name}
          </Button>
        ))}
      </div>

      <div>
        <SignInButton mode="modal" forceRedirectUrl={"/workspace"}>
          <Button className="cursor-pointer">
            Get Started <ArrowRight />
          </Button>
        </SignInButton>
      </div>
    </div>
  );
};
export default Header;
