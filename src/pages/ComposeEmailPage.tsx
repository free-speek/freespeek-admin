import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchTemplates,
  fetchRecipients,
  sendBulkEmail,
  setEmailSubject,
  setEmailContent,
  setSelectedTemplate,
  toggleRecipientSelection,
  selectAllRecipients,
  clearAllRecipients,
  resetEmailForm,
} from "../store/slices/bulkEmailSlice";
import { usePageTitle } from "../hooks/usePageTitle";
import {
  Users,
  Send,
  RefreshCw,
  Search,
  UserCheck,
  UserX,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";
import Loader from "../components/Loader";
import { useToast } from "../contexts/ToastContext";
import { Link } from "react-router-dom";

const ComposeEmailPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const {
    templates,
    templatesLoading,
    recipients,
    recipientsLoading,
    selectedRecipients,
    emailSubject,
    emailContent,
    selectedTemplate,
    isSending,
    sendError,
  } = useAppSelector((state: any) => state.bulkEmail);

  const displayTemplates = templates || [];
  const displayRecipients = recipients || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showPreview, setShowPreview] = useState(false);

  usePageTitle("Compose Email");

  useEffect(() => {
    dispatch(fetchTemplates()).catch(() => {
      console.log("Templates API not available");
    });
    dispatch(
      fetchRecipients({
        page: 1,
        limit: 100,
        search: searchTerm,
        status: statusFilter,
      })
    ).catch(() => {
      console.log("Recipients API not available");
    });
  }, [dispatch, searchTerm, statusFilter]);

  const handleSendEmail = async () => {
    if (
      !emailSubject.trim() ||
      !emailContent.trim() ||
      selectedRecipients.length === 0
    ) {
      showToast(
        "Please fill in all fields and select at least one recipient",
        "warning"
      );
      return;
    }

    const recipientEmails = displayRecipients
      .filter((r: any) => selectedRecipients.includes(r.id))
      .map((r: any) => r.email);

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
        `Email sent successfully to ${recipientEmails.length} recipients!`,
        "success"
      );
    } catch (error) {
      console.error("Error sending bulk email:", error);
      showToast("Failed to send email. Please try again.", "error");
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    dispatch(setSelectedTemplate(templateId || ""));
  };

  const handleSelectAll = () => {
    if (selectedRecipients.length === displayRecipients.length) {
      dispatch(clearAllRecipients());
    } else {
      dispatch(selectAllRecipients());
    }
  };

  const getSelectedCount = () => {
    return selectedRecipients.length;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      fetchRecipients({
        page: 1,
        limit: 100,
        search: searchTerm,
        status: statusFilter,
      })
    );
  };

  if (templatesLoading || recipientsLoading) {
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
            Back to Dashboard
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Compose Email</h1>
            <p className="text-gray-600">
              Create and send bulk emails to your recipients
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => dispatch(resetEmailForm())}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Clear Form
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Email Composition */}
        <div className="lg:col-span-2 space-y-6">
          {/* Email Template Selection */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Email Template (Optional)
            </h3>
            <div className="flex gap-3">
              <select
                value={selectedTemplate}
                onChange={(e) => handleTemplateSelect(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a template...</option>
                {displayTemplates.map((template: any) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
              <Link
                to="/bulk-email/templates"
                className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                + New Template
              </Link>
            </div>
          </div>

          {/* Email Subject */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Subject Line
            </h3>
            <input
              type="text"
              value={emailSubject}
              onChange={(e) => dispatch(setEmailSubject(e.target.value))}
              placeholder="Enter email subject..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Email Content */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Email Content
              </h3>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
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
              <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 min-h-[200px] whitespace-pre-wrap">
                {emailContent || "Enter your email content..."}
              </div>
            ) : (
              <textarea
                value={emailContent}
                onChange={(e) => dispatch(setEmailContent(e.target.value))}
                placeholder="Enter email content..."
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            )}
          </div>
        </div>

        {/* Recipients Selection */}
        <div className="space-y-6">
          {/* Recipients Header */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Select Recipients
              </h3>
              <span className="text-sm text-gray-600">
                {getSelectedCount()} of {displayRecipients.length} selected
              </span>
            </div>

            {/* Search and Filter */}
            <form onSubmit={handleSearch} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search users..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="ACTIVE">Active</option>
                  <option value="SUSPENDED">Suspended</option>
                </select>
              </div>
            </form>

            {/* Select All Button */}
            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={handleSelectAll}
                className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                {selectedRecipients.length === displayRecipients.length
                  ? "Deselect All"
                  : "Select All"}
              </button>
              <Link
                to="/bulk-email/recipients"
                className="text-sm text-green-600 hover:text-green-700 transition-colors"
              >
                Manage Recipients
              </Link>
            </div>
          </div>

          {/* Recipients List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h4 className="font-medium text-gray-900">Recipients List</h4>
            </div>
            <div className="max-h-64 overflow-y-auto space-y-2 p-4">
              {displayRecipients && displayRecipients.length > 0 ? (
                displayRecipients.map((recipient: any) => (
                  <div
                    key={recipient.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                      selectedRecipients.includes(recipient.id)
                        ? "bg-blue-50 border-blue-200"
                        : "bg-white border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedRecipients.includes(recipient.id)}
                      onChange={() =>
                        dispatch(toggleRecipientSelection(recipient.id))
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
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
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p>No users found. Try adjusting your search criteria.</p>
                </div>
              )}
            </div>
          </div>

          {/* Send Button */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <button
              onClick={handleSendEmail}
              disabled={isSending || selectedRecipients.length === 0}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isSending ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {isSending
                ? "Sending..."
                : `Send to ${selectedRecipients.length} recipients`}
            </button>
            {sendError && (
              <p className="mt-2 text-sm text-red-600">{sendError}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComposeEmailPage;
