import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  sendBulkEmail,
  setEmailSubject,
  setEmailContent,
  setSelectedTemplate,
  toggleRecipientSelection,
  selectAllRecipients,
  clearAllRecipients,
  resetEmailForm,
} from "../../store/slices/bulkEmailSlice";
import {
  Send,
  RefreshCw,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Users,
  Search,
} from "lucide-react";
import { useToast } from "../../contexts/ToastContext";
import Loader from "../Loader";

const ComposeEmail: React.FC = () => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const {
    templates,
    templatesLoading,
    groups,
    groupsLoading,
    selectedRecipients,
    emailSubject,
    emailContent,
    selectedTemplate,
    isSending,
    sendError,
    lastSendResult,
  } = useAppSelector((state: any) => state.bulkEmail);

  const [showPreview, setShowPreview] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const displayTemplates = templates || [];
  const displayGroups = groups || [];

  const handleSendEmail = async () => {
    if (
      !emailSubject.trim() ||
      !emailContent.trim() ||
      selectedRecipients.length === 0
    ) {
      showToast(
        "Please fill in all fields and select at least one group",
        "warning"
      );
      return;
    }

    // Get all recipients from selected groups
    const recipientEmails: string[] = [];
    displayGroups
      .filter((group: any) => selectedRecipients.includes(group.id))
      .forEach((group: any) => {
        if (group.recipients && Array.isArray(group.recipients)) {
          group.recipients.forEach((recipient: any) => {
            if (recipient.email && !recipientEmails.includes(recipient.email)) {
              recipientEmails.push(recipient.email);
            }
          });
        }
      });

    try {
      await dispatch(
        sendBulkEmail({
          recipients: recipientEmails,
          subject: emailSubject,
          message: emailContent,
          templateId: selectedTemplate || undefined,
        })
      );
      showToast(
        `Email sent successfully to ${recipientEmails.length} recipients across ${selectedRecipients.length} groups!`,
        "success"
      );
    } catch (error) {
      console.error("Error sending bulk email:", error);
      showToast(
        `Demo: Email would be sent to ${recipientEmails.length} recipients across ${selectedRecipients.length} groups`,
        "info"
      );
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    dispatch(setSelectedTemplate(templateId || null));
  };

  const handleSelectAll = () => {
    if (selectedRecipients.length === displayGroups.length) {
      dispatch(clearAllRecipients());
    } else {
      dispatch(selectAllRecipients());
    }
  };

  const getSelectedCount = () => {
    return selectedRecipients.length;
  };

  if (templatesLoading || groupsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success/Error Messages */}
      {lastSendResult && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <p className="text-green-800 font-medium">
              Email sent successfully to {lastSendResult.successCount}{" "}
              recipients
            </p>
          </div>
        </div>
      )}

      {sendError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-600" />
            <p className="text-red-800 font-medium">{sendError}</p>
          </div>
        </div>
      )}

      {/* Template Selection */}
      <div className="bg-gray-50 rounded-lg p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Template (Optional)
        </label>
        <div className="flex items-center gap-3">
          <select
            value={selectedTemplate || ""}
            onChange={(e) => handleTemplateSelect(e.target.value || "")}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a template...</option>
            {displayTemplates.map((template: any) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Email Subject */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subject Line
        </label>
        <input
          type="text"
          value={emailSubject}
          onChange={(e) => dispatch(setEmailSubject(e.target.value))}
          placeholder="Enter email subject..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Email Content */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Email Content
          </label>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
          >
            {showPreview ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            {showPreview ? "Hide Preview" : "Show Preview"}
          </button>
        </div>
        {showPreview ? (
          <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 min-h-[200px]">
            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold mb-2">{emailSubject}</h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: emailContent.replace(/\n/g, "<br>"),
                }}
              />
            </div>
          </div>
        ) : (
          <textarea
            value={emailContent}
            onChange={(e) => dispatch(setEmailContent(e.target.value))}
            placeholder="Enter email content..."
            rows={10}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        )}
      </div>

      {/* Group Selection */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Select Groups</h3>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              {getSelectedCount()} of {displayGroups.length} groups selected
            </span>
            <button
              onClick={handleSelectAll}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              {selectedRecipients.length === displayGroups.length
                ? "Deselect All"
                : "Select All"}
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-3 mb-4">
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
        <div className="max-h-64 overflow-y-auto space-y-2">
          {displayGroups && displayGroups.length > 0 ? (
            displayGroups
              .filter((group: any) => {
                const matchesSearch =
                  group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (group.description &&
                    group.description
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()));
                return matchesSearch;
              })
              .map((group: any) => (
                <div
                  key={group.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                    selectedRecipients.includes(group.id)
                      ? "bg-blue-50 border-blue-200"
                      : "bg-white border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedRecipients.includes(group.id)}
                    onChange={() =>
                      dispatch(toggleRecipientSelection(group.id))
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {group.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {group.description || "No description"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {group.recipients ? group.recipients.length : 0}{" "}
                      recipients
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                      Group
                    </span>
                  </div>
                </div>
              ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p>No groups found. Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Send Button */}
      <div className="flex items-center justify-end gap-3">
        <button
          onClick={() => dispatch(resetEmailForm())}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Clear Form
        </button>
        <button
          onClick={handleSendEmail}
          disabled={isSending || selectedRecipients.length === 0}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSending ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {isSending
            ? "Sending..."
            : `Send to ${selectedRecipients.length} groups`}
        </button>
      </div>
    </div>
  );
};

export default ComposeEmail;
