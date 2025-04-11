"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createPatient, fetchPatient, updatePatient } from "@/lib/api-service"
import { toast } from "@/components/ui/use-toast"

const patientFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  age: z.coerce.number().min(1, { message: "Age must be at least 1." }),
  gender: z.enum(["Male", "Female", "Other"], { required_error: "Please select a gender." }),
  bloodGroup: z.string().min(1, { message: "Blood group is required." }),
  phoneNumber: z.string().min(10, { message: "Phone number is required." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
})

type PatientFormValues = z.infer<typeof patientFormSchema>

interface PatientFormProps {
  patientId?: string
  onSuccess: () => void
}

export function PatientForm({ patientId, onSuccess }: PatientFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      name: "",
      age: 30,
      gender: "Male",
      bloodGroup: "",
      phoneNumber: "",
      email: "",
    },
  })

  useEffect(() => {
    if (patientId) {
      setIsLoading(true)
      fetchPatient(patientId)
        .then((patient) => {
          if (patient) {
            form.reset({
              name: patient.name,
              age: patient.age,
              gender: patient.gender,
              bloodGroup: patient.bloodGroup,
              phoneNumber: patient.phoneNumber,
              email: patient.email,
            })
          }
        })
        .catch((error) => {
          console.error("Error fetching patient:", error)
          toast({
            title: "Error",
            description: "Failed to fetch patient details.",
            variant: "destructive",
          })
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [patientId, form])

  const onSubmit = async (data: PatientFormValues) => {
    setIsLoading(true)
    try {
      if (patientId) {
        await updatePatient(patientId, data)
        toast({
          title: "Patient updated",
          description: "The patient has been successfully updated.",
        })
      } else {
        await createPatient(data)
        toast({
          title: "Patient created",
          description: "The patient has been successfully created.",
        })
      }
      onSuccess()
    } catch (error) {
      console.error("Error saving patient:", error)
      toast({
        title: "Error",
        description: "Failed to save patient.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const bloodGroups = ["A+ve", "A-ve", "B+ve", "B-ve", "AB+ve", "AB-ve", "O+ve", "O-ve"]

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
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
        </div>

        <FormField
          control={form.control}
          name="bloodGroup"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Blood Group</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {bloodGroups.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
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

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="john.doe@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : patientId ? "Update Patient" : "Add Patient"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
