"use client"

import { useState, useEffect } from "react"
import { fetchEducationContent } from "@/lib/api-service"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

interface EducationContentViewProps {
  contentId: string
}

export function EducationContentView({ contentId }: EducationContentViewProps) {
  const [content, setContent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchEducationContent(contentId)
      .then((data) => {
        setContent(data)
      })
      .catch((error) => {
        console.error("Error fetching content:", error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [contentId])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!content) {
    return <div>Content not found</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Badge variant="outline">{content.category}</Badge>
        <div className="text-sm text-gray-500">Created: {content.createdAt}</div>
      </div>

      <h2 className="text-2xl font-bold">{content.title}</h2>
      <p className="text-gray-600">{content.description}</p>
      <div className="text-sm text-gray-500">By {content.author}</div>

      <div className="border-t pt-4 mt-4">
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content.content }} />
      </div>
    </div>
  )
}
