import { ChecklistItem, BugStatus } from "@/lib/types";

type BugItemProps = {
  item: ChecklistItem;
  onStatusChange: (itemId: string, status: BugStatus) => void;
  onDelete: (itemId: string) => void;
};

const badgeClasses: Record<BugStatus, string> = {
  pending: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  bug: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  resolved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
};

export default function BugItem({ item, onStatusChange, onDelete }: BugItemProps) {
  const createdLabel = new Date(item.createdAt).toLocaleDateString();

  return (
    <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">{item.title}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Created {createdLabel}</p>
        </div>
        <span className={`rounded-full px-2 py-1 text-xs font-semibold capitalize ${badgeClasses[item.status]}`}>
          {item.status}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <label className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-700 dark:border-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            checked={item.status === "resolved"}
            onChange={(e) => onStatusChange(item.id, e.target.checked ? "resolved" : "pending")}
            className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
          />
          Resolved
        </label>

        <button
          type="button"
          onClick={() => onStatusChange(item.id, "bug")}
          className="rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700"
        >
          Mark Bug
        </button>

        <button
          type="button"
          onClick={() => onStatusChange(item.id, "resolved")}
          className="rounded-md bg-emerald-600 px-2 py-1 text-xs font-medium text-white hover:bg-emerald-700"
        >
          Mark Resolved
        </button>

        <button
          type="button"
          onClick={() => onStatusChange(item.id, "pending")}
          className="rounded-md bg-slate-600 px-2 py-1 text-xs font-medium text-white hover:bg-slate-700"
        >
          Pending
        </button>

        <button
          type="button"
          onClick={() => onDelete(item.id)}
          className="ml-auto rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
