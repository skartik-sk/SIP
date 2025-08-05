export interface Campaign {
  id: string
  title: string
  description: string
  image: string
  lable: string // Corrected spelling from 'lable' to 'label'
  reward: number
  endtime: number

  owner: string
}

export interface Participant {
  id: string;
  user: string;
  points: number;
}

export interface CreateCampaignParams {
  title: string;
  description: string;
  image: string;
  lable: string; // Matching blinks-mini spelling
  endtime: number;
  reward: number;
}

export interface ParticipantArgs {
  id: number;
  user: any;
  points: number;
}
