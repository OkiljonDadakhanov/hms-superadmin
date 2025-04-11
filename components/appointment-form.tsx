"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createAppointment, fetchAppointment, updateAppointment } from "@/lib/api-service"
import { toast } from "@/components/ui/use-toast"
import { useAppContext } from "@/context/app-context"

const appointmentFormSchema = z.object({
  patientId: z.string().min(1, { message: "Patient is required." }),
  doctorId: z.string().min(1, { message: "Doctor is required." }),
  date: z.string().min(1, { message: "Date is required." }),
  time: z.string().min(1, { message: "Time is required." }),
  status: z.enum(["Scheduled", "Completed", "Cancelled"], { required_error: "Status is required." }),
  feeStatus: z.enum(["Paid", "Unpaid"], { required_error: "Fee status is required." }),
})

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>

interface AppointmentFormProps {
  appointmentId?: string
  onSuccess: () => void
}

export function AppointmentForm({ appointmentId, onSuccess }: AppointmentFormProps) {
  const { patients, doctors } = useAppContext()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      patientId: "",
      doctorId: "",
      date: "",
      time: "",
      status: "Scheduled",
      feeStatus: "Unpaid",
    },
  })

  useEffect(() => {
    if (appointmentId) {
      setIsLoading(true)
      fetchAppointment(appointmentId)
        .then((appointment) => {
          if (appointment) {
            form.reset({
              patientId: appointment.patientId,
              doctorId: appointment.doctorId,
              date: appointment.date,
              time: appointment.time,
              status: appointment.status,
              feeStatus: appointment.feeStatus || "Unpaid",
            })
          }
        })
        .catch((error) => {
          console.error("Error fetching appointment:", error)
          toast({
            title: "Error",
            description: "Failed to fetch appointment details.",
            variant: "destructive",
          })
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [appointmentId, form])

  const onSubmit = async (data: AppointmentFormValues) => {
    setIsLoading(true)
    try {
      if (appointmentId) {
        await updateAppointment(appointmentId, data)
        toast({
          title: "Appointment updated",
          description: "The appointment has been successfully updated.",
        })
      } else {
        await createAppointment(data)
        toast({
          title: "Appointment created",
          description: "The appointment has been successfully created.",
        })
      }
      onSuccess()
    } catch (error) {
      console.error("Error saving appointment:", error)
      toast({
        title: "Error",
        description: "Failed to save appointment.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="patientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Patient</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="doctorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Doctor</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      {doctor.name} ({doctor.specialization})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input placeholder="MM/DD/YYYY" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <Input placeholder="HH:MM AM/PM" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="feeStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fee Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select fee status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Unpaid">Unpaid</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : appointmentId ? "Update Appointment" : "Add Appointment"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
