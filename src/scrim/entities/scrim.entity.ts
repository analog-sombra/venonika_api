export interface ScrimSchema {
  id: string;
  name: string;
  guildId: string;
  registrationChannel: string;
  allowedRole?: string;
  registeredRole?: string;
  slot: number;
  teamMember: number;
  registrationStartDateTime: string;
  registrationEndDateTime: string;
  createdAt: Date;
  updatedAt: Date;
}
