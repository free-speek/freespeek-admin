/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchUserById } from "../store/slices/usersSlice";
import {
  ChevronLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Shield,
  Activity,
  MessageSquare,
  FileText,
  Star,
  Users,
  BarChart3,
  Edit3,
  Trash2,
  Ban,
} from "lucide-react";

interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  location: {
    type: string;
    coordinates: number[];
    address: string;
  };
  status: string;
  isVerified: boolean;
  isSuspended: boolean;
  isDeleted: boolean;
  profilePicture?: string;
  interests?: string[];
  username?: string;
  gender?: string;
  lastLogin?: string;
  createdAt?: string;
  communities?: string[];
  totalPosts?: number;
  totalComments?: number;
  totalReplies?: number;
  totalListings?: number;
  totalBusinessRatings?: number;
  totalRestaurantRatings?: number;
  groupsJoined?: number;
  pollsCreated?: number;
  pollsParticipated?: number;
  totalEvents?: number;
  totalSafetyPosts?: number;
  totalUrgentAlerts?: number;
  totalLostFoundPosts?: number;
  totalLocalServicePosts?: number;
  totalCommunityPosts?: number;
  totalNeighborhoodPosts?: number;
}

const UserProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Get the full Redux state to debug
  const fullState = useAppSelector((state: any) => state);
  const { currentUser, isLoading, error } = useAppSelector(
    (state: any) => state.users
  );

  const [user, setUser] = useState<UserProfile | null>(null);

  usePageTitle("User Profile");

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserById(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
    }
  }, [currentUser, isLoading, error]);

  useEffect(() => {
    if (user) {
      // Removed console.log statements
    }
  }, [user]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSuspendUser = () => {
    // Handle suspend user
  };

  const handleEditUser = () => {
    // Handle edit user
  };

  const handleDeleteUser = () => {
    // Handle delete user
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
      </div>
    );
  }

  if (error || !user || !user._id) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">
          {error === "permission error"
            ? "Access denied. You don't have permission to view this user profile."
            : `Error loading user profile: ${error || "User not found"}`}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 animate-fadeIn">
      {/* Header Section */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 animate-slideInDown">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              User Profile
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              User ID: {user._id}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={handleEditUser}
            className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
          >
            <Edit3 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Edit User
          </button>
          <button
            onClick={handleSuspendUser}
            className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-yellow-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-yellow-700 transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
          >
            <Ban className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Suspend
          </button>
          <button
            onClick={handleDeleteUser}
            className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-red-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-red-700 transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
          >
            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Delete
          </button>
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg overflow-hidden animate-slideInUp hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col items-center space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4 lg:space-x-6">
            <div className="relative animate-bounceIn">
              <img
                className="h-20 w-20 sm:h-24 sm:w-24 rounded-full border-4 border-white shadow-lg transition-all duration-300 hover:scale-110"
                src={
                  user.profilePicture ||
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'%3E%3Crect width='96' height='96' fill='%233B82F6'/%3E%3Ctext x='48' y='56' font-family='Arial, sans-serif' font-size='36' font-weight='bold' text-anchor='middle' fill='white'%3EU%3C/text%3E%3C/svg%3E"
                }
                alt={user.fullName}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'%3E%3Crect width='96' height='96' fill='%233B82F6'/%3E%3Ctext x='48' y='56' font-family='Arial, sans-serif' font-size='36' font-weight='bold' text-anchor='middle' fill='white'%3EU%3C/text%3E%3C/svg%3E";
                  target.onerror = null;
                }}
              />
              <div
                className={`absolute -bottom-1 -right-1 h-4 w-4 sm:h-6 sm:w-6 rounded-full border-2 border-white animate-pulse ${
                  user.status === "active" ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
            </div>
            <div className="text-white text-center sm:text-left animate-slideInRight">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">
                {user.fullName}
              </h2>
              <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3 lg:space-x-4 text-white/90">
                <span className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1 bg-white/20 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 hover:bg-white/30 hover:scale-105">
                  <Shield className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  {user.status.toUpperCase()}
                </span>
                <span className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1 bg-white/20 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 hover:bg-white/30 hover:scale-105">
                  <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  {user.username || "No username"}
                </span>
                <span className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1 bg-white/20 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 hover:bg-white/30 hover:scale-105">
                  <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  {user.email}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Personal Information Card */}
        <div className="lg:col-span-2 animate-slideInLeft">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
            <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                <User className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-600" />
                Personal Information
              </h3>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center space-x-2 sm:space-x-3 group hover:bg-gray-50 p-2 rounded-lg transition-all duration-200">
                    <div className="h-6 w-6 sm:h-8 sm:w-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:scale-110 group-hover:bg-blue-200">
                      <User className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User ID
                      </label>
                      <p className="text-xs sm:text-sm font-mono text-gray-900 truncate">
                        {user._id}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 sm:space-x-3 group hover:bg-gray-50 p-2 rounded-lg transition-all duration-200">
                    <div className="h-6 w-6 sm:h-8 sm:w-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:scale-110 group-hover:bg-green-200">
                      <User className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                        First Name
                      </label>
                      <p className="text-xs sm:text-sm text-gray-900">
                        {user.firstName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 sm:space-x-3 group hover:bg-gray-50 p-2 rounded-lg transition-all duration-200">
                    <div className="h-6 w-6 sm:h-8 sm:w-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:scale-110 group-hover:bg-green-200">
                      <User className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Name
                      </label>
                      <p className="text-xs sm:text-sm text-gray-900">
                        {user.lastName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 sm:space-x-3 group hover:bg-gray-50 p-2 rounded-lg transition-all duration-200">
                    <div className="h-6 w-6 sm:h-8 sm:w-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:scale-110 group-hover:bg-purple-200">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date of Birth
                      </label>
                      <p className="text-xs sm:text-sm text-gray-900">
                        {user.dateOfBirth
                          ? new Date(user.dateOfBirth).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )
                          : "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center space-x-2 sm:space-x-3 group hover:bg-gray-50 p-2 rounded-lg transition-all duration-200">
                    <div className="h-6 w-6 sm:h-8 sm:w-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:scale-110 group-hover:bg-blue-200">
                      <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </label>
                      <p className="text-xs sm:text-sm text-gray-900 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 sm:space-x-3 group hover:bg-gray-50 p-2 rounded-lg transition-all duration-200">
                    <div className="h-6 w-6 sm:h-8 sm:w-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:scale-110 group-hover:bg-green-200">
                      <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone Number
                      </label>
                      <p className="text-xs sm:text-sm text-gray-900">
                        {user.phoneNumber || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 sm:space-x-3 group hover:bg-gray-50 p-2 rounded-lg transition-all duration-200">
                    <div className="h-6 w-6 sm:h-8 sm:w-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:scale-110 group-hover:bg-orange-200">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </label>
                      <p className="text-xs sm:text-sm text-gray-900">
                        {user.location?.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 sm:space-x-3 group hover:bg-gray-50 p-2 rounded-lg transition-all duration-200">
                    <div className="h-6 w-6 sm:h-8 sm:w-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:scale-110 group-hover:bg-indigo-200">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Login
                      </label>
                      <p className="text-xs sm:text-sm text-gray-900">
                        {user.lastLogin
                          ? user.lastLogin.charAt(0).toUpperCase() +
                            user.lastLogin.slice(1)
                          : "Not available"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Status Card */}
        <div className="space-y-4 sm:space-y-6 animate-slideInRight">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
            <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-600" />
                Account Status
              </h3>
            </div>
            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between group hover:bg-gray-50 p-2 rounded-lg transition-all duration-200">
                <span className="text-xs sm:text-sm text-gray-600">Status</span>
                <span
                  className={`inline-flex px-2 py-1 sm:px-3 sm:py-1 text-xs font-semibold rounded-full transition-all duration-200 group-hover:scale-105 ${
                    user.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {user.status.toUpperCase()}
                </span>
              </div>

              <div className="flex items-center justify-between group hover:bg-gray-50 p-2 rounded-lg transition-all duration-200">
                <span className="text-xs sm:text-sm text-gray-600">
                  Email Verified
                </span>
                <span
                  className={`inline-flex px-2 py-1 sm:px-3 sm:py-1 text-xs font-semibold rounded-full transition-all duration-200 group-hover:scale-105 ${
                    user.isVerified
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {user.isVerified ? "Verified" : "Not Verified"}
                </span>
              </div>

              <div className="flex items-center justify-between group hover:bg-gray-50 p-2 rounded-lg transition-all duration-200">
                <span className="text-xs sm:text-sm text-gray-600">
                  Phone Verified
                </span>
                <span
                  className={`inline-flex px-2 py-1 sm:px-3 sm:py-1 text-xs font-semibold rounded-full transition-all duration-200 group-hover:scale-105 ${
                    user.phoneNumber
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {user.phoneNumber ? "Verified" : "Not Verified"}
                </span>
              </div>

              <div className="flex items-center justify-between group hover:bg-gray-50 p-2 rounded-lg transition-all duration-200">
                <span className="text-xs sm:text-sm text-gray-600">Gender</span>
                <span className="text-xs sm:text-sm font-medium text-gray-900">
                  {user.gender
                    ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1)
                    : "Not provided"}
                </span>
              </div>

              <div className="flex items-center justify-between group hover:bg-gray-50 p-2 rounded-lg transition-all duration-200">
                <span className="text-xs sm:text-sm text-gray-600">
                  Account Created
                </span>
                <span className="text-xs sm:text-sm font-medium text-gray-900">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Not available"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Activity Statistics Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-slideInUp transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
            <Activity className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-600" />
            User Activity Statistics
          </h3>
        </div>
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4 lg:gap-6">
            <div className="text-center group hover:scale-105 transition-all duration-200 animate-statCard">
              <div className="h-12 w-12 sm:h-16 sm:w-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3 transition-all duration-200 group-hover:scale-110 group-hover:bg-blue-200">
                <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                {user.totalPosts || 0}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">Posts</p>
            </div>

            <div
              className="text-center group hover:scale-105 transition-all duration-200 animate-statCard"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="h-12 w-12 sm:h-16 sm:w-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3 transition-all duration-200 group-hover:scale-110 group-hover:bg-green-200">
                <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                {user.totalComments || 0}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">Comments</p>
            </div>

            <div
              className="text-center group hover:scale-105 transition-all duration-200 animate-statCard"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="h-12 w-12 sm:h-16 sm:w-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3 transition-all duration-200 group-hover:scale-110 group-hover:bg-purple-200">
                <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
              </div>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                {user.totalReplies || 0}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">Replies</p>
            </div>

            <div
              className="text-center group hover:scale-105 transition-all duration-200 animate-statCard"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="h-12 w-12 sm:h-16 sm:w-16 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3 transition-all duration-200 group-hover:scale-110 group-hover:bg-orange-200">
                <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
              </div>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                {user.totalListings || 0}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">Listings</p>
            </div>

            <div
              className="text-center group hover:scale-105 transition-all duration-200 animate-statCard"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="h-12 w-12 sm:h-16 sm:w-16 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3 transition-all duration-200 group-hover:scale-110 group-hover:bg-yellow-200">
                <Star className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600" />
              </div>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                {user.totalBusinessRatings || 0}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">
                Business Reviews
              </p>
            </div>

            <div
              className="text-center group hover:scale-105 transition-all duration-200 animate-statCard"
              style={{ animationDelay: "0.5s" }}
            >
              <div className="h-12 w-12 sm:h-16 sm:w-16 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3 transition-all duration-200 group-hover:scale-110 group-hover:bg-yellow-200">
                <Star className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600" />
              </div>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                {user.totalRestaurantRatings || 0}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">
                Restaurant Reviews
              </p>
            </div>

            <div
              className="text-center group hover:scale-105 transition-all duration-200 animate-statCard"
              style={{ animationDelay: "0.6s" }}
            >
              <div className="h-12 w-12 sm:h-16 sm:w-16 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3 transition-all duration-200 group-hover:scale-110 group-hover:bg-indigo-200">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600" />
              </div>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                {user.groupsJoined || 0}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">Groups</p>
            </div>

            <div
              className="text-center group hover:scale-105 transition-all duration-200 animate-statCard"
              style={{ animationDelay: "0.7s" }}
            >
              <div className="h-12 w-12 sm:h-16 sm:w-16 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3 transition-all duration-200 group-hover:scale-110 group-hover:bg-pink-200">
                <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-pink-600" />
              </div>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                {user.pollsCreated || 0}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">Polls Created</p>
            </div>

            <div
              className="text-center group hover:scale-105 transition-all duration-200 animate-statCard"
              style={{ animationDelay: "0.8s" }}
            >
              <div className="h-12 w-12 sm:h-16 sm:w-16 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3 transition-all duration-200 group-hover:scale-110 group-hover:bg-teal-200">
                <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-teal-600" />
              </div>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                {user.pollsParticipated || 0}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">Polls Joined</p>
            </div>

            <div
              className="text-center group hover:scale-105 transition-all duration-200 animate-statCard"
              style={{ animationDelay: "0.9s" }}
            >
              <div className="h-12 w-12 sm:h-16 sm:w-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3 transition-all duration-200 group-hover:scale-110 group-hover:bg-red-200">
                <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
              </div>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                {user.totalEvents || 0}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">Events</p>
            </div>

            <div
              className="text-center group hover:scale-105 transition-all duration-200 animate-statCard"
              style={{ animationDelay: "1s" }}
            >
              <div className="h-12 w-12 sm:h-16 sm:w-16 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3 transition-all duration-200 group-hover:scale-110 group-hover:bg-amber-200">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-amber-600" />
              </div>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                {user.totalSafetyPosts || 0}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">Safety Posts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Post Types Statistics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-slideInUp transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
            <FileText className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-600" />
            Specialized Post Types
          </h3>
        </div>
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            <div className="text-center group hover:scale-105 transition-all duration-200 animate-statCard">
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2 transition-all duration-200 group-hover:scale-110 group-hover:bg-orange-200">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
              </div>
              <p className="text-sm sm:text-lg font-bold text-gray-900">
                {user.totalLostFoundPosts || 0}
              </p>
              <p className="text-xs text-gray-600">Lost & Found</p>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Reports Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-slideInUp transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
            <Shield className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-red-600" />
            Safety Reports
          </h3>
        </div>
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            <div className="text-center group hover:scale-105 transition-all duration-200 animate-statCard">
              <div className="h-12 w-12 sm:h-16 sm:w-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3 transition-all duration-200 group-hover:scale-110 group-hover:bg-red-200">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
              </div>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                1
              </p>
              <p className="text-xs sm:text-sm text-gray-600">Safety Tips</p>
            </div>

            <div
              className="text-center group hover:scale-105 transition-all duration-200 animate-statCard"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="h-12 w-12 sm:h-16 sm:w-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3 transition-all duration-200 group-hover:scale-110 group-hover:bg-blue-200">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                1
              </p>
              <p className="text-xs sm:text-sm text-gray-600">Watch Groups</p>
            </div>

            <div
              className="text-center group hover:scale-105 transition-all duration-200 animate-statCard"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="h-12 w-12 sm:h-16 sm:w-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3 transition-all duration-200 group-hover:scale-110 group-hover:bg-green-200">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                1
              </p>
              <p className="text-xs sm:text-sm text-gray-600">Safety Feed</p>
            </div>

            <div
              className="text-center group hover:scale-105 transition-all duration-200 animate-statCard"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="h-12 w-12 sm:h-16 sm:w-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3 transition-all duration-200 group-hover:scale-110 group-hover:bg-purple-200">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
              </div>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                1
              </p>
              <p className="text-xs sm:text-sm text-gray-600">Crime Map</p>
            </div>
          </div>
        </div>
      </div>

      {/* Interests and Communities */}
      {(user.interests && user.interests.length > 0) ||
      (user.communities && user.communities.length > 0) ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {user.interests &&
            Array.isArray(user.interests) &&
            user.interests.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-slideInLeft transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
                <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                    <Star className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-yellow-600" />
                    Interests
                  </h3>
                </div>
                <div className="p-4 sm:p-6">
                  <div className="flex flex-wrap gap-2">
                    {user.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="inline-flex px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm font-medium bg-blue-100 text-blue-800 rounded-full transition-all duration-200 hover:scale-105 hover:bg-blue-200 animate-fadeIn"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

          {user.communities &&
            Array.isArray(user.communities) &&
            user.communities.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-slideInRight transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
                <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-indigo-600" />
                    Communities
                  </h3>
                </div>
                <div className="p-4 sm:p-6">
                  <div className="flex flex-wrap gap-2">
                    {user.communities.map((community, index) => (
                      <span
                        key={index}
                        className="inline-flex px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm font-medium bg-green-100 text-green-800 rounded-full transition-all duration-200 hover:scale-105 hover:bg-green-200 animate-fadeIn"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {community}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
        </div>
      ) : null}
    </div>
  );
};

export default UserProfilePage;
