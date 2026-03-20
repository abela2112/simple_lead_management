export type LeadStatus =
  | "New"
  | "Engaged"
  | "Proposal Sent"
  | "Closed-Won"
  | "Closed-Lost";

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  createdAt: string;
}
