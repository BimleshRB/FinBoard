"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { Widget, DashboardExport } from "./types"

// add hasSeenTour state and setter to persist onboarding status
type State = {
  widgets: Widget[]
  addWidget: (w: Omit<Widget, "id">) => void
  removeWidget: (id: string) => void
  reorder: (from: number, to: number) => void
  exportConfig: () => DashboardExport
  importConfig: (data: DashboardExport) => void
  hasSeenTour: boolean
  setHasSeenTour: (v: boolean) => void
  getWidget: (id: string) => Widget | undefined
}

export const useDashboardStore = create<State>()(
  persist(
    (set, get) => ({
      // initialize onboarding flag
      hasSeenTour: false,
      setHasSeenTour: (v) => set(() => ({ hasSeenTour: v })),
      widgets: [],
      addWidget: (w) =>
        set((state) => ({
          widgets: [
            ...state.widgets,
            {
              id: Date.now().toString(),
              // ensure both title and name exist for UI/detail pages
              title: w.title || w.name || "Untitled Widget",
              name: w.name || w.title || "Untitled Widget",
              type: w.type,
              provider: w.provider,
              endpoint: w.endpoint,
              params: w.params ?? {},
              mapping: w.mapping ?? {},
              refreshMs: w.refreshMs ?? 60000,
            },
          ],
        })),
      removeWidget: (id) => set((state) => ({ widgets: state.widgets.filter((widget) => widget.id !== id) })),
      reorder: (from, to) => {
        const widgets = get().widgets
        const reorderedWidgets = Array.from(widgets)
        const [widget] = reorderedWidgets.splice(from, 1)
        reorderedWidgets.splice(to, 0, widget)
        set({ widgets: reorderedWidgets })
      },
      exportConfig: () => {
        const widgets = get().widgets
        return { widgets }
      },
      importConfig: (data) => {
        set({ widgets: (data?.widgets as any[]) || [] })
      },
      getWidget: (id: string) => get().widgets.find((w) => w.id === id),
    }),
    {
      name: "finboard-dashboard",
      storage: typeof window !== "undefined" ? createJSONStorage(() => localStorage) : undefined,
    },
  ),
)

export const useAppStore = useDashboardStore
export default useDashboardStore
