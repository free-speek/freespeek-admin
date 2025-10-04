import { generateAppUpdateTemplate } from "../utils/templateGenerator";

export interface PreBuiltTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  description: string;
  category: string;
  isHtml: boolean;
}

export const preBuiltTemplates: PreBuiltTemplate[] = [
  {
    id: "app-update-notification",
    name: "App Update Required - FreeSpeek 1.1.5",
    subject:
      "Update Your FreeSpeek App - New Features & Improvements Available!",
    description:
      "Professional template to notify users to update to the latest app version",
    category: "App Updates",
    isHtml: true,
    content: generateAppUpdateTemplate(),
  },
  {
    id: "welcome-new-user",
    name: "Welcome to FreeSpeek",
    subject: "Welcome to FreeSpeek - Let's Get Started!",
    description: "Welcome email for new users joining FreeSpeek",
    category: "Welcome",
    isHtml: true,
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #02FEFE;">Welcome to FreeSpeek!</h1>
        <p>Hello {{userName}},</p>
        <p>Welcome to the FreeSpeek community! We're excited to have you on board.</p>
        <p>Get started by exploring our features and connecting with others.</p>
        <p>Best regards,<br>The FreeSpeek Team</p>
      </div>
    `,
  },
  {
    id: "password-reset",
    name: "Password Reset Request",
    subject: "Reset Your FreeSpeek Password",
    description: "Password reset email template",
    category: "Security",
    isHtml: true,
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #02FEFE;">Password Reset Request</h1>
        <p>Hello {{userName}},</p>
        <p>We received a request to reset your password. Click the link below to reset it:</p>
        <p><a href="{{resetLink}}" style="background: #02FEFE; color: #000; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>The FreeSpeek Team</p>
      </div>
    `,
  },
  {
    id: "maintenance-notice",
    name: "Scheduled Maintenance",
    subject: "FreeSpeek Scheduled Maintenance Notice",
    description: "Maintenance notification email template",
    category: "System",
    isHtml: true,
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #02FEFE;">Scheduled Maintenance Notice</h1>
        <p>Hello {{userName}},</p>
        <p>We will be performing scheduled maintenance on our servers.</p>
        <p><strong>Maintenance Window:</strong> {{maintenanceDate}} from {{startTime}} to {{endTime}}</p>
        <p>During this time, FreeSpeek may be temporarily unavailable. We apologize for any inconvenience.</p>
        <p>Best regards,<br>The FreeSpeek Team</p>
      </div>
    `,
  },
];

export const getTemplateById = (id: string) => {
  return preBuiltTemplates.find((template) => template.id === id);
};

export const getAllCategories = () => {
  const categories = Array.from(
    new Set(preBuiltTemplates.map((template) => template.category))
  );
  return categories.sort();
};
