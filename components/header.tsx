"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useRef, useEffect, useState } from "react"
import { Moon, Sun, BookText } from "lucide-react"

export function DashboardHeader({
  theme,
  onToggleTheme,
  onAddWidget,
  onExport,
  onImport,
}: {
  theme: string
  onToggleTheme: () => void
  onAddWidget: () => void
  onExport: () => void
  onImport: (file: File) => void
}) {
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <header className="finboard-header sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="size-10 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
            <div className="size-6 rounded bg-white/20" aria-hidden />
          </div>
          <div>
            <h1 className="font-bold text-lg finboard-text-balance">FinBoard</h1>
            <p className="text-sm text-muted-foreground">Real-time Finance Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" asChild className="finboard-focus bg-transparent">
            <a href="/docs" aria-label="View documentation">
              <BookText className="size-4" />
              <span className="hidden sm:inline ml-2">Docs</span>
            </a>
          </Button>

          <Separator orientation="vertical" className="h-6" />

          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="finboard-focus"
          >
            {!mounted ? (
              <span className="block size-5" aria-hidden />
            ) : theme === "dark" ? (
              <Sun className="size-4" />
            ) : (
              <Moon className="size-4" />
            )}
          </Button>

          <Separator orientation="vertical" className="h-6" />

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onExport} className="finboard-focus bg-transparent">
              Export
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) onImport(f)
                if (fileRef.current) fileRef.current.value = ""
              }}
            />
            <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} className="finboard-focus">
              Import
            </Button>
            <Button onClick={onAddWidget} className="finboard-focus">
              Add Widget
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
