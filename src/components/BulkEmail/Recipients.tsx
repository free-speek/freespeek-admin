import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchRecipients,
  uploadRecipientsCsv,
} from "../../store/slices/bulkEmailSlice";
import {
  Users,
  Plus,
  Upload,
  Search,
  UserCheck,
  UserX,
  Trash2,
  Edit,
} from "lucide-react";
import { useToast } from "../../contexts/ToastContext";
import Loader from "../Loader";
import apiService from "../../services/api";

const Recipients: React.FC = () => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const { recipients, recipientsLoading } = useAppSelector(
    (state: any) => state.bulkEmail
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddRecipientModal, setShowAddRecipientModal] = useState(false);
  const [showEditRecipientModal, setShowEditRecipientModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const [editingRecipient, setEditingRecipient] = useState<any>(null);
  const [deletingRecipient, setDeletingRecipient] = useState<any>(null);
  const [newRecipient, setNewRecipient] = useState({
    email: "",
    name: "",
    status: "ACTIVE" as "ACTIVE" | "SUSPENDED",
  });
  const [csvFile, setCsvFile] = useState<File | null>(null);

  useEffect(() => {
    dispatch(
      fetchRecipients({
        page: 1,
        limit: 0, // Set to 0 to fetch ALL recipients from database
        search: "", // Always fetch all recipients, we'll filter client-side
        status: statusFilter,
      })
    ).catch(() => {
      console.log("Recipients API not available, using mock data");
    });
  }, [dispatch, statusFilter]); // Removed debouncedSearchTerm from dependencies

  const displayRecipients = recipients || [];

  const filteredRecipients = displayRecipients.filter((recipient: any) => {
    const matchesSearch =
      recipient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipient.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || recipient.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages =
    itemsPerPage === 0
      ? 1
      : Math.ceil(filteredRecipients.length / itemsPerPage);
  const startIndex = itemsPerPage === 0 ? 0 : (currentPage - 1) * itemsPerPage;
  const endIndex =
    itemsPerPage === 0 ? filteredRecipients.length : startIndex + itemsPerPage;
  const paginatedRecipients =
    itemsPerPage === 0
      ? filteredRecipients
      : filteredRecipients.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, itemsPerPage]);

  const handleAddRecipient = async () => {
    if (!newRecipient.email.trim() || !newRecipient.name.trim()) {
      showToast("Please fill in all recipient fields", "warning");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newRecipient.email)) {
      showToast("Please enter a valid email address", "warning");
      return;
    }

    try {
      // Call API to add recipient
      await apiService.addRecipient({
        name: newRecipient.name,
        email: newRecipient.email,
        status: newRecipient.status,
      });

      // Refresh recipients list
      dispatch(
        fetchRecipients({
          page: 1,
          limit: 0, // Fetch ALL recipients
          search: "", // No server-side search, we filter client-side
          status: statusFilter,
        })
      );

      // Reset form
      setNewRecipient({
        email: "",
        name: "",
        status: "ACTIVE",
      });
      setShowAddRecipientModal(false);

      // Show success message
      showToast(
        `Recipient ${newRecipient.name} added successfully!`,
        "success"
      );
    } catch (error: any) {
      console.error("Error adding recipient:", error);
      showToast(`Failed to add recipient: ${error.message}`, "error");
    }
  };

  const handleEditRecipient = (recipient: any) => {
    setEditingRecipient(recipient);
    setNewRecipient({
      email: recipient.email,
      name: recipient.name,
      status: recipient.status,
    });
    setShowEditRecipientModal(true);
  };

  const handleUpdateRecipient = async () => {
    if (!newRecipient.email.trim() || !newRecipient.name.trim()) {
      showToast("Please fill in all recipient fields", "warning");
      return;
    }

    if (!editingRecipient) return;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newRecipient.email)) {
      showToast("Please enter a valid email address", "warning");
      return;
    }

    try {
      // Call API to update recipient
      await apiService.updateRecipient(editingRecipient.id, {
        name: newRecipient.name,
        email: newRecipient.email,
        status: newRecipient.status,
      });

      // Refresh recipients list
      dispatch(
        fetchRecipients({
          page: 1,
          limit: 0, // Fetch ALL recipients
          search: "", // No server-side search, we filter client-side
          status: statusFilter,
        })
      );

      // Reset form and close modal
      setNewRecipient({
        email: "",
        name: "",
        status: "ACTIVE",
      });
      setEditingRecipient(null);
      setShowEditRecipientModal(false);

      // Show success message
      showToast(
        `Recipient ${newRecipient.name} updated successfully!`,
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
      // Call API to delete recipient
      await apiService.deleteRecipient(deletingRecipient.id);

      // Refresh recipients list
      dispatch(
        fetchRecipients({
          page: 1,
          limit: 0, // Fetch ALL recipients
          search: "", // No server-side search, we filter client-side
          status: statusFilter,
        })
      );

      setDeletingRecipient(null);
      setShowDeleteModal(false);

      // Show success message
      showToast(
        `Recipient ${deletingRecipient.name} deleted successfully!`,
        "success"
      );
    } catch (error: any) {
      console.error("Error deleting recipient:", error);
      showToast(`Failed to delete recipient: ${error.message}`, "error");
    }
  };

  const handleCsvImport = async () => {
    if (!csvFile) {
      showToast("Please select a CSV file", "warning");
      return;
    }

    // Check file size (200MB limit)
    const maxSize = 200 * 1024 * 1024; // 200MB
    if (csvFile.size > maxSize) {
      showToast(
        "File too large. Maximum size is 200MB. Please use a smaller file or split your data.",
        "error"
      );
      return;
    }

    // Check file type
    if (!csvFile.name.toLowerCase().endsWith(".csv")) {
      showToast(
        "Please select a CSV file (.csv extension required)",
        "warning"
      );
      return;
    }

    try {
      await dispatch(uploadRecipientsCsv(csvFile));
      // Refresh recipients after successful upload
      dispatch(
        fetchRecipients({
          page: 1,
          limit: 0, // Fetch ALL recipients
          search: "", // No server-side search, we filter client-side
          status: statusFilter,
        })
      );
      setCsvFile(null);
      setShowImportModal(false);
      showToast("CSV file uploaded and processed successfully!", "success");
    } catch (error: any) {
      console.error("Error uploading CSV:", error);
      showToast(
        `Failed to upload CSV: ${error.message || "Unknown error"}`,
        "error"
      );
    }
  };

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
      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowImportModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <Upload className="h-4 w-4" />
          Import CSV
        </button>
        <button
          onClick={() => setShowAddRecipientModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Recipient
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search recipients..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
        <select
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(Number(e.target.value))}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value={10}>10 per page</option>
          <option value={100}>100 per page</option>
          <option value={500}>500 per page</option>
          <option value={1000}>1000 per page</option>
          <option value={2000}>2000 per page</option>
          <option value={0}>All recipients</option>
        </select>
      </div>

      {/* Recipients List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900">
              Recipients (
              {itemsPerPage === 0
                ? filteredRecipients.length
                : paginatedRecipients.length}{" "}
              of {filteredRecipients.length} total)
            </h4>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <UserCheck className="h-4 w-4 text-green-600" />
              <span>
                {
                  filteredRecipients.filter((r: any) => r.status === "ACTIVE")
                    .length
                }{" "}
                Active
              </span>
              <UserX className="h-4 w-4 text-red-600 ml-2" />
              <span>
                {
                  filteredRecipients.filter(
                    (r: any) => r.status === "SUSPENDED"
                  ).length
                }{" "}
                Suspended
              </span>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200 max-h-[500px] overflow-y-auto">
          {paginatedRecipients.length > 0 ? (
            paginatedRecipients.map((recipient: any) => (
              <div
                key={recipient.id}
                className="px-6 py-4 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {recipient.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {recipient.email}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {recipient.status === "ACTIVE" ? (
                          <UserCheck className="h-4 w-4 text-green-600" />
                        ) : (
                          <UserX className="h-4 w-4 text-red-600" />
                        )}
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            recipient.status === "ACTIVE"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {recipient.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditRecipient(recipient)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      title="Edit recipient"
                    >
                      <Edit className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteRecipient(recipient)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                      title="Delete recipient"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                No recipients found
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search criteria."
                  : "Get started by adding your first recipient."}
              </p>
              <button
                onClick={() => setShowAddRecipientModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Recipient
              </button>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && itemsPerPage !== 0 && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, filteredRecipients.length)} of{" "}
                {filteredRecipients.length} recipients
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  First
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-3 py-1 text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Last
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Recipient Modal */}
      {showAddRecipientModal && (
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
                  placeholder="Enter recipient name..."
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
                  placeholder="Enter email address..."
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
                onClick={() => setShowAddRecipientModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRecipient}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Add Recipient
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Recipient Modal */}
      {showEditRecipientModal && editingRecipient && (
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
                  value={newRecipient.name}
                  onChange={(e) =>
                    setNewRecipient({ ...newRecipient, name: e.target.value })
                  }
                  placeholder="Enter recipient name..."
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
                  placeholder="Enter email address..."
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
                onClick={() => {
                  setShowEditRecipientModal(false);
                  setEditingRecipient(null);
                  setNewRecipient({
                    email: "",
                    name: "",
                    status: "ACTIVE",
                  });
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
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Delete Recipient
            </h3>
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Trash2 className="h-5 w-5 text-red-600" />
                  <h4 className="text-sm font-medium text-red-800">
                    Confirm Deletion
                  </h4>
                </div>
                <p className="text-sm text-red-700">
                  Are you sure you want to delete{" "}
                  <strong>{deletingRecipient.name}</strong> (
                  {deletingRecipient.email})?
                </p>
                <p className="text-sm text-red-600 mt-2">
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCsvImport}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Import Recipients
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recipients;
