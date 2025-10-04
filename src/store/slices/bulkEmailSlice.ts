import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiService from "../../services/api";
import {
  BulkEmailTemplate,
  BulkEmailHistory,
  BulkEmailStats,
  BulkEmailRecipient,
} from "../../types";

interface BulkEmailState {
  // Templates
  templates: BulkEmailTemplate[];
  templatesLoading: boolean;
  templatesError: string | null;

  // History
  history: BulkEmailHistory[];
  historyLoading: boolean;
  historyError: string | null;
  historyTotalPages: number;
  historyCurrentPage: number;

  // Stats
  stats: BulkEmailStats | null;
  statsLoading: boolean;
  statsError: string | null;

  // Recipients
  recipients: BulkEmailRecipient[];
  recipientsLoading: boolean;
  recipientsError: string | null;
  recipientsTotalCount: number;
  recipientsTotalPages: number;
  selectedRecipients: string[];

  // Email composition
  emailSubject: string;
  emailContent: string;
  selectedTemplate: string | null;

  // Sending
  isSending: boolean;
  sendError: string | null;
  lastSendResult: any | null;

  // CSV Upload
  isUploading: boolean;
  uploadError: string | null;
  uploadResult: any | null;

  // Groups
  groups: any[];
  groupsLoading: boolean;
  groupsError: string | null;
}

const initialState: BulkEmailState = {
  templates: [],
  templatesLoading: false,
  templatesError: null,

  history: [],
  historyLoading: false,
  historyError: null,
  historyTotalPages: 0,
  historyCurrentPage: 1,

  stats: null,
  statsLoading: false,
  statsError: null,

  recipients: [],
  recipientsLoading: false,
  recipientsError: null,
  recipientsTotalCount: 0,
  recipientsTotalPages: 0,
  selectedRecipients: [],

  emailSubject: "",
  emailContent: "",
  selectedTemplate: null,

  isSending: false,
  sendError: null,
  lastSendResult: null,

  isUploading: false,
  uploadError: null,
  uploadResult: null,

  // Groups
  groups: [],
  groupsLoading: false,
  groupsError: null,
};

// Async thunks
export const fetchTemplates = createAsyncThunk(
  "bulkEmail/fetchTemplates",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getBulkEmailTemplates();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch templates");
    }
  }
);

export const createTemplate = createAsyncThunk(
  "bulkEmail/createTemplate",
  async (
    {
      name,
      subject,
      content,
    }: { name: string; subject: string; content: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.createBulkEmailTemplate(
        name,
        subject,
        content
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create template");
    }
  }
);

export const updateTemplate = createAsyncThunk(
  "bulkEmail/updateTemplate",
  async (
    {
      templateId,
      name,
      subject,
      content,
    }: { templateId: string; name: string; subject: string; content: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.updateBulkEmailTemplate(
        templateId,
        name,
        subject,
        content
      );
      return { templateId, ...(response as object) };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update template");
    }
  }
);

export const deleteTemplate = createAsyncThunk(
  "bulkEmail/deleteTemplate",
  async (templateId: string, { rejectWithValue }) => {
    try {
      await apiService.deleteBulkEmailTemplate(templateId);
      return templateId;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete template");
    }
  }
);

export const fetchHistory = createAsyncThunk(
  "bulkEmail/fetchHistory",
  async (
    { page = 1, limit = 20 }: { page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.getBulkEmailHistory(page, limit);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch history");
    }
  }
);

export const fetchStats = createAsyncThunk(
  "bulkEmail/fetchStats",
  async (
    filters: {
      timeFilter?: string;
      startDate?: string;
      endDate?: string;
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.getBulkEmailStats(filters);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch stats");
    }
  }
);

export const fetchRecipients = createAsyncThunk(
  "bulkEmail/fetchRecipients",
  async (
    {
      page = 1,
      limit = 100,
      search = "",
      status = "all",
    }: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      // Try to get recipients from bulk email backend first
      const response = await apiService.getRecipientsFromBackend(
        page,
        limit,
        search,
        status
      );
      return response;
    } catch (error: any) {
      // Fallback to regular users if bulk email recipients not available
      try {
        const response = await apiService.getUsers(page, limit, search, status);
        return response;
      } catch (fallbackError: any) {
        return rejectWithValue(
          fallbackError.message || "Failed to fetch recipients"
        );
      }
    }
  }
);

export const uploadRecipientsCsv = createAsyncThunk(
  "bulkEmail/uploadRecipientsCsv",
  async (file: File, { rejectWithValue }) => {
    try {
      const response = await apiService.uploadRecipientsCsv(file);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to upload CSV file");
    }
  }
);

export const sendBulkEmail = createAsyncThunk(
  "bulkEmail/sendBulkEmail",
  async (
    {
      recipients,
      subject,
      message,
      templateId,
    }: {
      recipients: string[];
      subject: string;
      message: string;
      templateId?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.sendBulkEmail(
        recipients,
        subject,
        message,
        templateId
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to send bulk email");
    }
  }
);

// Groups async thunks
export const fetchGroups = createAsyncThunk(
  "bulkEmail/fetchGroups",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getGroups();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch groups");
    }
  }
);

export const createGroup = createAsyncThunk(
  "bulkEmail/createGroup",
  async (
    {
      name,
      description,
      recipients,
    }: {
      name: string;
      description?: string;
      recipients: any[];
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.createGroup({
        name,
        description,
        recipients,
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create group");
    }
  }
);

export const updateGroup = createAsyncThunk(
  "bulkEmail/updateGroup",
  async (
    {
      id,
      name,
      description,
      recipients,
    }: {
      id: string;
      name: string;
      description?: string;
      recipients: any[];
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.updateGroup(id, {
        name,
        description,
        recipients,
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update group");
    }
  }
);

export const deleteGroup = createAsyncThunk(
  "bulkEmail/deleteGroup",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiService.deleteGroup(id);
      return { id, response };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete group");
    }
  }
);

const bulkEmailSlice = createSlice({
  name: "bulkEmail",
  initialState,
  reducers: {
    setEmailSubject: (state, action: PayloadAction<string>) => {
      state.emailSubject = action.payload;
    },
    setEmailContent: (state, action: PayloadAction<string>) => {
      state.emailContent = action.payload;
    },
    setSelectedTemplate: (state, action: PayloadAction<string | null>) => {
      state.selectedTemplate = action.payload;
      if (action.payload) {
        const template = state.templates.find((t) => t.id === action.payload);
        if (template) {
          state.emailSubject = template.subject;
          state.emailContent = template.content;
        }
      }
    },
    toggleRecipientSelection: (state, action: PayloadAction<string>) => {
      const recipientId = action.payload;
      if (state.selectedRecipients.includes(recipientId)) {
        state.selectedRecipients = state.selectedRecipients.filter(
          (id) => id !== recipientId
        );
      } else {
        state.selectedRecipients.push(recipientId);
      }
    },
    selectAllRecipients: (state) => {
      state.selectedRecipients = state.recipients.map((r) => r.id);
    },
    clearAllRecipients: (state) => {
      state.selectedRecipients = [];
    },
    clearSendResult: (state) => {
      state.lastSendResult = null;
      state.sendError = null;
    },
    clearUploadResult: (state) => {
      state.uploadResult = null;
      state.uploadError = null;
    },
    resetEmailForm: (state) => {
      state.emailSubject = "";
      state.emailContent = "";
      state.selectedTemplate = null;
      state.selectedRecipients = [];
      state.sendError = null;
      state.lastSendResult = null;
    },
  },
  extraReducers: (builder) => {
    // Templates
    builder
      .addCase(fetchTemplates.pending, (state) => {
        state.templatesLoading = true;
        state.templatesError = null;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.templatesLoading = false;
        const payload = action.payload as any;
        const templates =
          payload.data?.templates || payload.templates || payload;

        // Ensure templates is an array
        if (Array.isArray(templates)) {
          state.templates = templates;
        } else {
          state.templates = [];
        }
        state.templatesError = null;
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.templatesLoading = false;
        state.templatesError = action.payload as string;
      });

    // Create template
    builder
      .addCase(createTemplate.pending, (state) => {
        state.templatesLoading = true;
        state.templatesError = null;
      })
      .addCase(createTemplate.fulfilled, (state, action) => {
        state.templatesLoading = false;
        const payload = action.payload as any;
        state.templates.push(payload);
        state.templatesError = null;
      })
      .addCase(createTemplate.rejected, (state, action) => {
        state.templatesLoading = false;
        state.templatesError = action.payload as string;
      });

    // Update template
    builder
      .addCase(updateTemplate.pending, (state) => {
        state.templatesLoading = true;
        state.templatesError = null;
      })
      .addCase(updateTemplate.fulfilled, (state, action) => {
        state.templatesLoading = false;
        const { templateId, ...updatedTemplate } = action.payload as any;
        const index = state.templates.findIndex(
          (t: any) => t.id === templateId
        );
        if (index !== -1) {
          state.templates[index] = {
            ...state.templates[index],
            ...updatedTemplate,
          };
        }
        state.templatesError = null;
      })
      .addCase(updateTemplate.rejected, (state, action) => {
        state.templatesLoading = false;
        state.templatesError = action.payload as string;
      });

    // Delete template
    builder
      .addCase(deleteTemplate.pending, (state) => {
        state.templatesLoading = true;
        state.templatesError = null;
      })
      .addCase(deleteTemplate.fulfilled, (state, action) => {
        state.templatesLoading = false;
        const templateId = action.payload as string;
        state.templates = state.templates.filter(
          (t: any) => t.id !== templateId
        );
        state.templatesError = null;
      })
      .addCase(deleteTemplate.rejected, (state, action) => {
        state.templatesLoading = false;
        state.templatesError = action.payload as string;
      });

    // History
    builder
      .addCase(fetchHistory.pending, (state) => {
        state.historyLoading = true;
        state.historyError = null;
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.historyLoading = false;
        const payload = action.payload as any;
        const history = payload.data?.history || payload.history || payload;

        // Ensure history is an array
        if (Array.isArray(history)) {
          state.history = history;
        } else {
          state.history = [];
        }
        state.historyTotalPages =
          payload.data?.pagination?.totalPages || payload.totalPages || 1;
        state.historyCurrentPage =
          payload.data?.pagination?.page || payload.currentPage || 1;
        state.historyError = null;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.historyLoading = false;
        state.historyError = action.payload as string;
      });

    // Stats
    builder
      .addCase(fetchStats.pending, (state) => {
        state.statsLoading = true;
        state.statsError = null;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        const payload = action.payload as any;
        state.stats = payload.data || payload;
        state.statsError = null;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.statsError = action.payload as string;
      });

    // Recipients
    builder
      .addCase(fetchRecipients.pending, (state) => {
        state.recipientsLoading = true;
        state.recipientsError = null;
      })
      .addCase(fetchRecipients.fulfilled, (state, action) => {
        state.recipientsLoading = false;
        const payload = action.payload as any;

        // Handle nested data structure: payload.data.recipients
        const recipients =
          payload.data?.recipients || payload.recipients || payload;

        console.log("fetchRecipients.fulfilled:", { payload, recipients });

        // Handle pagination metadata
        const totalCount =
          payload.data?.totalCount ||
          payload.data?.total ||
          payload.totalCount ||
          payload.total ||
          0;
        const totalPages = payload.data?.totalPages || payload.totalPages || 1;

        state.recipientsTotalCount = totalCount;
        state.recipientsTotalPages = totalPages;

        // Ensure recipients is an array before mapping
        if (Array.isArray(recipients)) {
          state.recipients = recipients.map((recipient: any) => ({
            id: recipient._id || recipient.id,
            email: recipient.email,
            name: recipient.name,
            status: recipient.status || "ACTIVE",
            isSelected: state.selectedRecipients.includes(
              recipient._id || recipient.id
            ),
          }));
          console.log("Mapped recipients:", state.recipients);
          console.log("Total count:", totalCount, "Total pages:", totalPages);
        } else {
          console.log("Recipients is not an array:", recipients);
          state.recipients = [];
        }
        state.recipientsError = null;
      })
      .addCase(fetchRecipients.rejected, (state, action) => {
        state.recipientsLoading = false;
        state.recipientsError = action.payload as string;
        console.log("fetchRecipients.rejected:", action.payload);
      });

    // Send bulk email
    builder
      .addCase(sendBulkEmail.pending, (state) => {
        state.isSending = true;
        state.sendError = null;
      })
      .addCase(sendBulkEmail.fulfilled, (state, action) => {
        state.isSending = false;
        state.lastSendResult = action.payload;
        state.sendError = null;
        // Reset form after successful send
        state.emailSubject = "";
        state.emailContent = "";
        state.selectedTemplate = null;
        state.selectedRecipients = [];
      })
      .addCase(sendBulkEmail.rejected, (state, action) => {
        state.isSending = false;
        state.sendError = action.payload as string;
      });

    // CSV Upload
    builder
      .addCase(uploadRecipientsCsv.pending, (state) => {
        state.isUploading = true;
        state.uploadError = null;
      })
      .addCase(uploadRecipientsCsv.fulfilled, (state, action) => {
        state.isUploading = false;
        state.uploadResult = action.payload;
        state.uploadError = null;
        // Refresh recipients after successful upload
        // This will trigger a refetch of recipients
      })
      .addCase(uploadRecipientsCsv.rejected, (state, action) => {
        state.isUploading = false;
        state.uploadError = action.payload as string;
      });

    // Groups
    builder
      .addCase(fetchGroups.pending, (state) => {
        state.groupsLoading = true;
        state.groupsError = null;
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.groupsLoading = false;
        const payload = action.payload as any;
        state.groups = payload.data?.groups || payload.groups || payload || [];
        state.groupsError = null;
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.groupsLoading = false;
        state.groupsError = action.payload as string;
      });

    // Create Group
    builder
      .addCase(createGroup.pending, (state) => {
        state.groupsLoading = true;
        state.groupsError = null;
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.groupsLoading = false;
        const newGroup = action.payload as any;
        state.groups.push(newGroup);
        state.groupsError = null;
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.groupsLoading = false;
        state.groupsError = action.payload as string;
      });

    // Update Group
    builder
      .addCase(updateGroup.pending, (state) => {
        state.groupsLoading = true;
        state.groupsError = null;
      })
      .addCase(updateGroup.fulfilled, (state, action) => {
        state.groupsLoading = false;
        const updatedGroup = action.payload as any;
        const index = state.groups.findIndex((g) => g.id === updatedGroup.id);
        if (index !== -1) {
          state.groups[index] = updatedGroup;
        }
        state.groupsError = null;
      })
      .addCase(updateGroup.rejected, (state, action) => {
        state.groupsLoading = false;
        state.groupsError = action.payload as string;
      });

    // Delete Group
    builder
      .addCase(deleteGroup.pending, (state) => {
        state.groupsLoading = true;
        state.groupsError = null;
      })
      .addCase(deleteGroup.fulfilled, (state, action) => {
        state.groupsLoading = false;
        const { id } = action.payload as any;
        state.groups = state.groups.filter((g) => g.id !== id);
        state.groupsError = null;
      })
      .addCase(deleteGroup.rejected, (state, action) => {
        state.groupsLoading = false;
        state.groupsError = action.payload as string;
      });
  },
});

export const {
  setEmailSubject,
  setEmailContent,
  setSelectedTemplate,
  toggleRecipientSelection,
  selectAllRecipients,
  clearAllRecipients,
  clearSendResult,
  resetEmailForm,
} = bulkEmailSlice.actions;

export default bulkEmailSlice.reducer;
