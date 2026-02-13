"use client";

import { FormEvent, useEffect, useState } from "react";
import { ChecklistSection } from "@/lib/types";

type AddBugModalProps = {
  isOpen: boolean;
  sections: ChecklistSection[];
  onClose: () => void;
  onAdd: (sectionId: string, title: string, newSectionTitle?: string) => void;
};

const CREATE_SECTION_VALUE = "__create_new_section__";

export default function AddBugModal({ isOpen, sections, onClose, onAdd }: AddBugModalProps) {
  const [title, setTitle] = useState("");
  const [sectionId, setSectionId] = useState(sections[0]?.id ?? "");
  const [newSectionTitle, setNewSectionTitle] = useState("");

  useEffect(() => {
    if (!sections.length) return;
    if (sectionId === CREATE_SECTION_VALUE) return;
    if (!sectionId || !sections.some((section) => section.id === sectionId)) {
      setSectionId(sections[0].id);
    }
  }, [sectionId, sections]);

  if (!isOpen) return null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedSectionTitle = newSectionTitle.trim();
    if (!trimmedTitle || !sectionId) return;
    if (sectionId === CREATE_SECTION_VALUE && !trimmedSectionTitle) return;

    onAdd(sectionId, trimmedTitle, trimmedSectionTitle);
    setTitle("");
    setNewSectionTitle("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Add Checklist Item</h2>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Section</label>
            <select
              value={sectionId}
              onChange={(e) => setSectionId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              {sections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.title}
                </option>
              ))}
              <option value={CREATE_SECTION_VALUE}>+ Create New Section</option>
            </select>
          </div>

          {sectionId === CREATE_SECTION_VALUE && (
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">New Section</label>
              <input
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
                placeholder="Example: Checkout Flow"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                required
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Describe checklist or bug item"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button type="submit" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
