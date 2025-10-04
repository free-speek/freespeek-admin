import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchTemplates,
  setSelectedTemplate,
} from "../../store/slices/bulkEmailSlice";
import { Save, Plus, Edit, Copy, Trash2, Eye, Sparkles } from "lucide-react";
import { useToast } from "../../contexts/ToastContext";
import {
  preBuiltTemplates,
  getAllCategories,
} from "../../data/preBuiltTemplates";
import Loader from "../Loader";
import { useNavigate } from "react-router-dom";

const Templates: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { templates, templatesLoading } = useAppSelector(
    (state: any) => state.bulkEmail
  );

  const [showPreBuiltModal, setShowPreBuiltModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchTemplates());
  }, [dispatch]);

  const displayTemplates = templates || [];
  const categories = getAllCategories();

  const filteredTemplates = displayTemplates.filter((template: any) => {
    const matchesSearch =
      (template.name &&
        template.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (template.subject &&
        template.subject.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const filteredPreBuiltTemplates = preBuiltTemplates.filter((template) => {
    const matchesCategory =
      selectedCategory === "all" || template.category === selectedCategory;
    const matchesSearch =
      (template.name &&
        template.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (template.subject &&
        template.subject.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleTemplateSelect = (templateId: string) => {
    dispatch(setSelectedTemplate(templateId));
    showToast("Template selected successfully!", "success");
  };

  const handleCopyTemplate = (template: any) => {
    // Copy template to clipboard or create a copy
    showToast("Template copied to clipboard!", "success");
  };

  const handleEditTemplate = (template: any) => {
    navigate("/bulk-email/templates", {
      state: { editTemplate: template },
    });
  };

  const handleDeleteTemplate = (template: any) => {
    // This would be handled by the TemplatesPage component
    navigate("/bulk-email/templates", {
      state: { deleteTemplate: template },
    });
  };

  const handleSelectPreBuiltTemplate = (template: any) => {
    navigate("/bulk-email/templates", {
      state: { selectedPreBuiltTemplate: template },
    });
    setShowPreBuiltModal(false);
  };

  if (templatesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowPreBuiltModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Sparkles className="h-4 w-4" />
          Pre-built Templates
        </button>
        <button
          onClick={() => navigate("/bulk-email/templates/create")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create Template
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search templates..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* My Templates */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-900 flex items-center gap-2">
          <Save className="h-5 w-5" />
          My Templates ({filteredTemplates.length})
        </h4>

        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template: any) => (
              <div
                key={template.id}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-start justify-between mb-3">
                  <h5 className="font-medium text-gray-900 truncate flex-1">
                    {template.name}
                  </h5>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditTemplate(template)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      title="Edit template"
                    >
                      <Edit className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleCopyTemplate(template)}
                      className="p-1 text-green-600 hover:bg-green-50 rounded"
                      title="Copy template"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteTemplate(template)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                      title="Delete template"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {template.subject}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Created {new Date(template.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleTemplateSelect(template.id)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Use Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <Save className="h-12 w-12 mx-auto mb-2 text-gray-400" />
            <p className="text-gray-600">
              {searchTerm
                ? "No templates match your search."
                : "No templates found. Create your first template to get started."}
            </p>
          </div>
        )}
      </div>

      {/* Pre-built Templates */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-900 flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Pre-built Templates ({filteredPreBuiltTemplates.length})
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPreBuiltTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-4 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start justify-between mb-3">
                <h5 className="font-medium text-gray-900 truncate flex-1">
                  {template.name}
                </h5>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleSelectPreBuiltTemplate(template)}
                    className="p-1 text-purple-600 hover:bg-purple-50 rounded"
                    title="Use template"
                  >
                    <Eye className="h-3 w-3" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {template.subject}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                  {template.category}
                </span>
                <button
                  onClick={() => handleSelectPreBuiltTemplate(template)}
                  className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                >
                  Use Template
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pre-built Templates Modal */}
      {showPreBuiltModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                Pre-built Templates
              </h3>
              <button
                onClick={() => setShowPreBuiltModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === "all"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPreBuiltTemplates.map((template) => (
                <div
                  key={template.id}
                  className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-4 hover:shadow-md transition-shadow"
                >
                  <h5 className="font-medium text-gray-900 mb-2">
                    {template.name}
                  </h5>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                    {template.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                      {template.category}
                    </span>
                    <button
                      onClick={() => handleSelectPreBuiltTemplate(template)}
                      className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors"
                    >
                      Use Template
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Templates;
