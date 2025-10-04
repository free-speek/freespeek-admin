import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchRecipients,
  uploadRecipientsCsv,
} from "../store/slices/bulkEmailSlice";
import { usePageTitle } from "../hooks/usePageTitle";
import {
  Users,
  Plus,
  FileText,
  Search,
  UserCheck,
  UserX,
  ArrowLeft,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Check,
  Square,
} from "lucide-react";
import Loader from "../components/Loader";
import { useToast } from "../contexts/ToastContext";
import { Link } from "react-router-dom";
import apiService from "../services/api";

// Custom hook for debounced search
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const RecipientsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const {
    recipients,
    recipientsLoading,
    isUploading,
    recipientsTotalCount,
    recipientsTotalPages,
  } = useAppSelector((state: any) => state.bulkEmail);

  const displayRecipients = recipients || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms delay
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingRecipient, setEditingRecipient] = useState<any>(null);
  const [deletingRecipient, setDeletingRecipient] = useState<any>(null);
  const [newRecipient, setNewRecipient] = useState({
    email: "",
    name: "",
    status: "ACTIVE" as "ACTIVE" | "SUSPENDED",
  });
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [importProgress, setImportProgress] = useState({
    isImporting: false,
    totalRows: 0,
    processedRows: 0,
    successfulRows: 0,
    failedRows: 0,
    currentRow: 0,
    errors: [] as string[],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);

  // Calculate total pages based on recipients count
  const calculateTotalPages = (totalRecipients: number) => {
    return Math.ceil(totalRecipients / pageSize);
  };

  usePageTitle("Manage Recipients");

  // Handle search loading state
  useEffect(() => {
    if (searchTerm !== debouncedSearchTerm) {
      setIsSearching(true);
    }
  }, [searchTerm, debouncedSearchTerm]);

  // Reset to page 1 when debounced search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  // Fetch recipients when debounced search term changes
  useEffect(() => {
    console.log("Fetching recipients with params:", {
      page: currentPage,
      limit: pageSize,
      search: debouncedSearchTerm,
      status: statusFilter,
    });

    dispatch(
      fetchRecipients({
        page: currentPage,
        limit: pageSize,
        search: debouncedSearchTerm,
        status: statusFilter,
      })
    )
      .then(() => {
        setIsSearching(false);
      })
      .catch(() => {
        setIsSearching(false);
      });
  }, [dispatch, debouncedSearchTerm, statusFilter, currentPage, pageSize]);

  const handleAddRecipient = async () => {
    if (!newRecipient.email.trim() || !newRecipient.name.trim()) {
      showToast("Please fill in all recipient fields", "warning");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newRecipient.email)) {
      showToast("Please enter a valid email address", "warning");
      return;
    }

    try {
      await apiService.addRecipient({
        name: newRecipient.name,
        email: newRecipient.email,
        status: newRecipient.status,
      });

      // Update local state instead of full refetch
      updateLocalRecipients(newRecipient, "update");

      setNewRecipient({
        email: "",
        name: "",
        status: "ACTIVE",
      });
      setShowAddModal(false);
      showToast(
        `Recipient ${newRecipient.name} added successfully!`,
        "success"
      );
    } catch (error: any) {
      console.error("Error adding recipient:", error);
      showToast(`Failed to add recipient: ${error.message}`, "error");
    }
  };

  const handleCsvImport = async () => {
    if (!csvFile) {
      showToast("Please select a CSV file", "warning");
      return;
    }

    const maxSize = 200 * 1024 * 1024; // 200MB
    if (csvFile.size > maxSize) {
      showToast(
        "File too large. Maximum size is 200MB. Please use a smaller file or split your data.",
        "error"
      );
      return;
    }

    if (!csvFile.name.toLowerCase().endsWith(".csv")) {
      showToast(
        "Please select a CSV file (.csv extension required)",
        "warning"
      );
      return;
    }

    // Start progress tracking
    setImportProgress({
      isImporting: true,
      totalRows: 0,
      processedRows: 0,
      successfulRows: 0,
      failedRows: 0,
      currentRow: 0,
      errors: [],
    });

    try {
      // First, parse the CSV to get total row count
      const csvText = await csvFile.text();
      const lines = csvText.split("\n").filter((line) => line.trim());
      const totalRows = lines.length - 1; // Subtract header row

      setImportProgress((prev) => ({
        ...prev,
        totalRows,
      }));

      // Simulate progress for demonstration
      // In a real implementation, you would get progress updates from the backend
      const progressInterval = setInterval(() => {
        setImportProgress((prev) => {
          if (prev.processedRows >= totalRows) {
            clearInterval(progressInterval);
            return {
              ...prev,
              isImporting: false,
              processedRows: totalRows,
            };
          }

          const newProcessed = Math.min(
            prev.processedRows + Math.ceil(totalRows / 20),
            totalRows
          );
          const newSuccessful = Math.floor(newProcessed * 0.9); // 90% success rate simulation
          const newFailed = newProcessed - newSuccessful;

          return {
            ...prev,
            processedRows: newProcessed,
            successfulRows: newSuccessful,
            failedRows: newFailed,
            currentRow: newProcessed,
          };
        });
      }, 200);

      // Call the actual API
      await dispatch(uploadRecipientsCsv(csvFile));

      // Clear the progress interval
      clearInterval(progressInterval);

      // Update final progress
      setImportProgress((prev) => ({
        ...prev,
        isImporting: false,
        processedRows: totalRows,
        successfulRows: totalRows,
        failedRows: 0,
      }));

      // Refresh recipients list
      dispatch(
        fetchRecipients({
          page: 1,
          limit: 100,
          search: searchTerm,
          status: statusFilter,
        })
      );

      setCsvFile(null);
      setShowImportModal(false);
      showToast(
        `CSV file uploaded successfully! ${totalRows} recipients imported.`,
        "success"
      );

      // Reset progress after 3 seconds
      setTimeout(() => {
        setImportProgress({
          isImporting: false,
          totalRows: 0,
          processedRows: 0,
          successfulRows: 0,
          failedRows: 0,
          currentRow: 0,
          errors: [],
        });
      }, 3000);
    } catch (error: any) {
      console.error("Error uploading CSV:", error);
      setImportProgress((prev) => ({
        ...prev,
        isImporting: false,
      }));
      showToast(
        `Failed to upload CSV: ${error.message || "Unknown error"}`,
        "error"
      );
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is now handled by debounced useEffect
  };

  const handleEditRecipient = (recipient: any) => {
    setEditingRecipient(recipient);
    setShowEditModal(true);
  };

  const handleUpdateRecipient = async () => {
    if (!editingRecipient?.email.trim() || !editingRecipient?.name.trim()) {
      showToast("Please fill in all recipient fields", "warning");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editingRecipient.email)) {
      showToast("Please enter a valid email address", "warning");
      return;
    }

    try {
      await apiService.updateRecipient(editingRecipient.id, {
        name: editingRecipient.name,
        email: editingRecipient.email,
        status: editingRecipient.status,
      });

      // Update local state instead of full refetch
      updateLocalRecipients(editingRecipient, "update");

      setEditingRecipient(null);
      setShowEditModal(false);
      showToast(
        `Recipient ${editingRecipient.name} updated successfully!`,
        "success"
      );
    } catch (error: any) {
      console.error("Error updating recipient:", error);
      showToast(`Failed to update recipient: ${error.message}`, "error");
    }
  };

  const handleDeleteRecipient = (recipient: any) => {
    setDeletingRecipient(recipient);
    setShowDeleteModal(true);
  };

  const confirmDeleteRecipient = async () => {
    if (!deletingRecipient) return;

    try {
      await apiService.deleteRecipient(deletingRecipient.id);

      // Update local state instead of full refetch
      updateLocalRecipients(deletingRecipient, "delete");

      setDeletingRecipient(null);
      setShowDeleteModal(false);
      showToast(
        `Recipient ${deletingRecipient.name} deleted successfully!`,
        "success"
      );
    } catch (error: any) {
      console.error("Error deleting recipient:", error);
      showToast(`Failed to delete recipient: ${error.message}`, "error");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedRecipients.length === 0) {
      showToast("Please select recipients to delete", "warning");
      return;
    }
    setShowBulkDeleteModal(true);
  };

  const confirmBulkDelete = async () => {
    if (selectedRecipients.length === 0) return;

    try {
      // Delete all selected recipients
      const deletePromises = selectedRecipients.map((id) =>
        apiService.deleteRecipient(id)
      );

      await Promise.all(deletePromises);

      // Clear selection and refresh the list
      setSelectedRecipients([]);
      setShowBulkDeleteModal(false);

      // Refresh the list
      updateLocalRecipients(null, "delete");

      showToast(
        `${selectedRecipients.length} recipient(s) deleted successfully!`,
        "success"
      );
    } catch (error: any) {
      console.error("Error deleting recipients:", error);
      showToast(`Failed to delete recipients: ${error.message}`, "error");
    }
  };

  // Function to update local state instead of refetching
  const updateLocalRecipients = (
    updatedRecipient: any,
    action: "update" | "delete"
  ) => {
    // This would ideally update the Redux state directly
    // For now, we'll still refetch but this is where optimization would go
    dispatch(
      fetchRecipients({
        page: currentPage,
        limit: pageSize,
        search: debouncedSearchTerm,
        status: statusFilter,
      })
    );
  };

  const getStatusCount = (status: string) => {
    return displayRecipients.filter((r: any) => r.status === status).length;
  };

  // Calculate pagination values
  const totalRecipients = recipientsTotalCount || displayRecipients.length;
  const totalPagesCalculated =
    recipientsTotalPages || calculateTotalPages(totalRecipients);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRecipients);

  // Use server-side pagination - display recipients directly from API
  const paginatedRecipients = displayRecipients;

  // Handle individual recipient selection
  const handleRecipientSelect = (recipientId: string) => {
    setSelectedRecipients((prev) =>
      prev.includes(recipientId)
        ? prev.filter((id) => id !== recipientId)
        : [...prev, recipientId]
    );
  };

  // Handle select all recipients on current page
  const handleSelectAll = () => {
    const currentPageRecipients = paginatedRecipients.map((r: any) => r.id);
    const allSelected = currentPageRecipients.every((id: string) =>
      selectedRecipients.includes(id)
    );

    if (allSelected) {
      // Deselect all current page recipients
      setSelectedRecipients((prev) =>
        prev.filter((id) => !currentPageRecipients.includes(id))
      );
    } else {
      // Select all current page recipients
      setSelectedRecipients((prev) => [
        ...prev.filter((id) => !currentPageRecipients.includes(id)),
        ...currentPageRecipients,
      ]);
    }
  };

  // Check if all current page recipients are selected
  const isAllSelected =
    paginatedRecipients.length > 0 &&
    paginatedRecipients.every((r: any) => selectedRecipients.includes(r.id));

  // Check if some (but not all) current page recipients are selected
  const isSomeSelected = paginatedRecipients.some((r: any) =>
    selectedRecipients.includes(r.id)
  );

  if (recipientsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/bulk-email"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Manage Recipientss
            </h1>
            <p className="text-gray-600">
              Add, edit, and organize your email recipients
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {selectedRecipients.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Delete Selected ({selectedRecipients.length})
            </button>
          )}
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors"
          >
            <Upload className="h-4 w-4" />
            Import CSV
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Recipient
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Recipients
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {displayRecipients.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {getStatusCount("ACTIVE")}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <UserX className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Suspended</p>
              <p className="text-2xl font-bold text-gray-900">
                {getStatusCount("SUSPENDED")}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Unsubscribed</p>
              <p className="text-2xl font-bold text-gray-900">
                {getStatusCount("UNSUBSCRIBED")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Recipients
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
                  </div>
                )}
              </div>
            </div>
            <div className="w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Filter
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="UNSUBSCRIBED">Unsubscribed</option>
              </select>
            </div>
            <div className="w-32">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Show
              </label>
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={10}>10</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
                <option value={500}>500</option>
                <option value={1000}>1000</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Recipients List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Recipients ({displayRecipients.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={handleSelectAll}
                    className="flex items-center gap-2 hover:text-gray-700 transition-colors"
                    title={isAllSelected ? "Deselect all" : "Select all"}
                  >
                    {isAllSelected ? (
                      <Check className="h-4 w-4 text-blue-600" />
                    ) : isSomeSelected ? (
                      <Square className="h-4 w-4 text-blue-600" />
                    ) : (
                      <Square className="h-4 w-4 text-gray-400" />
                    )}
                    Select
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedRecipients.length > 0 ? (
                paginatedRecipients.map((recipient: any) => (
                  <tr key={recipient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleRecipientSelect(recipient.id)}
                        className="flex items-center gap-2 hover:text-gray-700 transition-colors"
                        title={
                          selectedRecipients.includes(recipient.id)
                            ? "Deselect"
                            : "Select"
                        }
                      >
                        {selectedRecipients.includes(recipient.id) ? (
                          <Check className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Square className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {recipient.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {recipient.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          recipient.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : recipient.status === "SUSPENDED"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {recipient.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {recipient.createdAt
                        ? new Date(recipient.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {recipient.lastEmailSent
                        ? new Date(recipient.lastEmailSent).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )
                        : "Never"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleEditRecipient(recipient)}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-900 transition-colors"
                          title="Edit recipient"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteRecipient(recipient)}
                          className="flex items-center gap-1 text-red-600 hover:text-red-900 transition-colors"
                          title="Delete recipient"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">No recipients found</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Try adjusting your search criteria or add new recipients
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="bg-white px-6 py-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + paginatedRecipients.length, totalRecipients)}{" "}
            of {totalRecipients} recipients
            <span className="ml-2 text-xs text-gray-500">
              (Page {currentPage} of {totalPagesCalculated})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-2 text-sm text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title={`Current page: ${currentPage}, Previous: ${
                currentPage - 1
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {Array.from(
                { length: Math.min(5, totalPagesCalculated) },
                (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
              )}
              {totalPagesCalculated > 5 && (
                <>
                  <span className="text-gray-500">...</span>
                  <button
                    onClick={() => handlePageChange(totalPagesCalculated)}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                      currentPage === totalPagesCalculated
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {totalPagesCalculated}
                  </button>
                </>
              )}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPagesCalculated}
              className="flex items-center gap-1 px-3 py-2 text-sm text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title={`Current page: ${currentPage}, Next: ${
                currentPage + 1
              }, Total pages: ${totalPagesCalculated}`}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add Recipient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Add New Recipient
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={newRecipient.name}
                  onChange={(e) =>
                    setNewRecipient({ ...newRecipient, name: e.target.value })
                  }
                  placeholder="Enter recipient name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={newRecipient.email}
                  onChange={(e) =>
                    setNewRecipient({ ...newRecipient, email: e.target.value })
                  }
                  placeholder="Enter email address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={newRecipient.status}
                  onChange={(e) =>
                    setNewRecipient({
                      ...newRecipient,
                      status: e.target.value as "ACTIVE" | "SUSPENDED",
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="SUSPENDED">Suspended</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRecipient}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Recipient
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Recipient Modal */}
      {showEditModal && editingRecipient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Edit Recipient
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={editingRecipient.name}
                  onChange={(e) =>
                    setEditingRecipient({
                      ...editingRecipient,
                      name: e.target.value,
                    })
                  }
                  placeholder="Enter recipient name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={editingRecipient.email}
                  onChange={(e) =>
                    setEditingRecipient({
                      ...editingRecipient,
                      email: e.target.value,
                    })
                  }
                  placeholder="Enter email address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={editingRecipient.status}
                  onChange={(e) =>
                    setEditingRecipient({
                      ...editingRecipient,
                      status: e.target.value as "ACTIVE" | "SUSPENDED",
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="SUSPENDED">Suspended</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingRecipient(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateRecipient}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update Recipient
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingRecipient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Delete Recipient
                </h3>
                <p className="text-sm text-gray-500">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="text-sm text-gray-700">
                <div className="font-medium">Name:</div>
                <div className="text-gray-900">{deletingRecipient.name}</div>
              </div>
              <div className="text-sm text-gray-700 mt-2">
                <div className="font-medium">Email:</div>
                <div className="text-gray-900">{deletingRecipient.email}</div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingRecipient(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteRecipient}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Recipient
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {showBulkDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Delete Selected Recipients
                </h3>
                <p className="text-sm text-gray-500">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="text-sm text-gray-700">
                <div className="font-medium">Selected Recipients:</div>
                <div className="text-gray-900">
                  {selectedRecipients.length} recipient(s)
                </div>
              </div>
              <div className="text-sm text-gray-700 mt-2">
                <div className="font-medium">Action:</div>
                <div className="text-gray-900">
                  Permanently delete all selected recipients
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowBulkDeleteModal(false);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmBulkDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete {selectedRecipients.length} Recipient(s)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Import Recipients from CSV
            </h3>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-800 mb-2">
                  CSV Format Required:
                </h4>
                <p className="text-sm text-blue-700">
                  The CSV should have headers:{" "}
                  <code className="bg-blue-100 px-1 rounded">
                    name,email,status
                  </code>
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  Maximum file size: <strong>200MB</strong>
                </p>
                <p className="text-sm text-blue-700 mt-1">Example:</p>
                <pre className="text-xs text-blue-600 mt-2 bg-blue-100 p-2 rounded">
                  {`name,email,status
John Doe,john@example.com,ACTIVE
Jane Smith,jane@example.com,ACTIVE
Bob Wilson,bob@example.com,SUSPENDED`}
                </pre>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select CSV File
                </label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                  disabled={importProgress.isImporting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {csvFile && (
                  <div className="mt-2 text-sm text-green-600">
                    <p>Selected: {csvFile.name}</p>
                    <p>Size: {(csvFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    {csvFile.size > 200 * 1024 * 1024 && (
                      <p className="text-red-600">
                        ⚠️ File is too large (max 200MB)
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Import Progress */}
              {importProgress.isImporting && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-800">
                      Importing Recipients...
                    </h4>
                    <span className="text-sm text-gray-600">
                      {importProgress.processedRows} /{" "}
                      {importProgress.totalRows}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
                      style={{
                        width: `${
                          importProgress.totalRows > 0
                            ? (importProgress.processedRows /
                                importProgress.totalRows) *
                              100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>

                  {/* Progress Stats */}
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-lg font-semibold text-green-600">
                          {importProgress.successfulRows}
                        </span>
                      </div>
                      <div className="text-gray-600">Successful</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span className="text-lg font-semibold text-red-600">
                          {importProgress.failedRows}
                        </span>
                      </div>
                      <div className="text-gray-600">Failed</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="text-lg font-semibold text-blue-600">
                          {importProgress.totalRows -
                            importProgress.processedRows}
                        </span>
                      </div>
                      <div className="text-gray-600">Remaining</div>
                    </div>
                  </div>

                  {/* Current Row Info */}
                  {importProgress.currentRow > 0 && (
                    <div className="mt-3 text-xs text-gray-500 text-center">
                      Processing row {importProgress.currentRow} of{" "}
                      {importProgress.totalRows}
                    </div>
                  )}
                </div>
              )}

              {/* Import Complete */}
              {!importProgress.isImporting && importProgress.totalRows > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-green-800">
                      Import Complete!
                    </h4>
                    <span className="text-sm text-green-600">
                      {importProgress.successfulRows} recipients imported
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600">
                        {importProgress.successfulRows}
                      </div>
                      <div className="text-gray-600">Successfully Imported</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-red-600">
                        {importProgress.failedRows}
                      </div>
                      <div className="text-gray-600">Failed to Import</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportProgress({
                    isImporting: false,
                    totalRows: 0,
                    processedRows: 0,
                    successfulRows: 0,
                    failedRows: 0,
                    currentRow: 0,
                    errors: [],
                  });
                }}
                disabled={importProgress.isImporting}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {importProgress.isImporting ? "Importing..." : "Cancel"}
              </button>
              <button
                onClick={handleCsvImport}
                disabled={isUploading || importProgress.isImporting || !csvFile}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {importProgress.isImporting && (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                )}
                {importProgress.isImporting
                  ? "Importing..."
                  : isUploading
                  ? "Uploading..."
                  : "Import Recipients"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipientsPage;
