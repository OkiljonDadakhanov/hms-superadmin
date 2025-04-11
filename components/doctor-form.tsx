"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createDoctor, fetchDoctor, updateDoctor } from "@/lib/api-service"
import { toast } from "@/components/ui/use-toast"

const doctorFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  age: z.coerce.number().min(18, { message: "Age must be at least 18." }),
  gender: z.enum(["Male", "Female", "Other"], { required_error: "Please select a gender." }),
  specialization: z.string().min(2, { message: "Specialization is required." }),
  qualification: z.string().min(2, { message: "Qualification is required." }),
  phoneNumber: z.string().min(10, { message: "Phone number is required." }),
  floorRoom: z.string().min(1, { message: "Floor/Room is required." }),
  dayOff: z.string().min(1, { message: "Day off is required." }),
})

type DoctorFormValues = z.infer<typeof doctorFormSchema>

interface DoctorFormProps {
  doctorId?: string
  onSuccess: () => void
}

export function DoctorForm({ doctorId, onSuccess }: DoctorFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      name: "",
      age: 30,
      gender: "Male",
      specialization: "",
      qualification: "",
      phoneNumber: "",
      floorRoom: "",
      dayOff: "",
    },
  })

  useEffect(() => {
    if (doctorId) {
      setIsLoading(true)
      fetchDoctor(doctorId)
        .then((doctor) => {
          if (doctor) {
            form.reset({
              name: doctor.name,
              age: doctor.age,
              gender: doctor.gender,
              specialization: doctor.specialization,
              qualification: doctor.qualification,
              phoneNumber: doctor.phoneNumber,
              floorRoom: doctor.floorRoom,
              dayOff: doctor.dayOff,
            })
          }
        })
        .catch((error) => {
          console.error("Error fetching doctor:", error)
          toast({
            title: "Error",
            description: "Failed to fetch doctor details.",
            variant: "destructive",
          })
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [doctorId, form])

  const onSubmit = async (data: DoctorFormValues) => {
    setIsLoading(true)
    try {
      if (doctorId) {
        await updateDoctor(doctorId, data)
        toast({
          title: "Doctor updated",
          description: "The doctor has been successfully updated.",
        })
      } else {
        await createDoctor(data)
        toast({
          title: "Doctor created",
          description: "The doctor has been successfully created.",
        })
      }
      onSuccess()
    } catch (error) {
      console.error("Error saving doctor:", error)
      toast({
        title: "Error",
        description: "Failed to save doctor.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Dr. John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="specialization"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Specialization</FormLabel>
                <FormControl>
                  <Input placeholder="Cardiologist" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="qualification"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Qualification</FormLabel>
              <FormControl>
                <Input placeholder="MBBS, MD" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="+91 12345 67890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="floorRoom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Floor/Room</FormLabel>
                <FormControl>
                  <Input placeholder="1/219" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dayOff"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Day Off</FormLabel>
                <FormControl>
                  <Input placeholder="Sun & Govt. Holiday" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : doctorId ? "Update Doctor" : "Add Doctor"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
