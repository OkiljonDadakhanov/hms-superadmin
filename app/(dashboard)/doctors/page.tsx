"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Pagination } from "@/components/pagination"
import { DatePicker } from "@/components/date-picker"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppContext } from "@/context/app-context"
import { DoctorForm } from "@/components/doctor-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { deleteDoctor } from "@/lib/api-service"
import { toast } from "@/components/ui/use-toast"

export default function DoctorsPage() {
  const { doctors, refreshData } = useAppContext()
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddDoctorOpen, setIsAddDoctorOpen] = useState(false)
  const [isEditDoctorOpen, setIsEditDoctorOpen] = useState(false)
  const [isDeleteDoctorOpen, setIsDeleteDoctorOpen] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null)
  const itemsPerPage = 5

  // Filter doctors based on search query
  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.qualification.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Pagination
  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage)
  const paginatedDoctors = filteredDoctors.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleAddDoctor = () => {
    setIsAddDoctorOpen(true)
  }

  const handleEditDoctor = (doctorId: string) => {
    setSelectedDoctor(doctorId)
    setIsEditDoctorOpen(true)
  }

  const handleDeleteDoctor = (doctorId: string) => {
    setSelectedDoctor(doctorId)
    setIsDeleteDoctorOpen(true)
  }

  const confirmDeleteDoctor = async () => {
    if (!selectedDoctor) return

    try {
      await deleteDoctor(selectedDoctor)
      await refreshData("doctors")
      toast({
        title: "Doctor deleted",
        description: "The doctor has been successfully deleted.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete doctor.",
        variant: "destructive",
      })
    } finally {
      setIsDeleteDoctorOpen(false)
      setSelectedDoctor(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Doctors</h2>
        <Button onClick={handleAddDoctor}>
          <span className="mr-2">New Doctor</span>
          <span className="text-lg">+</span>
        </Button>
      </div>

      <Tabs defaultValue="doctor-info" className="w-full">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="doctor-info" className="flex-1">
            Doctor Info
          </TabsTrigger>
        </TabsList>

        <div className="flex justify-between mb-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search"
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DatePicker />
        </div>

        <TabsContent value="doctor-info" className="space-y-4">
          <div className="bg-white rounded-md shadow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Doctor Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Qualification</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Floor/Room</TableHead>
                  <TableHead>Day Off</TableHead>
                  <TableHead>User Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedDoctors.map((doctor) => (
                  <TableRow key={doctor.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={doctor.avatar} />
                          <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {doctor.name}
                      </div>
                    </TableCell>
                    <TableCell>{doctor.age}</TableCell>
                    <TableCell>{doctor.gender}</TableCell>
                    <TableCell>{doctor.qualification}</TableCell>
                    <TableCell>{doctor.phoneNumber}</TableCell>
                    <TableCell>{doctor.floorRoom}</TableCell>
                    <TableCell>{doctor.dayOff}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEditDoctor(doctor.id)}
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
                          onClick={() => handleDeleteDoctor(doctor.id)}
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Doctor Dialog */}
      <Dialog open={isAddDoctorOpen} onOpenChange={setIsAddDoctorOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Doctor</DialogTitle>
          </DialogHeader>
          <DoctorForm
            onSuccess={() => {
              setIsAddDoctorOpen(false)
              refreshData("doctors")
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Doctor Dialog */}
      <Dialog open={isEditDoctorOpen} onOpenChange={setIsEditDoctorOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Doctor</DialogTitle>
          </DialogHeader>
          <DoctorForm
            doctorId={selectedDoctor || undefined}
            onSuccess={() => {
              setIsEditDoctorOpen(false)
              refreshData("doctors")
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Doctor Alert */}
      <AlertDialog open={isDeleteDoctorOpen} onOpenChange={setIsDeleteDoctorOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the doctor and remove their data from the
              system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteDoctor} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
