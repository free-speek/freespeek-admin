import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchTemplates } from "../store/slices/bulkEmailSlice";
import { usePageTitle } from "../hooks/usePageTitle";
import {
  ArrowLeft,
  Edit,
  Copy,
  Trash2,
  Eye,
  Monitor,
  Code,
  Download,
  Share,
} from "lucide-react";
import Loader from "../components/Loader";
import { useToast } from "../contexts/ToastContext";

const TemplateDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const { templates, templatesLoading } = useAppSelector(
    (state: any) => state.bulkEmail
  );

  const [viewMode, setViewMode] = useState<"preview" | "code">("preview");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  usePageTitle("Template Detail");

  useEffect(() => {
    if (!templates || templates.length === 0) {
      dispatch(fetchTemplates()).catch(() => {
        console.log("Templates API not available");
      });
    }
  }, [dispatch, templates]);

  const template = templates?.find((t: any) => t.id === id);

  if (templatesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  if (!template) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Template Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The template you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/bulk-email/templates")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Templates
          </button>
        </div>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(template.content);
    showToast("Template content copied to clipboard!", "success");
  };

  const handleDelete = () => {
    // TODO: Implement delete functionality
    showToast("Delete functionality coming soon!", "info");
    setShowDeleteModal(false);
  };

  const handleEdit = () => {
    // TODO: Navigate to edit page or open edit modal
    showToast("Edit functionality coming soon!", "info");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/bulk-email/templates")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Templates
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {template.name || "Untitled Template"}
            </h1>
            <p className="text-gray-600">{template.subject || "No subject"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Copy className="h-4 w-4" />
            Copy
          </button>
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit className="h-4 w-4" />
            Edit
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Template Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Template Name
            </h3>
            <p className="text-gray-900">
              {template.name || "Untitled Template"}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Subject</h3>
            <p className="text-gray-900">{template.subject || "No subject"}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Created</h3>
            <p className="text-gray-900">
              {template.createdAt
                ? new Date(template.createdAt).toLocaleDateString()
                : "Unknown date"}
            </p>
          </div>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("preview")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === "preview"
                ? "bg-blue-100 text-blue-700 border border-blue-300"
                : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
            }`}
          >
            <Monitor className="h-4 w-4" />
            Preview
          </button>
          <button
            onClick={() => setViewMode("code")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === "code"
                ? "bg-blue-100 text-blue-700 border border-blue-300"
                : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
            }`}
          >
            <Code className="h-4 w-4" />
            Code
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Download className="h-4 w-4" />
            Download HTML
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Share className="h-4 w-4" />
            Share
          </button>
        </div>
      </div>

      {/* Template Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {viewMode === "preview" ? (
          <div>
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Eye className="h-4 w-4" />
                Email Preview
              </div>
            </div>
            <div className="p-6">
              {template.content && template.content.includes("<") ? (
                <div
                  className="max-w-4xl mx-auto"
                  dangerouslySetInnerHTML={{ __html: template.content }}
                />
              ) : (
                <div className="max-w-4xl mx-auto">
                  <pre className="whitespace-pre-wrap text-gray-700">
                    {template.content || "No content"}
                  </pre>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Code className="h-4 w-4" />
                HTML Source Code
              </div>
            </div>
            <div className="p-6">
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{template.content || "No content"}</code>
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Delete Template
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this template? This action cannot
              be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateDetailPage;
