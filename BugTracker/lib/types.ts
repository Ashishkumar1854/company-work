export type BugStatus = "pending" | "bug" | "resolved";

export interface ChecklistItem {
  id: string;
  title: string;
  status: BugStatus;
  createdAt: string;
}

export interface ChecklistSection {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export type StatusFilter = "all" | BugStatus;
