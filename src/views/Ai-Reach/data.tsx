// data.ts

export interface ContactData {
  id: number;
  title: string;
  subtitle: string;
  outReachStatus1: string;
  outReachStatus2: string;
  message: string;
}

export const contactData: ContactData[] = [
  {
    id: 90,
    title: "Danial Patel",
    subtitle: "Cremational Services",
    outReachStatus1: "Last email sent 2 days ago, no reply",
    outReachStatus2: "Next SMS attempt in 1 day",
    message: "Hi Danial, would you be available for a call at 3:00 PM tomorrow?"
  },
  {
    id: 80,
    title: "Sarah Khan",
    subtitle: "Memorial Planning",
    outReachStatus1: "First email sent today",
    outReachStatus2: "Next call attempt in 3 days",
    message: "Hi Sarah, I wanted to follow up on your interest"
  },
  {
    id: 55,
    title: "Michael Smith",
    subtitle: "Funeral Home Coordination",
    outReachStatus1: "Last call made 5 days ago, no response",
    outReachStatus2: "Next email attempt tomorrow",
    message: "Hi Michael, just checking in again."
  },
  {
    id: 88,
    title: "Aisha Ali",
    subtitle: "Service Arrangements",
    outReachStatus1: "No outreach yet",
    outReachStatus2: "First SMS attempt scheduled for next week",
    message: "Hi Aisha, Can we connect this week?"
  },
  {
    id: 91,
    title: "John Doe",
    subtitle: "Burial Assistance",
    outReachStatus1: "SMS sent 1 day ago",
    outReachStatus2: "Follow-up email in 2 days",
    message: "Hi John, let me know if you’re free for a quick call."
  },
];
