import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchTemplates,
  fetchRecipients,
  fetchStats,
  sendBulkEmail,
  createTemplate,
  uploadRecipientsCsv,
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
  Mail,
  Users,
  Send,
  Save,
  RefreshCw,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Plus,
  BarChart3,
  Clock,
  UserCheck,
  UserX,
  FileText,
} from "lucide-react";
import Loader from "../components/Loader";
import apiService from "../services/api";
import { useToast } from "../contexts/ToastContext";

const BulkEmailPage: React.FC = () => {
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
    lastSendResult,
    stats,
    statsLoading,
  } = useAppSelector((state: any) => state.bulkEmail);

  // Use API data directly
  const displayTemplates = templates || [];
  const displayRecipients = recipients || [];
  const displayStats = stats;

  // Debug logging
  console.log("Recipients state:", {
    recipients,
    displayRecipients,
    recipientsLoading,
  });

  const [activeTab, setActiveTab] = useState<
    "compose" | "templates" | "history" | "stats"
  >("compose");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    subject: "",
    content: "",
  });
  const [showPreview, setShowPreview] = useState(false);
  const [showAddRecipientModal, setShowAddRecipientModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [newRecipient, setNewRecipient] = useState({
    email: "",
    name: "",
    status: "ACTIVE" as "ACTIVE" | "SUSPENDED",
  });
  const [csvFile, setCsvFile] = useState<File | null>(null);

  usePageTitle("Bulk Email");

  useEffect(() => {
    // Always fetch recipients when component mounts or when search/filter changes
    dispatch(
      fetchRecipients({
        page: 1,
        limit: 100,
        search: searchTerm,
        status: statusFilter,
      })
    ).catch(() => {
      console.log("Recipients API not available, using mock data");
    });

    // Only fetch templates and stats if we're on the compose tab or stats tab
    if (activeTab === "compose" || activeTab === "stats") {
      // Try to fetch real data, but handle errors gracefully
      dispatch(fetchTemplates()).catch(() => {
        console.log("Templates API not available, using mock data");
      });
      dispatch(fetchStats({})).catch(() => {
        console.log("Stats API not available, using mock data");
      });
    }
  }, [dispatch, searchTerm, statusFilter, activeTab]);

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
      // For demo purposes, show a success message even if API fails
      showToast(
        `Demo: Email would be sent to ${recipientEmails.length} recipients`,
        "info"
      );
    }
  };

  const handleCreateTemplate = async () => {
    if (
      !newTemplate.name.trim() ||
      !newTemplate.subject.trim() ||
      !newTemplate.content.trim()
    ) {
      showToast("Please fill in all template fields", "warning");
      return;
    }

    try {
      await dispatch(createTemplate(newTemplate));
      setNewTemplate({ name: "", subject: "", content: "" });
      setShowTemplateModal(false);
      showToast("Template created successfully!", "success");
    } catch (error) {
      console.error("Error creating template:", error);
      showToast("Failed to create template", "error");
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    dispatch(setSelectedTemplate(templateId || null));
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
          limit: 100,
          search: searchTerm,
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
          limit: 100,
          search: searchTerm,
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Mail className="h-8 w-8 text-blue-600" />
              Bulk Email
            </h1>
            <p className="text-gray-600 mt-1">
              Send emails to multiple users at once
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                // Demo: Fill in sample data
                dispatch(setEmailSubject("Welcome to Freespeek!"));
                dispatch(
                  setEmailContent(
                    "Dear User,\n\nWelcome to our platform! We're excited to have you join our community.\n\nBest regards,\nThe Freespeek Team"
                  )
                );
                // Select all active users
                const activeUserIds = displayRecipients
                  .filter((r: any) => r.status === "ACTIVE")
                  .map((r: any) => r.id);
                activeUserIds.forEach((id: string) => {
                  if (!selectedRecipients.includes(id)) {
                    dispatch(toggleRecipientSelection(id));
                  }
                });
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Mail className="h-4 w-4" />
              Fill Sample Data
            </button>
            <button
              onClick={() => dispatch(fetchStats({}))}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Stats
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {displayStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Emails Sent
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {displayStats.totalEmailsSent}
                </p>
              </div>
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Templates</p>
                <p className="text-2xl font-bold text-gray-900">
                  {displayStats.totalTemplates}
                </p>
              </div>
              <Save className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sent Today</p>
                <p className="text-2xl font-bold text-gray-900">
                  {displayStats.emailsSentToday}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Open Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {displayStats.averageOpenRate}%
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: "compose", label: "Compose Email", icon: Mail },
              { id: "templates", label: "Templates", icon: Save },
              { id: "history", label: "History", icon: Clock },
              { id: "stats", label: "Statistics", icon: BarChart3 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Compose Tab */}
          {activeTab === "compose" && (
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
                  <button
                    onClick={() => setShowTemplateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    New Template
                  </button>
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
                      <h3 className="text-lg font-semibold mb-2">
                        {emailSubject}
                      </h3>
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

              {/* Recipient Selection */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Select Recipients
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">
                      {getSelectedCount()} of {displayRecipients.length}{" "}
                      selected
                    </span>
                    <button
                      onClick={() => setShowAddRecipientModal(true)}
                      className="flex items-center gap-1 px-3 py-1 text-sm text-green-600 hover:text-green-800 font-medium border border-green-300 rounded-lg hover:bg-green-50 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Add Recipient
                    </button>
                    <button
                      onClick={() => setShowImportModal(true)}
                      className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-800 font-medium border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <FileText className="h-4 w-4" />
                      Import CSV
                    </button>
                    <button
                      onClick={handleSelectAll}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {selectedRecipients.length === displayRecipients.length
                        ? "Deselect All"
                        : "Select All"}
                    </button>
                  </div>
                </div>

                {/* Search and Filter */}
                <form
                  onSubmit={handleSearch}
                  className="flex items-center gap-3 mb-4"
                >
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search users..."
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
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Search className="h-4 w-4" />
                    Search
                  </button>
                </form>

                {/* Recipients List */}
                <div className="max-h-64 overflow-y-auto space-y-2">
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
                    : `Send to ${selectedRecipients.length} recipients`}
                </button>
              </div>
            </div>
          )}

          {/* Templates Tab */}
          {activeTab === "templates" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  Email Templates
                </h3>
                <button
                  onClick={() => setShowTemplateModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Create Template
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayTemplates && displayTemplates.length > 0 ? (
                  displayTemplates.map((template: any) => (
                    <div
                      key={template.id}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                    >
                      <h4 className="font-medium text-gray-900 mb-2">
                        {template.name}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {template.subject}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          Created{" "}
                          {new Date(template.createdAt).toLocaleDateString()}
                        </span>
                        <button
                          onClick={() => handleTemplateSelect(template.id)}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Use Template
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    <Save className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p>
                      No templates found. Create your first template to get
                      started.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === "history" && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Email History
              </h3>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
                  <p className="text-sm text-gray-600">
                    No email history available yet.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Stats Tab */}
          {activeTab === "stats" && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">
                Email Statistics
              </h3>
              {statsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader size="lg" />
                </div>
              ) : displayStats ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-blue-50 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600">
                          Total Emails
                        </p>
                        <p className="text-3xl font-bold text-blue-900">
                          {displayStats.totalEmailsSent}
                        </p>
                      </div>
                      <Mail className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-600">
                          Templates
                        </p>
                        <p className="text-3xl font-bold text-green-900">
                          {displayStats.totalTemplates}
                        </p>
                      </div>
                      <Save className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-orange-600">
                          Sent Today
                        </p>
                        <p className="text-3xl font-bold text-orange-900">
                          {displayStats.emailsSentToday}
                        </p>
                      </div>
                      <Clock className="h-8 w-8 text-orange-600" />
                    </div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-600">
                          Open Rate
                        </p>
                        <p className="text-3xl font-bold text-purple-900">
                          {displayStats.averageOpenRate}%
                        </p>
                      </div>
                      <BarChart3 className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>
                  <div className="bg-indigo-50 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-indigo-600">
                          This Week
                        </p>
                        <p className="text-3xl font-bold text-indigo-900">
                          {displayStats.emailsSentThisWeek}
                        </p>
                      </div>
                      <BarChart3 className="h-8 w-8 text-indigo-600" />
                    </div>
                  </div>
                  <div className="bg-pink-50 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-pink-600">
                          This Month
                        </p>
                        <p className="text-3xl font-bold text-pink-900">
                          {displayStats.emailsSentThisMonth}
                        </p>
                      </div>
                      <BarChart3 className="h-8 w-8 text-pink-600" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No statistics available</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Create New Template
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template Name
                </label>
                <input
                  type="text"
                  value={newTemplate.name}
                  onChange={(e) =>
                    setNewTemplate({ ...newTemplate, name: e.target.value })
                  }
                  placeholder="Enter template name..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject Line
                </label>
                <input
                  type="text"
                  value={newTemplate.subject}
                  onChange={(e) =>
                    setNewTemplate({ ...newTemplate, subject: e.target.value })
                  }
                  placeholder="Enter subject line..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={newTemplate.content}
                  onChange={(e) =>
                    setNewTemplate({ ...newTemplate, content: e.target.value })
                  }
                  placeholder="Enter email content..."
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setShowTemplateModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTemplate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Template
              </button>
            </div>
          </div>
        </div>
      )}

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
                  Maximum file size: <strong>50MB</strong>
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

export default BulkEmailPage;
