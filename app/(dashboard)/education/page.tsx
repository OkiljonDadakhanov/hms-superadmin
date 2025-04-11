"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pagination } from "@/components/pagination";
import { useAppContext } from "@/context/app-context";
import { EducationContentForm } from "@/components/education-content-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteEducationContent } from "@/lib/api-service";
import { toast } from "@/components/ui/use-toast";
import { AssignEducationContent } from "@/components/assign-education-content";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EducationContentView } from "@/components/education-content-view";

export default function EducationPage() {
  const { educationContents, patients, refreshData } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddContentOpen, setIsAddContentOpen] = useState(false);
  const [isEditContentOpen, setIsEditContentOpen] = useState(false);
  const [isDeleteContentOpen, setIsDeleteContentOpen] = useState(false);
  const [isAssignContentOpen, setIsAssignContentOpen] = useState(false);
  const [isViewContentOpen, setIsViewContentOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const itemsPerPage = 8;
  if (!educationContents || !patients) {
    return null; // or a loading skeleton
  }

  // Filter content based on search query and category
  const filteredContents = educationContents.filter((content) => {
    const matchesSearch =
      content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.author.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      !categoryFilter || content.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredContents.length / itemsPerPage);
  const paginatedContents = filteredContents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddContent = () => {
    setIsAddContentOpen(true);
  };

  const handleEditContent = (contentId: string) => {
    setSelectedContent(contentId);
    setIsEditContentOpen(true);
  };

  const handleDeleteContent = (contentId: string) => {
    setSelectedContent(contentId);
    setIsDeleteContentOpen(true);
  };

  const handleAssignContent = (contentId: string) => {
    setSelectedContent(contentId);
    setIsAssignContentOpen(true);
  };

  const handleViewContent = (contentId: string) => {
    setSelectedContent(contentId);
    setIsViewContentOpen(true);
  };

  const confirmDeleteContent = async () => {
    if (!selectedContent) return;

    try {
      await deleteEducationContent(selectedContent);
      await refreshData("educationContents");
      toast({
        title: "Content deleted",
        description: "The education content has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete education content.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteContentOpen(false);
      setSelectedContent(null);
    }
  };

  const categories = Array.from(
    new Set(educationContents.map((content) => content.category))
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Education Content</h2>
        <Button onClick={handleAddContent}>
          <span className="mr-2">New Content</span>
          <span className="text-lg">+</span>
        </Button>
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select
          value={categoryFilter || ""}
          onValueChange={(value) => setCategoryFilter(value || null)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {paginatedContents.map((content) => {
          const assignedPatients = content.assignedTo
            ? content.assignedTo
                .map((id) => patients.find((p) => p.id === id)?.name)
                .filter(Boolean)
            : [];

          return (
            <Card key={content.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <Badge variant="outline">{content.category}</Badge>
                  <div className="text-xs text-gray-500">
                    {content.createdAt}
                  </div>
                </div>
                <CardTitle className="text-lg">{content.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {content.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-sm">By {content.author}</div>
                {assignedPatients.length > 0 && (
                  <div className="mt-2">
                    <div className="text-xs text-gray-500">Assigned to:</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {assignedPatients.slice(0, 2).map((name, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {name}
                        </Badge>
                      ))}
                      {assignedPatients.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{assignedPatients.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewContent(content.id)}
                >
                  View
                </Button>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAssignContent(content.id)}
                  >
                    Assign
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEditContent(content.id)}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13"
                        stroke="#3B82F6"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M16.04 3.02001L8.16 10.9C7.86 11.2 7.56 11.79 7.5 12.22L7.07 15.23C6.91 16.32 7.68 17.08 8.77 16.93L11.78 16.5C12.2 16.44 12.79 16.14 13.1 15.84L20.98 7.96001C22.34 6.60001 22.98 5.02001 20.98 3.02001C18.98 1.02001 17.4 1.66001 16.04 3.02001Z"
                        stroke="#3B82F6"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M14.91 4.15002C15.58 6.54002 17.45 8.41002 19.85 9.09002"
                        stroke="#3B82F6"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleDeleteContent(content.id)}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.17 14.83L14.83 9.17"
                        stroke="#EF4444"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M14.83 14.83L9.17 9.17"
                        stroke="#EF4444"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
                        stroke="#EF4444"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Add Content Dialog */}
      <Dialog open={isAddContentOpen} onOpenChange={setIsAddContentOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Add New Education Content</DialogTitle>
          </DialogHeader>
          <EducationContentForm
            onSuccess={() => {
              setIsAddContentOpen(false);
              refreshData("educationContents");
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Content Dialog */}
      <Dialog open={isEditContentOpen} onOpenChange={setIsEditContentOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Edit Education Content</DialogTitle>
          </DialogHeader>
          <EducationContentForm
            contentId={selectedContent || undefined}
            onSuccess={() => {
              setIsEditContentOpen(false);
              refreshData("educationContents");
            }}
          />
        </DialogContent>
      </Dialog>

      {/* View Content Dialog */}
      <Dialog open={isViewContentOpen} onOpenChange={setIsViewContentOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Education Content</DialogTitle>
          </DialogHeader>
          {selectedContent && (
            <EducationContentView contentId={selectedContent} />
          )}
        </DialogContent>
      </Dialog>

      {/* Assign Content Dialog */}
      <Dialog open={isAssignContentOpen} onOpenChange={setIsAssignContentOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Assign Education Content</DialogTitle>
          </DialogHeader>
          {selectedContent && (
            <AssignEducationContent
              contentId={selectedContent}
              onSuccess={() => {
                setIsAssignContentOpen(false);
                refreshData("educationContents");
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Content Alert */}
      <AlertDialog
        open={isDeleteContentOpen}
        onOpenChange={setIsDeleteContentOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              education content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteContent}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
