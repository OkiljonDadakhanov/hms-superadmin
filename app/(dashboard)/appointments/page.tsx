"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAppContext } from "@/context/app-context"
import type { Appointment } from "@/types"
import { Pagination } from "@/components/pagination"
import { DatePicker } from "@/components/date-picker"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AppointmentForm } from "@/components/appointment-form"
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
import { deleteAppointment, updateAppointment } from "@/lib/api-service"
import { toast } from "@/components/ui/use-toast"

export default function AppointmentsPage() {
  const { appointments, patients, doctors, refreshData } = useAppContext()
  const [activeTab, setActiveTab] = useState("new-appointments")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddAppointmentOpen, setIsAddAppointmentOpen] = useState(false)
  const [isEditAppointmentOpen, setIsEditAppointmentOpen] = useState(false)
  const [isDeleteAppointmentOpen, setIsDeleteAppointmentOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const itemsPerPage = 5

  // Filter appointments based on tab, search query, and date
  const filteredAppointments = appointments.filter((appointment) => {
    const patient = patients.find((p) => p.id === appointment.patientId)
    const doctor = doctors.find((d) => d.id === appointment.doctorId)

    const matchesSearch =
      !searchQuery ||
      patient?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor?.name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesDate = !selectedDate || appointment.date === selectedDate.toLocaleDateString("en-US")

    if (activeTab === "new-appointments") {
      return appointment.status === "Scheduled" && matchesSearch && matchesDate
    } else {
      return appointment.status === "Completed" && matchesSearch && matchesDate
    }
  })

  // Pagination
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage)
  const paginatedAppointments = filteredAppointments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Get patient and doctor info for an appointment
  const getAppointmentDetails = (appointment: Appointment) => {
    const patient = patients.find((p) => p.id === appointment.patientId)
    const doctor = doctors.find((d) => d.id === appointment.doctorId)
    return { patient, doctor }
  }

  const handleAddAppointment = () => {
    setIsAddAppointmentOpen(true)
  }

  const handleEditAppointment = (appointmentId: string) => {
    setSelectedAppointment(appointmentId)
    setIsEditAppointmentOpen(true)
  }

  const handleDeleteAppointment = (appointmentId: string) => {
    setSelectedAppointment(appointmentId)
    setIsDeleteAppointmentOpen(true)
  }

  const handleRescheduleAppointment = (appointmentId: string) => {
    setSelectedAppointment(appointmentId)
    setIsEditAppointmentOpen(true)
  }

  const handleRequestFee = async (appointmentId: string) => {
    try {
      await updateAppointment(appointmentId, { feeStatus: "Paid" })
      await refreshData("appointments")
      toast({
        title: "Fee requested",
        description: "The fee request has been sent to the patient.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to request fee.",
        variant: "destructive",
      })
    }
  }

  const confirmDeleteAppointment = async () => {
    if (!selectedAppointment) return

    try {
      await deleteAppointment(selectedAppointment)
      await refreshData("appointments")
      toast({
        title: "Appointment deleted",
        description: "The appointment has been successfully deleted.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete appointment.",
        variant: "destructive",
      })
    } finally {
      setIsDeleteAppointmentOpen(false)
      setSelectedAppointment(null)
    }
  }

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date)
    setCurrentPage(1) // Reset to first page when filter changes
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Appointments</h2>
        <Button onClick={handleAddAppointment}>
          <span className="mr-2">New Appointment</span>
          <span className="text-lg">+</span>
        </Button>
      </div>

      <Tabs defaultValue="new-appointments" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="new-appointments">NEW APPOINTMENTS</TabsTrigger>
          <TabsTrigger value="completed-appointments">COMPLETED APPOINTMENTS</TabsTrigger>
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
          <DatePicker selectedDate={selectedDate} onSelect={handleDateChange} />
        </div>

        <TabsContent value="new-appointments" className="space-y-4">
          <div className="bg-white rounded-md shadow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>User Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedAppointments.map((appointment) => {
                  const { patient, doctor } = getAppointmentDetails(appointment)
                  return (
                    <TableRow key={appointment.id}>
                      <TableCell>{appointment.time}</TableCell>
                      <TableCell>{appointment.date}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={patient?.avatar} />
                            <AvatarFallback>{patient?.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {patient?.name}
                        </div>
                      </TableCell>
                      <TableCell>{patient?.age}</TableCell>
                      <TableCell>{doctor?.name}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-blue-500"
                            onClick={() => handleRescheduleAppointment(appointment.id)}
                          >
                            Reschedule
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="p-0 w-8 h-8"
                            onClick={() => handleDeleteAppointment(appointment.id)}
                          >
                            <X className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        </TabsContent>

        <TabsContent value="completed-appointments" className="space-y-4">
          <div className="bg-white rounded-md shadow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Fee Status</TableHead>
                  <TableHead>User Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedAppointments.map((appointment) => {
                  const { patient, doctor } = getAppointmentDetails(appointment)
                  return (
                    <TableRow key={appointment.id}>
                      <TableCell>{appointment.time}</TableCell>
                      <TableCell>{appointment.date}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={patient?.avatar} />
                            <AvatarFallback>{patient?.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {patient?.name}
                        </div>
                      </TableCell>
                      <TableCell>{patient?.age}</TableCell>
                      <TableCell>{doctor?.name}</TableCell>
                      <TableCell>
                        <Badge
                          variant={appointment.feeStatus === "Paid" ? "default" : "outline"}
                          className={
                            appointment.feeStatus === "Paid"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "text-red-800 border-red-300"
                          }
                        >
                          {appointment.feeStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-500"
                          onClick={() => handleRequestFee(appointment.id)}
                          disabled={appointment.feeStatus === "Paid"}
                        >
                          Request Fee
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Appointment Dialog */}
      <Dialog open={isAddAppointmentOpen} onOpenChange={setIsAddAppointmentOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Appointment</DialogTitle>
          </DialogHeader>
          <AppointmentForm
            onSuccess={() => {
              setIsAddAppointmentOpen(false)
              refreshData("appointments")
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Appointment Dialog */}
      <Dialog open={isEditAppointmentOpen} onOpenChange={setIsEditAppointmentOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Appointment</DialogTitle>
          </DialogHeader>
          <AppointmentForm
            appointmentId={selectedAppointment || undefined}
            onSuccess={() => {
              setIsEditAppointmentOpen(false)
              refreshData("appointments")
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Appointment Alert */}
      <AlertDialog open={isDeleteAppointmentOpen} onOpenChange={setIsDeleteAppointmentOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the appointment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteAppointment} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
