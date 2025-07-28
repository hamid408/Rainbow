// SidebarItems.tsx
import {
  Aireach,
  Analytics,
  LeadsIcon,
  Tasks,
  UserIcon,
} from "@/src/assests/icons";
export const sidebarButtons = [
  { label: "Admin User", id: "admin" },
  { label: "Solo User", id: "solo" },
];

export const sidebarItems = [
  { label: "Dashboard", icon: LeadsIcon },
  // { label: "AI Outreach", icon: Aireach },
  // { label: "Tasks & Reminder", icon: Tasks },
  { label: "AI Outreach", icon: Aireach, disabled: true },
  { label: "Tasks & Reminder", icon: Tasks, disabled: true },
  { label: "Analytics", icon: Analytics, disabled: true },
  { label: "Admin Oversight", icon: UserIcon },
];
export const sidebarItemsMobile = [
  { label: "Dashboard", icon: LeadsIcon },
  { label: "AI Outreach", icon: Aireach },
  { label: "Tasks", icon: Tasks },
  { label: "Analytics", icon: Analytics },
  { label: "Admin", icon: UserIcon },
];
