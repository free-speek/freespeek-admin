import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchUsers } from "../store/slices/usersSlice";
import { RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import Loader from "../components/Loader";
import { usePageTitle } from "../hooks/usePageTitle";

interface User {
  _id: string;
  profilePicture: string;
  firstName: string;
  lastName: string;
  fullName: string;
  location: {
    type: string;
    coordinates: number[];
    address: string;
  };
  email: string;
  lastLogin: string;
  status: string;
  isVerified: boolean;
  isSuspended: boolean;
  createdAt: string;
}

const FreespeekUsersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, isLoading, error, totalPages, totalUsers } = useAppSelector(
    (state: any) => state.users
  );
  const navigate = useNavigate();
  const [searchTerm] = useState("");
  const [statusFilter] = useState("all");
  const [localCurrentPage, setLocalCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  usePageTitle("Freespeek Users");

  useEffect(() => {
    dispatch(
      fetchUsers({
        page: localCurrentPage,
        limit: 10,
        search: searchTerm,
        status: statusFilter,
      })
    );
  }, [dispatch, searchTerm, statusFilter, localCurrentPage]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await dispatch(
      fetchUsers({
        page: localCurrentPage,
        limit: 10,
        search: searchTerm,
        status: statusFilter,
      })
    );
    setIsRefreshing(false);
  };

  const handlePageChange = (page: number) => {
    setLocalCurrentPage(page);
  };

  const handleViewUser = (userId: string) => {
    navigate(`/user-profile/${userId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">Error loading users: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
              Freespeek Users
            </h1>
            <p className="text-gray-600">Manage your Freespeek users</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh Users"
          >
            <RefreshCw
              className={`h-5 w-5 text-gray-600 ${
                isRefreshing ? "animate-spin" : ""
              }`}
            />
          </button>
        </div>
      </div>

      <div className="bg-blue-800 rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold">Freespeek Users List</h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-1 sm:px-2 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-1 sm:px-2 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Picture
                </th>
                <th className="px-1 sm:px-2 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="hidden sm:table-cell px-2 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="hidden xl:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-1 sm:px-2 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-1 sm:px-2 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user: User, index: number) => (
                <tr
                  key={user._id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-1 sm:px-2 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-1 sm:px-2 lg:px-6 py-4 whitespace-nowrap">
                    <img
                      className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 rounded-full"
                      src={user.profilePicture}
                      alt={user.fullName}
                    />
                  </td>
                  <td className="px-1 sm:px-2 lg:px-6 py-4 text-sm font-medium text-gray-900">
                    <div className="min-w-0">
                      <div className="font-medium truncate">
                        {user.fullName}
                      </div>
                      <div className="text-xs text-gray-500 sm:hidden">
                        {user.location.address.length > 30
                          ? `${user.location.address.substring(0, 30)}...`
                          : user.location.address}
                      </div>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-2 lg:px-6 py-4 text-sm text-gray-500">
                    <div className="max-w-[120px] lg:max-w-xs truncate">
                      {user.location.address}
                    </div>
                  </td>
                  <td className="hidden lg:table-cell px-6 py-4 text-sm text-gray-500">
                    <div className="max-w-[150px] truncate">{user.email}</div>
                  </td>
                  <td className="hidden xl:table-cell px-6 py-4 text-sm text-gray-500">
                    {user.lastLogin || "-"}
                  </td>
                  <td className="px-1 sm:px-2 lg:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-1 sm:px-2 lg:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className="btn-primary text-xs px-2 py-1"
                      onClick={() => handleViewUser(user._id)}
                    >
                      VIEW
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-2 sm:px-4 lg:px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="text-xs sm:text-sm text-white">
                Showing {(localCurrentPage - 1) * 10 + 1} to{" "}
                {Math.min(localCurrentPage * 10, totalUsers)} of {totalUsers}{" "}
                users
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <button
                  onClick={() => handlePageChange(localCurrentPage - 1)}
                  disabled={localCurrentPage === 1}
                  className="p-1 sm:p-2 text-white hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-2 py-1 text-xs sm:text-sm rounded ${
                          localCurrentPage === page
                            ? "bg-blue-600 text-white"
                            : "text-white hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(localCurrentPage + 1)}
                  disabled={localCurrentPage === totalPages}
                  className="p-1 sm:p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FreespeekUsersPage;
