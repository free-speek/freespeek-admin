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
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
            Profile
          </h1>
          <p className="text-gray-600">User ID: {mockUser.id}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="h-32 sm:h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
          <div className="absolute bottom-2 sm:bottom-4 left-4 sm:left-6">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <img
                className="h-12 w-12 sm:h-20 sm:w-20 rounded-full border-2 sm:border-4 border-white"
                src={mockUser.profilePicture}
                alt={mockUser.name}
              />
              <div className="text-white">
                <h2 className="text-lg sm:text-2xl font-bold">
                  {mockUser.name}
                </h2>
              </div>
            </div>
          </div>

          <div className="absolute top-2 sm:top-4 right-2 sm:right-6 space-x-1 sm:space-x-2">
            <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
              <button className="btn-success text-xs sm:text-sm">
                AWARD TRIAL
              </button>
              <button className="btn-success text-xs sm:text-sm">
                CUSTOM REFERRAL CODES
              </button>
              <button className="btn-danger text-xs sm:text-sm">
                SUSPEND USER
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="mb-6 sm:mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    User Id
                  </label>
                  <p className="text-sm text-gray-900">{mockUser.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <p className="text-sm text-gray-900">{mockUser.firstName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <p className="text-sm text-gray-900">{mockUser.lastName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <p className="text-sm text-gray-900">{mockUser.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <p className="text-sm text-gray-900">
                    {mockUser.phoneNumber}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <p className="text-sm text-gray-900">{mockUser.gender}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age
                  </label>
                  <p className="text-sm text-gray-900">{mockUser.age}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <p className="text-sm text-gray-900">
                    {mockUser.dateOfBirth}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <p className="text-sm text-gray-900">{mockUser.location}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    {mockUser.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 sm:mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Account Information
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subscription
                  </label>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {mockUser.subscription}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trial Expires In
                  </label>
                  <p className="text-sm text-gray-900">
                    {mockUser.trialExpiresIn}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Referral Code
                  </label>
                  <p className="text-sm text-gray-900">
                    {mockUser.referralCode}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dynamic Referral Link
                  </label>
                  <p className="text-sm text-gray-900 break-all">
                    {mockUser.dynamicReferralLink}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Verified
                  </label>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      mockUser.isEmailVerified
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {mockUser.isEmailVerified ? "Yes" : "No"}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Verified
                  </label>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      mockUser.isPhoneNumberVerified
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {mockUser.isPhoneNumberVerified ? "Yes" : "No"}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tutorial Done
                  </label>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      mockUser.isTutorialDone
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {mockUser.isTutorialDone ? "Yes" : "No"}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Distance
                  </label>
                  <p className="text-sm text-gray-900">
                    {mockUser.maxDistance} {mockUser.distanceUnit}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 sm:mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {mockUser.interests?.map((interest, index) => (
                <span
                  key={index}
                  className="inline-flex px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Notification Preferences
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">
                    New Message Notification
                  </span>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      mockUser.notificationPreferences?.newMessageNotification
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {mockUser.notificationPreferences?.newMessageNotification
                      ? "On"
                      : "Off"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">
                    Like Notification
                  </span>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      mockUser.notificationPreferences?.likeNotification
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {mockUser.notificationPreferences?.likeNotification
                      ? "On"
                      : "Off"}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">
                    Priority Like Notification
                  </span>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      mockUser.notificationPreferences?.priorityLikeNotification
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {mockUser.notificationPreferences?.priorityLikeNotification
                      ? "On"
                      : "Off"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">
                    New Match Notification
                  </span>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      mockUser.notificationPreferences?.newMatchNotification
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {mockUser.notificationPreferences?.newMatchNotification
                      ? "On"
                      : "Off"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
