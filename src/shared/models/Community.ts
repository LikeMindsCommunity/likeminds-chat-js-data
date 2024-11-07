export interface Community {
  id: number;
  name: string;
  purpose: string;
  imageUrl: string;
  membersCount: number;
  type: number;
  subType: number;
  isPaid: boolean;
  autoApproval: boolean;
  gracePeriod: number;
  isDiscoverable: boolean;
  referralEnabled: boolean;
  updatedAt: number;
  feeMembership: number;
  feeEvent: number;
  feePaymentPages: number;
  branding: {
    basic: {
      primaryColour: string;
    };
    advanced: {
      headerColour: string;
      buttonsIconsColour: string;
      textLinksColour: string;
    };
  };
  isWhitelabel: boolean;
  whitelabelInfo: unknown;
  hideDmTab: boolean;
  isFreemiumCommunity: boolean;
  communitySettingRights: {
    id: number;
    title: string;
    state: number;
    isSelected: boolean;
    isLocked: boolean;
  }[];
}
