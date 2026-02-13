import BugItem from "@/components/BugItem";
import { BugStatus, ChecklistItem, ChecklistSection } from "@/lib/types";

type SectionCardProps = {
  section: ChecklistSection;
  items: ChecklistItem[];
  onStatusChange: (sectionId: string, itemId: string, status: BugStatus) => void;
  onDeleteItem: (sectionId: string, itemId: string) => void;
};

export default function SectionCard({ section, items, onStatusChange, onDeleteItem }: SectionCardProps) {
  return (
    <section className="flex h-[360px] flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{section.title}</h3>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          {items.length} item{items.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {items.length === 0 && <p className="text-sm text-slate-500 dark:text-slate-400">No items for current filter.</p>}
        {items.map((item) => (
          <BugItem
            key={item.id}
            item={item}
            onStatusChange={(itemId, status) => onStatusChange(section.id, itemId, status)}
            onDelete={(itemId) => onDeleteItem(section.id, itemId)}
          />
        ))}
      </div>
    </section>
  );
}
