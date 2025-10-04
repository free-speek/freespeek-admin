import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchRecipients } from "../../store/slices/bulkEmailSlice";
import {
  Users,
  Edit,
  Trash2,
  Search,
  UserPlus,
  UserMinus,
  FolderPlus,
  Users as GroupIcon,
} from "lucide-react";
import { useToast } from "../../contexts/ToastContext";
import Loader from "../Loader";

interface RecipientGroup {
  id: string;
  name: string;
  description?: string;
  recipientIds: string[];
  createdAt: string;
  updatedAt: string;
}

const RecipientGroups: React.FC = () => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const { recipients, recipientsLoading } = useAppSelector(
    (state: any) => state.bulkEmail
  );

  const [groups, setGroups] = useState<RecipientGroup[]>([
    {
      id: "1",
      name: "VIP Customers",
      description: "High-value customers who need special attention",
      recipientIds: ["1", "2", "3"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Newsletter Subscribers",
      description: "Users who subscribed to our newsletter",
      recipientIds: ["4", "5", "6", "7"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showEditGroupModal, setShowEditGroupModal] = useState(false);
  const [showManageRecipientsModal, setShowManageRecipientsModal] =
    useState(false);
  const [selectedGroup, setSelectedGroup] = useState<RecipientGroup | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    dispatch(fetchRecipients({ page: 1, limit: 100 })).catch(() => {
      console.log("Recipients API not available, using mock data");
    });
  }, [dispatch]);

  const displayRecipients = recipients || [];

  const filteredGroups = groups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (group.description &&
        group.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreateGroup = () => {
    if (!newGroup.name.trim()) {
      showToast("Please enter a group name", "warning");
      return;
    }

    const group: RecipientGroup = {
      id: Date.now().toString(),
      name: newGroup.name,
      description: newGroup.description,
      recipientIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setGroups([...groups, group]);
    setNewGroup({ name: "", description: "" });
    setShowCreateGroupModal(false);
    showToast(`Group "${group.name}" created successfully!`, "success");
  };

  const handleEditGroup = (group: RecipientGroup) => {
    setSelectedGroup(group);
    setNewGroup({
      name: group.name,
      description: group.description || "",
    });
    setShowEditGroupModal(true);
  };

  const handleUpdateGroup = () => {
    if (!selectedGroup || !newGroup.name.trim()) {
      showToast("Please enter a group name", "warning");
      return;
    }

    const updatedGroups = groups.map((group) =>
      group.id === selectedGroup.id
        ? {
            ...group,
            name: newGroup.name,
            description: newGroup.description,
            updatedAt: new Date().toISOString(),
          }
        : group
    );

    setGroups(updatedGroups);
    setNewGroup({ name: "", description: "" });
    setSelectedGroup(null);
    setShowEditGroupModal(false);
    showToast("Group updated successfully!", "success");
  };

  const handleDeleteGroup = (group: RecipientGroup) => {
    if (
      window.confirm(
        `Are you sure you want to delete the group "${group.name}"?`
      )
    ) {
      const updatedGroups = groups.filter((g) => g.id !== group.id);
      setGroups(updatedGroups);
      showToast(`Group "${group.name}" deleted successfully!`, "success");
    }
  };

  const handleManageRecipients = (group: RecipientGroup) => {
    setSelectedGroup(group);
    setShowManageRecipientsModal(true);
  };

  const handleAddRecipientToGroup = (recipientId: string) => {
    if (!selectedGroup) return;

    const updatedGroups = groups.map((group) =>
      group.id === selectedGroup.id
        ? {
            ...group,
            recipientIds: [...group.recipientIds, recipientId],
            updatedAt: new Date().toISOString(),
          }
        : group
    );

    setGroups(updatedGroups);
    setSelectedGroup(
      updatedGroups.find((g) => g.id === selectedGroup.id) || null
    );
    showToast("Recipient added to group!", "success");
  };

  const handleRemoveRecipientFromGroup = (recipientId: string) => {
    if (!selectedGroup) return;

    const updatedGroups = groups.map((group) =>
      group.id === selectedGroup.id
        ? {
            ...group,
            recipientIds: group.recipientIds.filter((id) => id !== recipientId),
            updatedAt: new Date().toISOString(),
          }
        : group
    );

    setGroups(updatedGroups);
    setSelectedGroup(
      updatedGroups.find((g) => g.id === selectedGroup.id) || null
    );
    showToast("Recipient removed from group!", "success");
  };

  const getRecipientById = (id: string) => {
    return displayRecipients.find((r: any) => r.id === id);
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
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Recipient Groups
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Create and manage groups of recipients for targeted email campaigns
          </p>
        </div>
        <button
          onClick={() => setShowCreateGroupModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FolderPlus className="h-4 w-4" />
          Create Group
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search groups..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Groups List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.map((group) => {
          const groupRecipients = group.recipientIds
            .map(getRecipientById)
            .filter(Boolean);

          return (
            <div
              key={group.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="text-lg font-medium text-gray-900 mb-1">
                    {group.name}
                  </h4>
                  {group.description && (
                    <p className="text-sm text-gray-600 mb-3">
                      {group.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <GroupIcon className="h-4 w-4" />
                    <span>{groupRecipients.length} recipients</span>
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

              {/* Group Recipients Preview */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Recipients
                  </span>
                  <button
                    onClick={() => handleManageRecipients(group)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Manage
                  </button>
                </div>
                <div className="space-y-1 max-h-24 overflow-y-auto">
                  {groupRecipients.slice(0, 3).map((recipient: any) => (
                    <div
                      key={recipient.id}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <Users className="h-3 w-3" />
                      <span className="truncate">{recipient.name}</span>
                    </div>
                  ))}
                  {groupRecipients.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{groupRecipients.length - 3} more
                    </div>
                  )}
                  {groupRecipients.length === 0 && (
                    <div className="text-xs text-gray-500">
                      No recipients in this group
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Updated {new Date(group.updatedAt).toLocaleDateString()}
                </span>
                <button
                  onClick={() => handleManageRecipients(group)}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                >
                  <UserPlus className="h-3 w-3" />
                  Manage
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredGroups.length === 0 && (
        <div className="text-center py-12">
          <GroupIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No groups found
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {searchTerm
              ? "Try adjusting your search criteria."
              : "Create your first recipient group to get started."}
          </p>
          <button
            onClick={() => setShowCreateGroupModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FolderPlus className="h-4 w-4" />
            Create Group
          </button>
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Create New Group
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Group Name
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
                  Description (Optional)
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
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCreateGroupModal(false)}
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
      {showEditGroupModal && selectedGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Edit Group
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Group Name
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
                  Description (Optional)
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
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setShowEditGroupModal(false)}
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

      {/* Manage Recipients Modal */}
      {showManageRecipientsModal && selectedGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Manage Recipients - {selectedGroup.name}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Available Recipients */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">
                  Available Recipients
                </h4>
                <div className="border border-gray-200 rounded-lg max-h-64 overflow-y-auto">
                  {displayRecipients
                    .filter(
                      (recipient: any) =>
                        !selectedGroup.recipientIds.includes(recipient.id)
                    )
                    .map((recipient: any) => (
                      <div
                        key={recipient.id}
                        className="flex items-center justify-between p-3 border-b border-gray-100 hover:bg-gray-50"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {recipient.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {recipient.email}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            handleAddRecipientToGroup(recipient.id)
                          }
                          className="flex items-center gap-1 px-2 py-1 text-xs bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors"
                        >
                          <UserPlus className="h-3 w-3" />
                          Add
                        </button>
                      </div>
                    ))}
                </div>
              </div>

              {/* Group Recipients */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">
                  Group Recipients ({selectedGroup.recipientIds.length})
                </h4>
                <div className="border border-gray-200 rounded-lg max-h-64 overflow-y-auto">
                  {selectedGroup.recipientIds.map((recipientId) => {
                    const recipient = getRecipientById(recipientId);
                    if (!recipient) return null;

                    return (
                      <div
                        key={recipientId}
                        className="flex items-center justify-between p-3 border-b border-gray-100 hover:bg-gray-50"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {recipient.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {recipient.email}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            handleRemoveRecipientFromGroup(recipientId)
                          }
                          className="flex items-center gap-1 px-2 py-1 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                        >
                          <UserMinus className="h-3 w-3" />
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setShowManageRecipientsModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipientGroups;
