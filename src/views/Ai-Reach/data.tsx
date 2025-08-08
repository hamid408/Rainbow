// data.ts

export interface ContactData {
  id: number;
  name: string;
  inquiry_type: string;
  outReachStatus1: string;
  outReachStatus2: string;
  message: string;
}

export const contactData: ContactData[] = [
  {
    id: 90,
    name: "Danial Patel",
    inquiry_type: "Cremational Services",
    outReachStatus1: "Last email sent 2 days ago, no reply",
    outReachStatus2: "Next SMS attempt in 1 day",
    message:
      "Hi Danial, would you be available for a call at 3:00 PM tomorrow?",
  },
  {
    id: 80,
    name: "Sarah Khan",
    inquiry_type: "Memorial Planning",
    outReachStatus1: "First email sent today",
    outReachStatus2: "Next call attempt in 3 days",
    message: "Hi Sarah, I wanted to follow up on your interest",
  },
];
