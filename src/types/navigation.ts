import { ReactNode } from "react";

export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  path?: string;
  children?: NavigationItem[];
  isCollapsible?: boolean;
  component?: ReactNode;
}

export interface CollapsibleNavigationItem extends NavigationItem {
  isOpen?: boolean;
  onToggle?: () => void;
}

export interface BulkEmailNavigationItem extends NavigationItem {
  id:
    | "compose"
    | "templates"
    | "my-templates"
    | "pre-built-templates"
    | "create-template"
    | "recipients"
    | "manage-recipients"
    | "add-recipient"
    | "import-csv"
    | "analytics"
    | "statistics"
    | "history"
    | "reports"
    | "settings";
  category: "compose" | "templates" | "recipients" | "analytics" | "settings";
}
