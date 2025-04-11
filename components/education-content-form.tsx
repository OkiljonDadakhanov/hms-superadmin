"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { createEducationContent, fetchEducationContent, updateEducationContent } from "@/lib/api-service"
import { toast } from "@/components/ui/use-toast"
import { RichTextEditor } from "@/components/rich-text-editor"

const educationContentSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  author: z.string().min(2, { message: "Author name is required." }),
  category: z.string().min(1, { message: "Category is required." }),
  content: z.string().min(50, { message: "Content must be at least 50 characters." }),
})

type EducationContentFormValues = z.infer<typeof educationContentSchema>

interface EducationContentFormProps {
  contentId?: string
  onSuccess: () => void
}

export function EducationContentForm({ contentId, onSuccess }: EducationContentFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<EducationContentFormValues>({
    resolver: zodResolver(educationContentSchema),
    defaultValues: {
      title: "",
      description: "",
      author: "",
      category: "",
      content: "",
    },
  })

  useEffect(() => {
    if (contentId) {
      setIsLoading(true)
      fetchEducationContent(contentId)
        .then((content) => {
          if (content) {
            form.reset({
              title: content.title,
              description: content.description,
              author: content.author,
              category: content.category,
              content: content.content,
            })
          }
        })
        .catch((error) => {
          console.error("Error fetching education content:", error)
          toast({
            title: "Error",
            description: "Failed to fetch education content details.",
            variant: "destructive",
          })
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [contentId, form])

  const onSubmit = async (data: EducationContentFormValues) => {
    setIsLoading(true)
    try {
      if (contentId) {
        await updateEducationContent(contentId, data)
        toast({
          title: "Content updated",
          description: "The education content has been successfully updated.",
        })
      } else {
        await createEducationContent(data)
        toast({
          title: "Content created",
          description: "The education content has been successfully created.",
        })
      }
      onSuccess()
    } catch (error) {
      console.error("Error saving education content:", error)
      toast({
        title: "Error",
        description: "Failed to save education content.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const categories = ["Nutrition", "Lifestyle", "Patient Education", "Disease Management", "Medication", "Wellness"]

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Healthy Eating Habits" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A brief description of the content"
                  className="resize-none"
                  rows={2}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author</FormLabel>
                <FormControl>
                  <Input placeholder="Dr. John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <RichTextEditor value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : contentId ? "Update Content" : "Add Content"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
