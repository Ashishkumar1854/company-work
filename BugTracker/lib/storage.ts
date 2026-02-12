import { initialSections } from "./initialData";
import { ChecklistSection } from "./types";

export const BUG_TRACKER_STORAGE_KEY = "bug-tracker-sections-v1";
export const THEME_STORAGE_KEY = "bug-tracker-theme";

export function loadSections(): ChecklistSection[] {
  if (typeof window === "undefined") return initialSections;

  const raw = window.localStorage.getItem(BUG_TRACKER_STORAGE_KEY);
  if (!raw) return initialSections;

  try {
    const parsed = JSON.parse(raw) as ChecklistSection[];
    if (!Array.isArray(parsed)) return initialSections;
    return parsed;
  } catch {
    return initialSections;
  }
}

export function saveSections(sections: ChecklistSection[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(BUG_TRACKER_STORAGE_KEY, JSON.stringify(sections));
}

export function loadTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme === "dark" || storedTheme === "light") return storedTheme;

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

export function saveTheme(theme: "light" | "dark"): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
}
