export type CardType = 'conversation' | 'message';

export interface ConversationCardData {
  type: 'conversation';
  heading: string;
  avatarInitials: string;
  name: string;
  description: string;
  timeAgo: string;
  avatarUrl?: string;
}

export interface MessageCardData {
  type: 'message';
  heading: string;
  avatarInitials: string;
  name: string;
  message: string;
  avatarUrl?: string;
}

export type CardData = ConversationCardData | MessageCardData;

export const conversationData: ConversationCardData[] = [
  {
    type: 'conversation',
    heading: 'Live Conversation Monitor',
    avatarInitials: 'DP',
    name: 'Danielle Patel',
    description: 'AI awaiting reply',
    timeAgo: '30min ago',
  },
  {
    type: 'conversation',
    heading: 'Live Conversation Monitor',
    avatarInitials: 'JS',
    name: 'John Smith',
    description: 'AI needs input (unrecognized query)',
    timeAgo: '5min ago',
  },
  {
    type: 'conversation',
    heading: 'Live Conversation Monitor',
    avatarInitials: 'LN',
    name: 'Lando Norris',
    description: 'AI awaiting reply',
    timeAgo: '30min ago',
  },
  {
    type: 'conversation',
    heading: 'Live Conversation Monitor',
    avatarInitials: 'KG',
    name: 'Kaiya Gouse',
    description: 'AI needs input (unrecognized query)',
    timeAgo: '5min ago',
  },
  {
    type: 'conversation',
    heading: 'Live Conversation Monitor',
    avatarInitials: 'JG',
    name: 'Justin Gouse',
    description: 'AI awaiting reply',
    timeAgo: '30min ago',
  },
];

export const messageData: MessageCardData[] = [
  {
    type: 'message',
    heading: 'Quality Control Tools',
    avatarInitials: 'DP',
    name: 'Danielle Patel',
    message: 'Hi Danielle, would you be available...',
  },
  {
    type: 'message',
    heading: 'Quality Control Tools',
    avatarInitials: 'JS',
    name: 'John Smith',
    message: 'Hi John, Lemme share you the details...',
  },
  {
    type: 'message',
    heading: 'Quality Control Tools',
    avatarInitials: 'LN',
    name: 'Lando Norris',
    message: 'Hi Lando, would you be available...',
  },
  {
    type: 'message',
    heading: 'Quality Control Tools',
    avatarInitials: 'KG',
    name: 'Kaiya Gouse',
    message: 'Hi Kaiya, Lemme share you the details...',
  },
  {
    type: 'message',
    heading: 'Quality Control Tools',
    avatarInitials: 'JG',
    name: 'Justin Gouse',
    message: 'Hi Danielle, would you be available...',
  },
];

// 

const userData = [
  {
    name: "Kerina Wang",
    service: "Burial Services",
    time: "15m 12s",
    score: 4,
  },
  {
    name: "Sam Jones",
    service: "Cremation Services",
    time: "21m 33s",
    score: 6,
  },
  {
    name: "Dulce Calzoni",
    service: "Burial Services",
    time: "15m 12s",
    score: 4,
  },
  {
    name: "Omar Rosser",
    service: "Cremation Services",
    time: "21m 33s",
    score: 6,
  },
  {
    name: "Madelyn Philips",
    service: "Burial Services",
    time: "15m 12s",
    score: 4,
  },
];

export default userData;
