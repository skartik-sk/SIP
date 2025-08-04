export interface Campaign {
  id: string;
  title: string;
  description: string;
  image: string;
  label: string;
  amount: number;
  endTime: Date;
  owner: string;
  participantCount: number;
  daysLeft: number;
}

export interface Participant {
  id: string;
  user: string;
  points: number;
  campaignId: string;
}

export interface CreateCampaignParams {
  id: number;
  title: string;
  description: string;
  image: string;
  lable: string; // Matching blinks-mini spelling
  endtime: number;
  reward: number;
  owner: any;
}

export interface ParticipantArgs {
  id: number;
  user: any;
  points: number;
}
