import { HomeIcon, Key, LayoutDashboard, LucideIcon, User } from "lucide-react";
import { ReactNode } from "react";

interface Suggestion {
  label: string;
  prompt: string;
  icon: LucideIcon;
}

export const suggestions: Suggestion[] = [
  {
    label: "Dashboard",
    prompt:
      "Create an analytics dashboard to track customers and revenue data for a Saas",
    icon: LayoutDashboard,
  },
  {
    label: "SignUp Form",
    prompt:
      "Create a modern sign up form with email/password fields, Google and Github login options, and terms checkbox",
    icon: Key,
  },
  {
    label: "Hero",
    prompt:
      "Create a modern header and centered hero section for a productivity Saas. Include a badge for feature announcement, a title with a subtle gradient effect",
    icon: HomeIcon,
  },
  {
    label: "User Profile Card",
    prompt:
      "Create a modern user profile card component for a social media website",
    icon: User,
  },
];
