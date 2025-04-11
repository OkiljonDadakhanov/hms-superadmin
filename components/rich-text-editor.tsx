"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Bold, Italic, List, ListOrdered, Heading1, Heading2, Heading3 } from "lucide-react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [selection, setSelection] = useState<{ start: number; end: number } | null>(null)

  const handleTextareaSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement
    setSelection({
      start: target.selectionStart,
      end: target.selectionEnd,
    })
  }

  const insertTag = (startTag: string, endTag = "") => {
    if (!selection) return

    const newText =
      value.substring(0, selection.start) +
      startTag +
      value.substring(selection.start, selection.end) +
      endTag +
      value.substring(selection.end)

    onChange(newText)
  }

  return (
    <div className="border rounded-md">
      <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50">
        <Button type="button" variant="ghost" size="sm" onClick={() => insertTag("<h1>", "</h1>")} title="Heading 1">
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => insertTag("<h2>", "</h2>")} title="Heading 2">
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => insertTag("<h3>", "</h3>")} title="Heading 3">
          <Heading3 className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <Button type="button" variant="ghost" size="sm" onClick={() => insertTag("<strong>", "</strong>")} title="Bold">
          <Bold className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => insertTag("<em>", "</em>")} title="Italic">
          <Italic className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertTag("<ul>\n  <li>", "</li>\n</ul>")}
          title="Unordered List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertTag("<ol>\n  <li>", "</li>\n</ol>")}
          title="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onSelect={handleTextareaSelect}
        className="min-h-[300px] border-0 rounded-t-none focus-visible:ring-0 resize-y"
        placeholder="Enter content here. You can use HTML tags for formatting."
      />
    </div>
  )
}
