// SidebarItems.tsx
import {
  Aireach,
  Analytics,
  HotLeadsNormal,
  Tasks,
  UserIcon,
  LeadsIcon,
  AnalyticsActive,
  TaskActive,
  AIActive,
  UserActive,
} from "@/src/assests/icons";
export const sidebarButtons = [
  { label: "Admin User", id: "admin" },
  { label: "Solo User", id: "solo" },
];

// export const sidebarItems = [
//   { label: "Dashboard", icon: HotLeadsNormal },
//   // { label: "AI Outreach", icon: Aireach },
//   // { label: "Tasks & Reminder", icon: Tasks },
//   { label: "AI Outreach", icon: Aireach },
//   { label: "Tasks & Reminder", icon: Tasks, disabled: true },
//   { label: "Analytics", icon: Analytics, disabled: true },
//   { label: "Admin Oversight", icon: UserIcon },
// ];
export const sidebarItems = [
  { label: "My Inbox", icon: HotLeadsNormal, activeIcon: LeadsIcon }, // use same if no separate active version
  { label: "AI Outreach", icon: Aireach, activeIcon: AIActive },
  {
    label: "Pharmacy",
    icon: Tasks,
    activeIcon: TaskActive,
    // disabled: true,
  },
  {
    label: "Analytics",
    icon: Analytics,
    activeIcon: AnalyticsActive,
    disabled: true,
  },
  { label: "Admin Oversight", icon: UserIcon, activeIcon: UserActive },
];
export const sidebarItemsMobile = [
  { label: "My Inbox", icon: HotLeadsNormal, activeIcon: LeadsIcon },
  { label: "AI Outreach", icon: Aireach, activeIcon: AIActive },
  { label: "Tasks", icon: Tasks },
  { label: "Analytics", icon: Analytics },
  { label: "Admin", icon: UserIcon, activeIcon: UserActive },
];
