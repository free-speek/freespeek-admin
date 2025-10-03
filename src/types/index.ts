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

export interface BulkEmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface BulkEmailHistory {
  id: string;
  subject: string;
  recipientCount: number;
  sentAt: string;
  status: "sent" | "failed" | "partial";
  successCount: number;
  failureCount: number;
  createdBy: string;
}

export interface BulkEmailStats {
  totalEmailsSent: number;
  totalRecipients: number;
  totalTemplates: number;
  emailsSentToday: number;
  emailsSentThisWeek: number;
  emailsSentThisMonth: number;
  averageOpenRate: number;
  averageClickRate: number;
  // Change indicators
  emailsSentChange?: string;
  recipientsChange?: string;
  templatesChange?: string;
  todayChange?: string;
  openRateChange?: string;
  clickRateChange?: string;
  // Chart data
  weeklyStats?: Array<{ day: string; emails: number }>;
  monthlyStats?: Array<{ month: string; emails: number }>;
  // Recent activity
  recentActivity?: Array<{
    type: "email" | "template" | "recipients" | "analytics";
    title: string;
    time: string;
    details: string;
  }>;
}

export interface BulkEmailRecipient {
  id: string;
  email: string;
  name: string;
  status: "ACTIVE" | "SUSPENDED";
  isSelected: boolean;
}

// User Tracking Types
export interface UserTrackingData {
  userId: string;
  userInfo: {
    firstName: string;
    lastName: string;
    email: string;
    profilePicture?: string;
  };
  accountCreatedDate: string;
  lastLoginDate: string;
  currentVersion: {
    version: string;
    buildNumber: string;
    platform: string;
    deviceId: string;
    lastUsed: string;
  };
  totalLogins: number;
  lastSeen: string;
  recentLoginHistory: Array<{
    loginDate: string;
    platform: string;
    version: string;
    buildNumber: string;
    deviceId: string;
  }>;
  appUsageStats: {
    totalSessions: number;
    averageSessionDuration: number;
    lastSessionStart?: string;
    lastSessionEnd?: string;
  };
}

export interface UserTrackingStats {
  totalUsers: number;
  versionDistribution: Array<{
    version: string;
    platform: string;
    userCount: number;
    percentage: number;
  }>;
  platformDistribution: Array<{
    platform: string;
    userCount: number;
    percentage: number;
  }>;
  recentActivity: Array<{
    date: string;
    dailyLogins: number;
  }>;
  lastUpdated: string;
}

export interface UserTrackingAnalytics {
  totalUsers: number;
  versionDistribution: Array<{
    version: string;
    platform: string;
    userCount: number;
    percentage: number;
  }>;
  platformDistribution: Array<{
    platform: string;
    userCount: number;
    percentage: number;
  }>;
  dailyLogins: Array<{
    date: string;
    uniqueUsers: number;
    totalLogins: number;
  }>;
  versionAdoption: Array<{
    version: string;
    platform: string;
    totalUsers: number;
    dates: Array<{
      date: string;
      count: number;
    }>;
  }>;
  platformTrends: Array<{
    platform: string;
    totalUsers: number;
    dates: Array<{
      date: string;
      count: number;
    }>;
  }>;
  period: string;
}
