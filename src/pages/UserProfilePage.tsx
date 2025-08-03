import React from "react";
import { User } from "../types";

const mockUser: User = {
  id: "6328996028612bc06b5704a4",
  name: "Aaron",
  email: "long.tran@venndii.com",
  location: "Toronto, ON, Canada",
  status: "ACTIVE",
  profilePicture: "https://via.placeholder.com/80x80/3B82F6/FFFFFF?text=A",
  firstName: "Long",
  lastName: "Tran",
  gender: "Male",
  phoneNumber: "+14168469176",
  age: 36,
  dateOfBirth: "February 17, 1986",
  interests: [
    "Cooking",
    "Movies",
    "Music",
    "Fitness",
    "Fishing",
    "Cars",
    "Star Wars",
  ],
  languages: [],
  hosting: true,
  meetLocalHosts: true,
  distanceUnit: "KM",
  referralCode: "urc_Aaron_7829",
  maxDistance: 100,
  homeLocation: "Toronto, ON, Canada",
  isEmailVerified: true,
  isPhoneNumberVerified: false,
  trialExpiresIn: "May 13, 2026",
  subscription: "TRIAL",
  isTutorialDone: true,
  isLoginWithEmailLocked: false,
  isSubscriptionModalOff: false,
  isPhoneNumberVerificationRequired: true,
  referrerUserId: undefined,
  invalidLoginAttempts: undefined,
  dynamicReferralLink: "https://freespeekapp.page.link/4Wiru5ksee8BYjH89",
  notificationPreferences: {
    newMessageNotification: true,
    likeNotification: true,
    priorityLikeNotification: true,
    newMatchNotification: true,
  },
  pendingAlerts: {
    tripsDisabled: false,
    trialExpired: false,
    subscriptionExpired: false,
  },
};

const UserProfilePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">User ID: {mockUser.id}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
          <div className="absolute bottom-4 left-6">
            <div className="flex items-center space-x-4">
              <img
                className="h-20 w-20 rounded-full border-4 border-white"
                src={mockUser.profilePicture}
                alt={mockUser.name}
              />
              <div className="text-white">
                <h2 className="text-2xl font-bold">{mockUser.name}</h2>
              </div>
            </div>
          </div>

          <div className="absolute top-4 right-6 space-x-2">
            <button className="btn-success text-sm">AWARD TRIAL</button>
            <button className="btn-success text-sm">
              CUSTOM REFERRAL CODES
            </button>
            <button className="btn-danger text-sm">SUSPEND USER</button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    User Id
                  </label>
                  <input
                    type="text"
                    value={mockUser.id}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={`${mockUser.firstName} ${mockUser.lastName}`}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={mockUser.email}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Home Location
                  </label>
                  <input
                    type="text"
                    value={mockUser.homeLocation}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Referral Code
                  </label>
                  <input
                    type="text"
                    value={mockUser.referralCode}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Distance
                  </label>
                  <input
                    type="text"
                    value={mockUser.maxDistance}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={mockUser.firstName}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={mockUser.lastName}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <input
                    type="text"
                    value={mockUser.gender}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={mockUser.phoneNumber}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age
                  </label>
                  <input
                    type="text"
                    value={mockUser.age}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="text"
                    value={mockUser.dateOfBirth}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Interests
                  </label>
                  <input
                    type="text"
                    value={mockUser.interests?.join(", ")}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Languages
                  </label>
                  <input
                    type="text"
                    value={
                      mockUser.languages?.length
                        ? mockUser.languages.join(", ")
                        : "(Not provided)"
                    }
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hosting
                  </label>
                  <input
                    type="text"
                    value={mockUser.hosting ? "Yes" : "No"}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meet Local Hosts
                  </label>
                  <input
                    type="text"
                    value={mockUser.meetLocalHosts ? "Yes" : "No"}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Distance Unit
                  </label>
                  <input
                    type="text"
                    value={mockUser.distanceUnit}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Notification Preferences
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Message Notification
                </label>
                <input
                  type="text"
                  value={
                    mockUser.notificationPreferences?.newMessageNotification
                      ? "Yes"
                      : "No"
                  }
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Like Notification
                </label>
                <input
                  type="text"
                  value={
                    mockUser.notificationPreferences?.likeNotification
                      ? "Yes"
                      : "No"
                  }
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority Like Notification
                </label>
                <input
                  type="text"
                  value={
                    mockUser.notificationPreferences?.priorityLikeNotification
                      ? "Yes"
                      : "No"
                  }
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Match Notification
                </label>
                <input
                  type="text"
                  value={
                    mockUser.notificationPreferences?.newMatchNotification
                      ? "Yes"
                      : "No"
                  }
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User Status
                </label>
                <input
                  type="text"
                  value={mockUser.status}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subscription
                </label>
                <input
                  type="text"
                  value={mockUser.subscription}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
