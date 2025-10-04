import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Users, Plus, Edit, Trash2, Search, Calendar } from "lucide-react";
import { useToast } from "../../contexts/ToastContext";
import apiService from "../../services/api";
import {
  fetchGroups,
  createGroup,
  updateGroup,
  deleteGroup,
} from "../../store/slices/bulkEmailSlice";
import { useAppDispatch } from "../../store/hooks";

const Groups: React.FC = () => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const { groups, groupsLoading, groupsError } = useSelector(
    (state: any) => state.bulkEmail
  );

  console.log("Groups component render - Redux state:", {
    groups,
    groupsLoading,
    groupsError,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showEditGroupModal, setShowEditGroupModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState<any>(null);
  const [deletingGroup, setDeletingGroup] = useState<any>(null);
  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
    recipients: [] as any[],
  });
  const [selectedRecipients, setSelectedRecipients] = useState<any[]>([]);
  const [showRecipientsModal, setShowRecipientsModal] = useState(false);
  const [availableRecipients, setAvailableRecipients] = useState<any[]>([]);
  const [recipientsLoading, setRecipientsLoading] = useState(false);
  const [selectedRecipientIds, setSelectedRecipientIds] = useState<string[]>(
    []
  );
  const [recipientsSearchTerm, setRecipientsSearchTerm] = useState("");
  const [recipientsCurrentPage, setRecipientsCurrentPage] = useState(1);
  const [recipientsItemsPerPage, setRecipientsItemsPerPage] = useState(50);
  const [recipientsTotalCount, setRecipientsTotalCount] = useState(0);
  const [allRecipients, setAllRecipients] = useState<any[]>([]);
  const [selectedAllFromDB, setSelectedAllFromDB] = useState(false);
  const [hasLoadedAllRecipients, setHasLoadedAllRecipients] = useState(false);
  const [loadingMoreRecipients, setLoadingMoreRecipients] = useState(false);

  // Fetch groups and recipients on component mount
  useEffect(() => {
    console.log("Groups component mounted, fetching groups and recipients...");
    dispatch(fetchGroups());
    dispatch({ type: "bulkEmail/fetchRecipients" });
  }, [dispatch]);

  // Filter groups based on search term
  const filteredGroups = Array.isArray(groups)
    ? groups.filter(
        (group: any) =>
          group.name &&
          group.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Filter recipients based on search term
  const filteredAvailableRecipients = Array.isArray(availableRecipients)
    ? availableRecipients.filter(
        (recipient: any) =>
          recipient.name
            ?.toLowerCase()
            .includes(recipientsSearchTerm.toLowerCase()) ||
          recipient.email
            ?.toLowerCase()
            .includes(recipientsSearchTerm.toLowerCase())
      )
    : [];

  const handleCreateGroup = async () => {
    if (!newGroup.name.trim()) {
      showToast("Please enter a group name", "warning");
      return;
    }

    console.log("Creating group with data:", {
      name: newGroup.name,
      description: newGroup.description,
      recipients: newGroup.recipients,
    });

    try {
      console.log("Dispatching createGroup action...");
      const createResult = await dispatch(
        createGroup({
          name: newGroup.name,
          description: newGroup.description,
          recipients: newGroup.recipients,
        })
      );

      console.log("Create group result:", createResult);

      // Fetch updated groups list
      console.log("Fetching updated groups list...");
      const fetchResult = await dispatch(fetchGroups());
      console.log("Fetch groups result:", fetchResult);

      // Reset form
      setNewGroup({
        name: "",
        description: "",
        recipients: [],
      });
      setSelectedRecipients([]);
      setShowCreateGroupModal(false);
      showToast("Group created successfully!", "success");
    } catch (error: any) {
      console.error("Error creating group:", error);
      showToast(error.message || "Failed to create group", "error");
    }
  };

  const handleEditGroup = (group: any) => {
    setEditingGroup(group);
    setNewGroup({
      name: group.name,
      description: group.description || "",
      recipients: group.recipients || [],
    });
    setSelectedRecipients(group.recipients || []);
    setShowEditGroupModal(true);
  };

  const handleUpdateGroup = async () => {
    if (!newGroup.name.trim()) {
      showToast("Please enter a group name", "warning");
      return;
    }

    if (!editingGroup) return;

    try {
      await dispatch(
        updateGroup({
          id: editingGroup.id,
          name: newGroup.name,
          description: newGroup.description,
          recipients: newGroup.recipients,
        })
      );

      // Fetch updated groups list
      await dispatch(fetchGroups());

      // Reset form and close modal
      setNewGroup({
        name: "",
        description: "",
        recipients: [],
      });
      setSelectedRecipients([]);
      setEditingGroup(null);
      setShowEditGroupModal(false);
      showToast("Group updated successfully!", "success");
    } catch (error: any) {
      console.error("Error updating group:", error);
      showToast(error.message || "Failed to update group", "error");
    }
  };

  const handleDeleteGroup = (group: any) => {
    setDeletingGroup(group);
    setShowDeleteModal(true);
  };

  const confirmDeleteGroup = async () => {
    if (!deletingGroup) return;

    try {
      await dispatch(deleteGroup(deletingGroup.id));

      // Fetch updated groups list
      await dispatch(fetchGroups());

      setDeletingGroup(null);
      setShowDeleteModal(false);
      showToast("Group deleted successfully!", "success");
    } catch (error: any) {
      console.error("Error deleting group:", error);
      showToast(error.message || "Failed to delete group", "error");
    }
  };

  const handleRemoveRecipientFromGroup = (recipientId: string) => {
    setNewGroup({
      ...newGroup,
      recipients: newGroup.recipients.filter((r: any) => r.id !== recipientId),
    });
    setSelectedRecipients(
      selectedRecipients.filter((r: any) => r.id !== recipientId)
    );
  };

  const handleSelectRecipients = async () => {
    setRecipientsLoading(true);
    try {
      console.log("Fetching recipients efficiently...");

      // First get total count quickly
      let totalCount = 0;
      let allRecipientsData: any[] = [];

      try {
        console.log("Getting total count...");
        // Fetch just the count first (much faster)
        const countResponse = await apiService.getRecipientsFromBackend(
          1,
          1,
          "",
          "all"
        );
        totalCount =
          (countResponse as any)?.data?.totalCount ||
          (countResponse as any)?.totalCount ||
          0;

        console.log("Total count:", totalCount);

        // If we have a reasonable number of recipients, fetch them all
        if (totalCount > 0 && totalCount <= 5000) {
          console.log("Fetching all recipients (reasonable count)...");
          const bulkResponse = await apiService.getRecipientsFromBackend(
            1,
            0,
            "",
            "all"
          );
          allRecipientsData =
            (bulkResponse as any)?.data?.recipients ||
            (bulkResponse as any)?.recipients ||
            (bulkResponse as any) ||
            [];
          setHasLoadedAllRecipients(true);
        } else if (totalCount > 5000) {
          console.log(
            "Large dataset detected, fetching first 5000 recipients..."
          );
          // For large datasets, fetch in chunks
          const bulkResponse = await apiService.getRecipientsFromBackend(
            1,
            5000,
            "",
            "all"
          );
          allRecipientsData =
            (bulkResponse as any)?.data?.recipients ||
            (bulkResponse as any)?.recipients ||
            (bulkResponse as any) ||
            [];
          setHasLoadedAllRecipients(false); // We haven't loaded all yet
        }
      } catch (bulkError) {
        console.log(
          "Bulk recipients failed, trying regular users...",
          bulkError
        );

        try {
          const usersResponse = await apiService.getUsers(1, 1, "", "all");
          totalCount =
            (usersResponse as any)?.data?.totalCount ||
            (usersResponse as any)?.totalCount ||
            0;

          if (totalCount > 0 && totalCount <= 5000) {
            const allUsersResponse = await apiService.getUsers(1, 0, "", "all");
            allRecipientsData =
              (allUsersResponse as any)?.data?.users ||
              (allUsersResponse as any)?.users ||
              (allUsersResponse as any) ||
              [];
            setHasLoadedAllRecipients(true);
          } else if (totalCount > 5000) {
            const chunkUsersResponse = await apiService.getUsers(
              1,
              5000,
              "",
              "all"
            );
            allRecipientsData =
              (chunkUsersResponse as any)?.data?.users ||
              (chunkUsersResponse as any)?.users ||
              (chunkUsersResponse as any) ||
              [];
            setHasLoadedAllRecipients(false); // We haven't loaded all yet
          }
        } catch (usersError) {
          console.log(
            "Users fetch also failed, using mock data...",
            usersError
          );

          // Fallback to mock data for testing
          allRecipientsData = [
            {
              id: "1",
              name: "John Doe",
              email: "john@example.com",
              status: "ACTIVE",
            },
            {
              id: "2",
              name: "Jane Smith",
              email: "jane@example.com",
              status: "ACTIVE",
            },
            {
              id: "3",
              name: "Bob Johnson",
              email: "bob@example.com",
              status: "ACTIVE",
            },
            {
              id: "4",
              name: "Alice Brown",
              email: "alice@example.com",
              status: "SUSPENDED",
            },
            {
              id: "5",
              name: "Charlie Wilson",
              email: "charlie@example.com",
              status: "ACTIVE",
            },
          ];
          totalCount = allRecipientsData.length;
        }
      }

      console.log(
        "Recipients loaded:",
        allRecipientsData.length,
        "Total count:",
        totalCount
      );

      // Store recipients and set pagination
      setAllRecipients(allRecipientsData);
      setRecipientsTotalCount(totalCount);
      setRecipientsCurrentPage(1);
      setSelectedRecipientIds([]);
      setSelectedAllFromDB(false);

      // Calculate paginated recipients for display
      const startIndex = (1 - 1) * recipientsItemsPerPage;
      const endIndex = startIndex + recipientsItemsPerPage;
      const paginatedRecipients = allRecipientsData.slice(startIndex, endIndex);

      setAvailableRecipients(paginatedRecipients);
      setShowRecipientsModal(true);

      if (totalCount > 5000) {
        showToast(
          `Loaded ${allRecipientsData.length} recipients (showing first 5000 of ${totalCount} total)`,
          "info"
        );
      } else {
        showToast(
          `Loaded ${totalCount} total recipients (showing ${paginatedRecipients.length} per page)`,
          "success"
        );
      }
    } catch (error) {
      console.error("Error fetching recipients:", error);
      showToast("Failed to fetch recipients", "error");
      setAllRecipients([]);
      setAvailableRecipients([]);
    } finally {
      setRecipientsLoading(false);
    }
  };

  const handleRecipientSelection = (recipient: any, isSelected: boolean) => {
    if (isSelected) {
      setSelectedRecipientIds([...selectedRecipientIds, recipient.id]);
    } else {
      setSelectedRecipientIds(
        selectedRecipientIds.filter((id) => id !== recipient.id)
      );
    }
  };

  // Handle pagination changes
  const handleRecipientsPageChange = (newPage: number) => {
    setRecipientsCurrentPage(newPage);

    // Calculate paginated recipients for the new page
    const startIndex = (newPage - 1) * recipientsItemsPerPage;
    const endIndex = startIndex + recipientsItemsPerPage;
    const paginatedRecipients = allRecipients.slice(startIndex, endIndex);

    setAvailableRecipients(paginatedRecipients);
  };

  // Handle items per page change
  const handleRecipientsItemsPerPageChange = (newItemsPerPage: number) => {
    setRecipientsItemsPerPage(newItemsPerPage);
    setRecipientsCurrentPage(1);

    // Calculate paginated recipients for the new page size
    const startIndex = 0;
    const endIndex = newItemsPerPage;
    const paginatedRecipients = allRecipients.slice(startIndex, endIndex);

    setAvailableRecipients(paginatedRecipients);
  };

  // Select all recipients from entire database (active only)
  const handleSelectAllFromDB = async () => {
    if (
      !hasLoadedAllRecipients &&
      recipientsTotalCount > allRecipients.length
    ) {
      // If we haven't loaded all recipients, load them first
      showToast("Loading all recipients to select all active ones...", "info");
      await handleLoadAllRecipients();
    }

    const activeRecipients = allRecipients.filter(
      (recipient) => recipient.status === "ACTIVE"
    );
    const allActiveIds = activeRecipients.map((recipient) => recipient.id);

    setSelectedRecipientIds(allActiveIds);
    setSelectedAllFromDB(true);
    showToast(
      `Selected all ${allActiveIds.length} active recipients from database`,
      "success"
    );
  };

  // Select all visible recipients on current page
  const handleSelectAllVisible = () => {
    const visibleIds = availableRecipients.map((recipient) => recipient.id);

    // Add visible recipients to existing selection
    const combinedIds = [...selectedRecipientIds, ...visibleIds];
    const uniqueIds = combinedIds.filter(
      (id, index) => combinedIds.indexOf(id) === index
    );
    setSelectedRecipientIds(uniqueIds);
    setSelectedAllFromDB(false);
    showToast(`Selected ${visibleIds.length} visible recipients`, "success");
  };

  // Clear all selections
  const handleClearAllSelections = () => {
    setSelectedRecipientIds([]);
    setSelectedAllFromDB(false);
    showToast("Cleared all selections", "info");
  };

  // Load all remaining recipients
  const handleLoadAllRecipients = async () => {
    if (hasLoadedAllRecipients || loadingMoreRecipients) return;

    setLoadingMoreRecipients(true);
    try {
      console.log("Loading all remaining recipients...");

      // Fetch all recipients from the database
      const bulkResponse = await apiService.getRecipientsFromBackend(
        1,
        0,
        "",
        "all"
      );
      const allRecipientsData =
        (bulkResponse as any)?.data?.recipients ||
        (bulkResponse as any)?.recipients ||
        (bulkResponse as any) ||
        [];

      setAllRecipients(allRecipientsData);
      setHasLoadedAllRecipients(true);

      // Update the current page to show new data
      const startIndex = (recipientsCurrentPage - 1) * recipientsItemsPerPage;
      const endIndex = startIndex + recipientsItemsPerPage;
      const paginatedRecipients = allRecipientsData.slice(startIndex, endIndex);
      setAvailableRecipients(paginatedRecipients);

      showToast(
        `Loaded all ${allRecipientsData.length} recipients successfully!`,
        "success"
      );
    } catch (error) {
      console.error("Error loading all recipients:", error);
      showToast("Failed to load all recipients", "error");
    } finally {
      setLoadingMoreRecipients(false);
    }
  };

  const handleAddSelectedRecipients = () => {
    let recipientsToAdd: any[] = [];

    if (selectedAllFromDB) {
      // If all recipients from database are selected, add all active recipients
      recipientsToAdd = allRecipients.filter(
        (recipient) => recipient.status === "ACTIVE"
      );
    } else {
      // Add only the specifically selected recipients
      recipientsToAdd = Array.isArray(allRecipients)
        ? allRecipients.filter((recipient) =>
            selectedRecipientIds.includes(recipient.id)
          )
        : [];
    }

    // Filter out recipients that are already in the group
    const newRecipients = recipientsToAdd.filter(
      (newRecipient) =>
        !newGroup.recipients.some(
          (existingRecipient) => existingRecipient.id === newRecipient.id
        )
    );

    setNewGroup({
      ...newGroup,
      recipients: [...newGroup.recipients, ...newRecipients],
    });
    setSelectedRecipients([...selectedRecipients, ...newRecipients]);
    setSelectedRecipientIds([]);
    setShowRecipientsModal(false);
    setSelectedAllFromDB(false);

    if (selectedAllFromDB) {
      showToast(
        `Added all ${newRecipients.length} active recipients to group`,
        "success"
      );
    } else {
      showToast(`Added ${newRecipients.length} recipients to group`, "success");
    }
  };

  if (groupsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (groupsError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-600 mb-2">Error loading groups</div>
          <div className="text-sm text-gray-500">{groupsError}</div>
          <button
            onClick={() => dispatch(fetchGroups())}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create Group Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowCreateGroupModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create Group
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Groups List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900">
              Groups ({filteredGroups.length})
            </h4>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span>
                {filteredGroups.reduce(
                  (total: number, group: any) =>
                    total + (group.recipients?.length || 0),
                  0
                )}{" "}
                Total Recipients
              </span>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200 max-h-[500px] overflow-y-auto">
          {filteredGroups.length > 0 ? (
            filteredGroups.map((group: any) => (
              <div
                key={group.id}
                className="px-6 py-4 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {group.name}
                        </h3>
                        {group.description && (
                          <p className="text-sm text-gray-500 truncate">
                            {group.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {group.recipients?.length || 0} recipients
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              Created{" "}
                              {new Date(group.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditGroup(group)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      title="Edit group"
                    >
                      <Edit className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteGroup(group)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                      title="Delete group"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No groups found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm
                  ? "Try adjusting your search terms."
                  : "Get started by creating your first group."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create Group Modal */}
      {showCreateGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Create New Group
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Group Name *
                </label>
                <input
                  type="text"
                  value={newGroup.name}
                  onChange={(e) =>
                    setNewGroup({ ...newGroup, name: e.target.value })
                  }
                  placeholder="Enter group name..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newGroup.description}
                  onChange={(e) =>
                    setNewGroup({ ...newGroup, description: e.target.value })
                  }
                  placeholder="Enter group description..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipients ({selectedRecipients.length})
                </label>
                <div className="border border-gray-300 rounded-lg p-3 min-h-[100px]">
                  {selectedRecipients.length > 0 ? (
                    <div className="space-y-2">
                      {selectedRecipients.map((recipient) => (
                        <div
                          key={recipient.id}
                          className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded"
                        >
                          <div>
                            <span className="text-sm font-medium text-gray-900">
                              {recipient.name}
                            </span>
                            <span className="text-sm text-gray-500 ml-2">
                              {recipient.email}
                            </span>
                          </div>
                          <button
                            onClick={() =>
                              handleRemoveRecipientFromGroup(recipient.id)
                            }
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-4">
                      <Users className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No recipients selected</p>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleSelectRecipients}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Recipients
                </button>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateGroupModal(false);
                  setNewGroup({
                    name: "",
                    description: "",
                    recipients: [],
                  });
                  setSelectedRecipients([]);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateGroup}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Group Modal */}
      {showEditGroupModal && editingGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Edit Group
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Group Name *
                </label>
                <input
                  type="text"
                  value={newGroup.name}
                  onChange={(e) =>
                    setNewGroup({ ...newGroup, name: e.target.value })
                  }
                  placeholder="Enter group name..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newGroup.description}
                  onChange={(e) =>
                    setNewGroup({ ...newGroup, description: e.target.value })
                  }
                  placeholder="Enter group description..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipients ({selectedRecipients.length})
                </label>
                <div className="border border-gray-300 rounded-lg p-3 min-h-[100px]">
                  {selectedRecipients.length > 0 ? (
                    <div className="space-y-2">
                      {selectedRecipients.map((recipient) => (
                        <div
                          key={recipient.id}
                          className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded"
                        >
                          <div>
                            <span className="text-sm font-medium text-gray-900">
                              {recipient.name}
                            </span>
                            <span className="text-sm text-gray-500 ml-2">
                              {recipient.email}
                            </span>
                          </div>
                          <button
                            onClick={() =>
                              handleRemoveRecipientFromGroup(recipient.id)
                            }
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-4">
                      <Users className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No recipients selected</p>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleSelectRecipients}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Recipients
                </button>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEditGroupModal(false);
                  setEditingGroup(null);
                  setNewGroup({
                    name: "",
                    description: "",
                    recipients: [],
                  });
                  setSelectedRecipients([]);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateGroup}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update Group
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Delete Group
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
                  Are you sure you want to delete the group{" "}
                  <strong>{deletingGroup.name}</strong>?
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
                  setDeletingGroup(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteGroup}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Group
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recipients Selection Modal */}
      {showRecipientsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-6xl mx-4 max-h-[90vh] flex flex-col">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Select Recipients ({recipientsTotalCount} total)
              {!hasLoadedAllRecipients &&
                recipientsTotalCount > allRecipients.length && (
                  <span className="text-sm text-orange-600 ml-2">
                    (Loaded: {allRecipients.length})
                  </span>
                )}
            </h3>

            {/* Search and Controls Row */}
            <div className="flex items-center gap-4 mb-4">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search recipients by name or email..."
                  value={recipientsSearchTerm}
                  onChange={(e) => setRecipientsSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Items Per Page Selector */}
              <div className="flex items-center gap-2 min-w-[120px]">
                <label className="text-sm text-gray-700 whitespace-nowrap">
                  Show:
                </label>
                <select
                  value={recipientsItemsPerPage}
                  onChange={(e) =>
                    handleRecipientsItemsPerPageChange(parseInt(e.target.value))
                  }
                  className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[80px]"
                >
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={200}>200</option>
                  <option value={500}>500</option>
                  <option value={1000}>1000</option>
                  <option value={0}>All</option>
                </select>
              </div>
            </div>

            {/* Selection Buttons */}
            <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
              <button
                onClick={handleSelectAllFromDB}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                Select All Active (
                {hasLoadedAllRecipients
                  ? allRecipients.filter((r) => r.status === "ACTIVE").length
                  : `${
                      allRecipients.filter((r) => r.status === "ACTIVE").length
                    }+`}
                )
              </button>
              <button
                onClick={handleSelectAllVisible}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Select Visible ({availableRecipients.length})
              </button>
              <button
                onClick={handleClearAllSelections}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                Clear All
              </button>
              {!hasLoadedAllRecipients &&
                recipientsTotalCount > allRecipients.length && (
                  <button
                    onClick={handleLoadAllRecipients}
                    disabled={loadingMoreRecipients}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingMoreRecipients ? (
                      <>
                        <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Loading...
                      </>
                    ) : (
                      `Load All (${
                        recipientsTotalCount - allRecipients.length
                      } more)`
                    )}
                  </button>
                )}
              {selectedAllFromDB && (
                <span className="text-sm text-green-600 font-medium">
                  All active recipients selected
                </span>
              )}
            </div>

            {recipientsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">
                  Loading recipients...
                </span>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto border border-gray-200 rounded-lg mb-4">
                  <div className="divide-y divide-gray-200">
                    {filteredAvailableRecipients.length > 0 ? (
                      filteredAvailableRecipients.map((recipient) => {
                        const isSelected = selectedRecipientIds.includes(
                          recipient.id
                        );
                        return (
                          <div
                            key={recipient.id}
                            className="p-4 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={(e) =>
                                    handleRecipientSelection(
                                      recipient,
                                      e.target.checked
                                    )
                                  }
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <div className="ml-3">
                                  <div className="flex items-center">
                                    <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                                      <Users className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div className="ml-3">
                                      <p className="text-sm font-medium text-gray-900">
                                        {recipient.name || "Unknown"}
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        {recipient.email}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    recipient.status === "ACTIVE"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {recipient.status || "ACTIVE"}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-12">
                        <Users className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                          No recipients found
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          No recipients are available to add to the group.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pagination Controls */}
                {recipientsItemsPerPage > 0 &&
                  recipientsTotalCount > recipientsItemsPerPage && (
                    <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600">
                        Showing{" "}
                        {(recipientsCurrentPage - 1) * recipientsItemsPerPage +
                          1}{" "}
                        to{" "}
                        {Math.min(
                          recipientsCurrentPage * recipientsItemsPerPage,
                          recipientsTotalCount
                        )}{" "}
                        of {recipientsTotalCount} recipients
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleRecipientsPageChange(
                              recipientsCurrentPage - 1
                            )
                          }
                          disabled={recipientsCurrentPage === 1}
                          className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>

                        {/* Page Numbers */}
                        <div className="flex items-center gap-1">
                          {Array.from(
                            {
                              length: Math.min(
                                5,
                                Math.ceil(
                                  recipientsTotalCount / recipientsItemsPerPage
                                )
                              ),
                            },
                            (_, i) => {
                              const pageNum =
                                Math.max(1, recipientsCurrentPage - 2) + i;
                              const totalPages = Math.ceil(
                                recipientsTotalCount / recipientsItemsPerPage
                              );

                              if (pageNum > totalPages) return null;

                              return (
                                <button
                                  key={pageNum}
                                  onClick={() =>
                                    handleRecipientsPageChange(pageNum)
                                  }
                                  className={`px-3 py-1 text-sm border rounded-lg ${
                                    pageNum === recipientsCurrentPage
                                      ? "bg-blue-600 text-white border-blue-600"
                                      : "border-gray-300 hover:bg-gray-100"
                                  }`}
                                >
                                  {pageNum}
                                </button>
                              );
                            }
                          )}
                        </div>

                        <button
                          onClick={() =>
                            handleRecipientsPageChange(
                              recipientsCurrentPage + 1
                            )
                          }
                          disabled={
                            recipientsCurrentPage >=
                            Math.ceil(
                              recipientsTotalCount / recipientsItemsPerPage
                            )
                          }
                          className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {selectedRecipientIds.length} recipients selected
                    {selectedAllFromDB && (
                      <span className="ml-2 text-green-600 font-medium">
                        (All active from database)
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setShowRecipientsModal(false);
                        setSelectedRecipientIds([]);
                        setRecipientsSearchTerm("");
                        setSelectedAllFromDB(false);
                      }}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddSelectedRecipients}
                      disabled={selectedRecipientIds.length === 0}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add Selected ({selectedRecipientIds.length})
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Groups;
