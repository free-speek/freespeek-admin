import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} from "../store/slices/bulkEmailSlice";
import { usePageTitle } from "../hooks/usePageTitle";
import {
  FileText,
  Plus,
  Search,
  ArrowLeft,
  Upload,
  Code,
  FileCode,
  Monitor,
  Eye,
  Edit,
  Trash2,
  Copy,
  Sparkles,
} from "lucide-react";
import Loader from "../components/Loader";
import AppStoreLink from "../components/AppStoreLink";
import { useToast } from "../contexts/ToastContext";
import { Link } from "react-router-dom";
import {
  preBuiltTemplates,
  PreBuiltTemplate,
  getAllCategories,
} from "../data/preBuiltTemplates";

const TemplatesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const { templates, templatesLoading } = useAppSelector(
    (state: any) => state.bulkEmail
  );

  const displayTemplates = templates || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showPreBuiltModal, setShowPreBuiltModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [previewTemplate] = useState<any>(null);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [deletingTemplate, setDeletingTemplate] = useState<any>(null);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    subject: "",
    content: "",
  });
  const [htmlFile, setHtmlFile] = useState<File | null>(null);
  const [htmlCode, setHtmlCode] = useState("");
  const [inputMethod, setInputMethod] = useState<
    "text" | "html-file" | "html-code" | "pre-built"
  >("text");
  const [showPreview, setShowPreview] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  usePageTitle("Email Templates");

  useEffect(() => {
    dispatch(fetchTemplates()).catch(() => {
      console.log("Templates API not available");
    });
  }, [dispatch]);

  // Handle HTML file upload
  const handleHtmlFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "text/html" || file.name.endsWith(".html")) {
        setHtmlFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setHtmlCode(content);
          setNewTemplate({ ...newTemplate, content });
        };
        reader.readAsText(file);
        showToast("HTML file loaded successfully!", "success");
      } else {
        showToast("Please select a valid HTML file", "warning");
      }
    }
  };

  // Handle HTML code change
  const handleHtmlCodeChange = (code: string) => {
    setHtmlCode(code);
    setNewTemplate({ ...newTemplate, content: code });
  };

  // Get current content based on input method
  const getCurrentContent = () => {
    switch (inputMethod) {
      case "html-file":
      case "html-code":
        return htmlCode;
      default:
        return newTemplate.content;
    }
  };

  const handleCreateTemplate = async () => {
    if (
      !newTemplate.name.trim() ||
      !newTemplate.subject.trim() ||
      !getCurrentContent().trim()
    ) {
      showToast("Please fill in all template fields", "warning");
      return;
    }

    try {
      const templateData = {
        ...newTemplate,
        content: getCurrentContent(),
      };
      await dispatch(createTemplate(templateData));
      setNewTemplate({ name: "", subject: "", content: "" });
      setHtmlFile(null);
      setHtmlCode("");
      setInputMethod("text");
      setShowCreateModal(false);
      showToast("Template created successfully!", "success");
    } catch (error) {
      console.error("Error creating template:", error);
      showToast("Failed to create template", "error");
    }
  };

  const handleCopy = (template: any) => {
    setNewTemplate({
      name: `${template.name} (Copy)`,
      subject: template.subject,
      content: template.content,
    });
    setShowCreateModal(true);
    showToast("Template copied to create form", "info");
  };

  const handleEdit = (template: any) => {
    setEditingTemplate(template);
    setNewTemplate({
      name: template.name,
      subject: template.subject,
      content: template.content,
    });
    setHtmlCode(template.content);
    setInputMethod(template.content.includes("<") ? "html-code" : "text");
    setShowEditModal(true);
  };

  const handleDelete = (template: any) => {
    setDeletingTemplate(template);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deletingTemplate) return;

    try {
      await dispatch(deleteTemplate(deletingTemplate.id));
      setShowDeleteModal(false);
      setDeletingTemplate(null);
      showToast("Template deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting template:", error);
      showToast("Failed to delete template", "error");
    }
  };

  const handleUpdateTemplate = async () => {
    if (
      !newTemplate.name.trim() ||
      !newTemplate.subject.trim() ||
      !getCurrentContent().trim()
    ) {
      showToast("Please fill in all template fields", "warning");
      return;
    }

    if (!editingTemplate) return;

    try {
      const templateData = {
        templateId: editingTemplate.id,
        name: newTemplate.name,
        subject: newTemplate.subject,
        content: getCurrentContent(),
      };
      await dispatch(updateTemplate(templateData));
      setNewTemplate({ name: "", subject: "", content: "" });
      setHtmlFile(null);
      setHtmlCode("");
      setInputMethod("text");
      setShowEditModal(false);
      setEditingTemplate(null);
      showToast("Template updated successfully!", "success");
    } catch (error) {
      console.error("Error updating template:", error);
      showToast("Failed to update template", "error");
    }
  };

  const handleSelectPreBuiltTemplate = (template: PreBuiltTemplate) => {
    setNewTemplate({
      name: template.name,
      subject: template.subject,
      content: template.content,
    });
    setHtmlCode(template.content);
    setInputMethod(template.isHtml ? "html-code" : "text");
    setShowPreBuiltModal(false);
    setShowCreateModal(true);
    showToast(`Selected template: ${template.name}`, "success");
  };

  const filteredTemplates = displayTemplates.filter(
    (template: any) =>
      (template.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (template.subject?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  if (templatesLoading) {
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
              Email Templates
            </h1>
            <p className="text-gray-600">
              Create and manage reusable email templates
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreBuiltModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Sparkles className="h-4 w-4" />
            Pre-built Templates
          </button>
          <AppStoreLink
            href="#"
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              setShowCreateModal(true);
            }}
            className="cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Create Template
          </AppStoreLink>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Templates
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {displayTemplates.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Active Templates
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {
                  displayTemplates.filter((t: any) => t.isActive !== false)
                    .length
                }
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
              <p className="text-sm font-medium text-gray-600">
                Recently Created
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {
                  displayTemplates.filter((t: any) => {
                    const created = new Date(t.createdAt);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return created > weekAgo;
                  }).length
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search templates by name or subject..."
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.length > 0 ? (
          filteredTemplates.map((template: any) => (
            <Link
              key={template.id}
              to={`/bulk-email/templates/${template.id}`}
              className="block bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
            >
              <div className="p-6">
                {/* Template Thumbnail */}
                <div className="mb-4">
                  {template.content && template.content.includes("<") ? (
                    <div className="border border-gray-200 rounded-lg overflow-hidden bg-gradient-to-br from-gray-50 to-white">
                      <div className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-6 w-6 bg-blue-600 rounded flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              FS
                            </span>
                          </div>
                          <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                          <span className="text-xs font-medium text-gray-600">
                            Email Preview
                          </span>
                        </div>
                        <div className="max-h-32 overflow-hidden">
                          <div
                            className="text-xs text-gray-700 leading-relaxed scale-75 origin-top-left"
                            style={{ width: "133%", height: "133%" }}
                            dangerouslySetInnerHTML={{
                              __html:
                                template.content.length > 300
                                  ? template.content.substring(0, 300) + "..."
                                  : template.content,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-6 w-6 bg-gray-400 rounded flex items-center justify-center">
                          <FileText className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-xs font-medium text-gray-600">
                          Text Template
                        </span>
                      </div>
                      <p className="text-xs text-gray-700 line-clamp-4">
                        {template.content || "No content"}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {template.name || "Untitled Template"}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {template.subject || "No subject"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleEdit(template);
                      }}
                      className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                      title="Edit template"
                    >
                      <Edit className="h-3 w-3" />
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleCopy(template);
                      }}
                      className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                      title="Copy template"
                    >
                      <Copy className="h-3 w-3" />
                      Copy
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete(template);
                      }}
                      className="flex items-center gap-1 px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                      title="Delete template"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    Created{" "}
                    {template.createdAt
                      ? new Date(template.createdAt).toLocaleDateString()
                      : "Unknown date"}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full ${
                      template.isActive !== false
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {template.isActive !== false ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500 text-lg mb-2">No templates found</p>
            <p className="text-gray-400 mb-6">
              {searchTerm
                ? "Try adjusting your search criteria"
                : "Create your first email template to get started"}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Template
            </button>
          </div>
        )}
      </div>

      {/* Create Template Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
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
                  placeholder="Enter template name"
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
                  placeholder="Enter email subject"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Content
                </label>

                {/* Input Method Selection */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setInputMethod("text")}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      inputMethod === "text"
                        ? "bg-blue-100 text-blue-700 border border-blue-300"
                        : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                    }`}
                  >
                    <FileText className="h-4 w-4" />
                    Text
                  </button>
                  <button
                    onClick={() => setInputMethod("html-file")}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      inputMethod === "html-file"
                        ? "bg-blue-100 text-blue-700 border border-blue-300"
                        : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                    }`}
                  >
                    <Upload className="h-4 w-4" />
                    Upload HTML
                  </button>
                  <button
                    onClick={() => setInputMethod("html-code")}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      inputMethod === "html-code"
                        ? "bg-blue-100 text-blue-700 border border-blue-300"
                        : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                    }`}
                  >
                    <Code className="h-4 w-4" />
                    HTML Code
                  </button>
                </div>

                {/* Text Input */}
                {inputMethod === "text" && (
                  <textarea
                    value={newTemplate.content}
                    onChange={(e) =>
                      setNewTemplate({
                        ...newTemplate,
                        content: e.target.value,
                      })
                    }
                    placeholder="Enter email content. Use {{name}} for recipient name, {{email}} for recipient email."
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                )}

                {/* HTML File Upload */}
                {inputMethod === "html-file" && (
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept=".html,.htm"
                        onChange={handleHtmlFileUpload}
                        className="hidden"
                        id="html-file-upload"
                      />
                      <label
                        htmlFor="html-file-upload"
                        className="cursor-pointer flex flex-col items-center gap-2"
                      >
                        <FileCode className="h-8 w-8 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">
                          Click to upload HTML file
                        </span>
                        <span className="text-xs text-gray-500">
                          .html or .htm files only
                        </span>
                      </label>
                    </div>
                    {htmlFile && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 text-green-700">
                          <FileCode className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {htmlFile.name}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* HTML Code Input */}
                {inputMethod === "html-code" && (
                  <div className="space-y-2">
                    <textarea
                      value={htmlCode}
                      onChange={(e) => handleHtmlCodeChange(e.target.value)}
                      placeholder="Paste your HTML code here..."
                      rows={12}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                    />
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-500">
                        Use variables like {"{{name}}"} and {"{{email}}"} for
                        personalization
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowPreview(!showPreview)}
                        className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <Monitor className="h-4 w-4" />
                        {showPreview ? "Hide Preview" : "Show Preview"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Live Preview */}
                {showPreview &&
                  (inputMethod === "html-code" ||
                    inputMethod === "html-file") &&
                  getCurrentContent() && (
                    <div className="mt-4 border border-gray-300 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-3 py-2 border-b border-gray-300">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <Monitor className="h-4 w-4" />
                          Live Preview
                        </div>
                      </div>
                      <div
                        className="p-4 bg-white"
                        dangerouslySetInnerHTML={{
                          __html: getCurrentContent(),
                        }}
                      />
                    </div>
                  )}

                {inputMethod === "text" && (
                  <p className="text-xs text-gray-500 mt-1">
                    Use variables like {"{{name}}"} and {"{{email}}"} for
                    personalization
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
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

      {/* Preview Modal */}
      {showPreviewModal && previewTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Template Preview: {previewTemplate.name || "Untitled Template"}
              </h3>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Eye className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <div className="p-3 bg-gray-50 rounded-lg border">
                  {previewTemplate.subject || "No subject"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                {previewTemplate.content &&
                previewTemplate.content.includes("<") ? (
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-3 py-2 border-b border-gray-300">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Monitor className="h-4 w-4" />
                        HTML Preview
                      </div>
                    </div>
                    <div
                      className="p-4 bg-white max-h-96 overflow-y-auto"
                      dangerouslySetInnerHTML={{
                        __html: previewTemplate.content,
                      }}
                    />
                  </div>
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg border whitespace-pre-wrap">
                    {previewTemplate.content || "No content"}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleCopy(previewTemplate);
                  setShowPreviewModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Copy Template
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pre-built Templates Modal */}
      {showPreBuiltModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  Pre-built Email Templates
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Choose from professionally designed templates
                </p>
              </div>
              <button
                onClick={() => setShowPreBuiltModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === "all"
                      ? "bg-purple-100 text-purple-700 border border-purple-300"
                      : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                  }`}
                >
                  All Categories
                </button>
                {getAllCategories().map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? "bg-purple-100 text-purple-700 border border-purple-300"
                        : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {preBuiltTemplates
                .filter(
                  (template) =>
                    selectedCategory === "all" ||
                    template.category === selectedCategory
                )
                .map((template) => (
                  <div
                    key={template.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer group"
                    onClick={() => handleSelectPreBuiltTemplate(template)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
                          {template.name}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {template.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {template.isHtml ? (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                            HTML
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                            Text
                          </span>
                        )}
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {template.category}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-700 mb-3 line-clamp-2">
                      <strong>Subject:</strong> {template.subject}
                    </div>
                    <div className="text-xs text-gray-500">
                      Click to select this template
                    </div>
                  </div>
                ))}
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setShowPreBuiltModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Template Modal */}
      {showEditModal && editingTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Edit Template: {editingTemplate.name}
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
                  placeholder="Enter template name"
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
                  placeholder="Enter email subject"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Content
                </label>
                <textarea
                  value={getCurrentContent()}
                  onChange={(e) => {
                    if (inputMethod === "html-code") {
                      handleHtmlCodeChange(e.target.value);
                    } else {
                      setNewTemplate({
                        ...newTemplate,
                        content: e.target.value,
                      });
                    }
                  }}
                  placeholder="Enter email content..."
                  rows={12}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingTemplate(null);
                  setNewTemplate({ name: "", subject: "", content: "" });
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateTemplate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update Template
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Delete Template
                </h3>
                <p className="text-sm text-gray-600">
                  This action cannot be undone
                </p>
              </div>
            </div>
            <div className="mb-6">
              <p className="text-gray-600 mb-2">
                Are you sure you want to delete this template?
              </p>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="font-medium text-gray-900">
                  {deletingTemplate.name}
                </p>
                <p className="text-sm text-gray-600">
                  {deletingTemplate.subject}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingTemplate(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplatesPage;
