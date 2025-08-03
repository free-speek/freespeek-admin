import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchUsers } from "../store/slices/usersSlice";
import { RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import Loader from "../components/Loader";

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
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
            {/* <ChevronDown className="h-5 w-5 text-gray-400" /> */}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Picture
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={user.profilePicture}
                      alt={user.fullName}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.fullName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.location.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className="btn-primary text-xs"
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
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {(localCurrentPage - 1) * 10 + 1} to{" "}
                {Math.min(localCurrentPage * 10, totalUsers)} of {totalUsers}{" "}
                users
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(localCurrentPage - 1)}
                  disabled={localCurrentPage === 1}
                  className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 text-white text-sm rounded ${
                        localCurrentPage === page
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(localCurrentPage + 1)}
                  disabled={localCurrentPage === totalPages}
                  className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
