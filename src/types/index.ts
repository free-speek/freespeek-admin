export interface User {
  id: string;
  name: string;
  email: string;
  location: string;
  status: "ACTIVE" | "SUSPENDED";
  profilePicture?: string;
  lastLoginSource?: string;
  lastLoginAt?: string;
  phoneNumber?: string;
  age?: number;
  dateOfBirth?: string;
  interests?: string[];
  languages?: string[];
  hosting?: boolean;
  meetLocalHosts?: boolean;
  distanceUnit?: "KM" | "MI";
  referralCode?: string;
  maxDistance?: number;
  homeLocation?: string;
  firstName?: string;
  lastName?: string;
  gender?: "Male" | "Female" | "Other";
  isEmailVerified?: boolean;
  isPhoneNumberVerified?: boolean;
  trialExpiresIn?: string;
  subscription?: "TRIAL" | "PREMIUM" | "FREEMIUM";
  isTutorialDone?: boolean;
  isLoginWithEmailLocked?: boolean;
  isSubscriptionModalOff?: boolean;
  isPhoneNumberVerificationRequired?: boolean;
  referrerUserId?: string;
  invalidLoginAttempts?: number;
  dynamicReferralLink?: string;
  notificationPreferences?: {
    newMessageNotification: boolean;
    likeNotification: boolean;
    priorityLikeNotification: boolean;
    newMatchNotification: boolean;
  };
  pendingAlerts?: {
    tripsDisabled: boolean;
    trialExpired: boolean;
    subscriptionExpired: boolean;
  };
}

export interface DashboardStats {
  liveUsers: number;
  totalUsers: {
    real: number;
  };
  activeUsers: {
    real: number;
  };
  suspendedUsers: {
    real: number;
  };
  deletedUsers: {
    real: number;
  };
  paidPremiumUsers: {
    real: number;
  };
  freemiumUsers: {
    real: number;
  };
  trialPremiumUsers: {
    real: number;
  };
  posts: {
    total: number;
    active: number;
    archived: number;
  };
}

export interface SupportChat {
  id: string;
  name: string;
  message: string;
  lastMessageAt: string;
  status: "Seen (Active)" | "Unread";
  profilePicture?: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "support";
  message: string;
  timestamp: string;
  senderName: string;
  profilePicture?: string;
}

export interface Friend {
  id: string;
  name: string;
  profilePicture?: string;
  connectedAt: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  active?: boolean;
}

export interface Breadcrumb {
  label: string;
  path?: string;
}
