"use client";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

// Token for API requests
const TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiRE9DVE9SIiwiaWQiOjEsInN1YiI6InNhbmphcjRAZ21haWwuY29tIiwiaWF0IjoxNzQ1MTU0NDYwLCJleHAiOjE3NDUyNDA4NjB9.sSgZBRKyvMp-bk40-MI-vdLDrnXzM_kdDVQPS3LfP5w";

const doctorFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  gender: z.string().min(1, { message: "Please select a gender." }),
  specialization: z.string().min(2, { message: "Specialization is required." }),
  phoneNumber: z.string().min(10, { message: "Phone number is required." }),
  room: z.string().min(1, { message: "Room is required." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  dateOfBirth: z.date({ required_error: "Date of birth is required." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." })
    .optional()
    .or(z.literal("")),
});

type DoctorFormValues = z.infer<typeof doctorFormSchema>;

interface DoctorFormProps {
  doctorId?: string;
  onSuccessAction: () => void;
}

export function DoctorForm({ doctorId, onSuccessAction }: DoctorFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [originalData, setOriginalData] = useState<any>(null);

  const form = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      name: "",
      gender: "",
      specialization: "",
      phoneNumber: "",
      room: "",
      email: "",
      dateOfBirth: undefined,
      password: "",
    },
  });

  useEffect(() => {
    if (doctorId) {
      setIsLoading(true);
      console.log(`Fetching doctor with ID: ${doctorId}`);
      // Changed the fetch URL to use the standard GET endpoint
      fetch(
        `https://33ab-90-156-197-210.ngrok-free.app/doctor/${doctorId}/profile`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        }
      )
        .then(async (response) => {
          const responseText = await response.text();
          console.log(`Response status: ${response.status}`);
          console.log(`Response body: ${responseText}`);
          if (!response.ok) {
            throw new Error(
              `Failed to fetch doctor details: ${response.status} - ${responseText}`
            );
          }
          // Parse the JSON after we've logged it
          return JSON.parse(responseText);
        })
        .then((data) => {
          console.log("Fetched doctor data:", data);

          // Store the original data for later use
          setOriginalData(data);

          // Format the date of birth to a Date object
          const dob = new Date(data.user.dateOfBirth);

          // Extract room from floorRoom if needed
          const roomValue = data.room ? `${data.room}` : "";

          form.reset({
            name: `${data.user.firstName} ${data.user.lastName}`,
            gender: data.user.gender,
            specialization: data.specialization || data.user.specialization,
            phoneNumber: data.user.phone,
            room: roomValue,
            email: data.user.email,
            dateOfBirth: dob,
            // Don't pre-fill password for security reasons
            password: "",
          });
        })
        .catch((error) => {
          console.error("Error fetching doctor:", error);
          toast({
            title: "Error",
            description: `Failed to fetch doctor details: ${error.message}`,
            variant: "destructive",
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [doctorId, form]);

  const onSubmit = async (data: DoctorFormValues) => {
    setIsLoading(true);
    try {
      // Split the name into first and last name
      const nameParts = data.name.trim().split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

      console.log("Form values being submitted:", data);

      // Prepare the request data
      const requestData: any = {
        user: {
          firstName: firstName,
          lastName: lastName,
          email: data.email,
          gender: data.gender.toUpperCase(),
          phone: data.phoneNumber,
          dateOfBirth: format(data.dateOfBirth, "yyyy-MM-dd"),
          role: "DOCTOR",
        },
        specialization: data.specialization,
        room: data.room,
      };

      // If we're editing, include the user ID from the original data
      if (doctorId && originalData && originalData.user) {
        requestData.user.id = originalData.user.id;
      }

      // Only include password if it's provided (for editing)
      if (data.password && data.password.trim()) {
        requestData.user.password = data.password;
      }

      console.log("Sending data to API:", JSON.stringify(requestData, null, 2));

      let url, method;
      if (doctorId) {
        // Update existing doctor
        url = `https://33ab-90-156-197-210.ngrok-free.app/doctor/${doctorId}/update`;
        method = "PUT";
      } else {
        // Create new doctor
        url = "https://33ab-90-156-197-210.ngrok-free.app/doctor/add";
        method = "POST";
      }

      console.log(`Sending ${method} request to ${url}`);

      // Ensure we're sending properly formatted JSON
      const jsonBody = JSON.stringify(requestData);
      console.log(`Request body: ${jsonBody}`);

      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
        body: jsonBody,
      });

      const responseText = await response.text();
      console.log(`Response status: ${response.status}`);
      console.log(`Response body: ${responseText}`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status} - ${responseText}`);
      }

      toast({
        title: doctorId ? "Doctor updated" : "Doctor created",
        description: doctorId
          ? "The doctor has been successfully updated."
          : "The doctor has been successfully created.",
      });

      onSuccessAction();
    } catch (error: any) {
      console.error("Error saving doctor:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save doctor.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Dr. John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="MALE">MALE</SelectItem>
                    <SelectItem value="FEMALE">FEMALE</SelectItem>
                    <SelectItem value="OTHER">OTHER</SelectItem>
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

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="doctor@example.com"
                    {...field}
                    disabled={!!doctorId} // Email should still be disabled in edit mode as it's the identifier
                  />
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
                  <Input placeholder="+998 33 875 13 05" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="room"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room</FormLabel>
                <FormControl>
                  <Input placeholder="23" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of Birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "yyyy-MM-dd")
                        ) : (
                          <span>Select a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {doctorId
                  ? "New Password (leave blank to keep current)"
                  : "Password"}
              </FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? "Saving..."
              : doctorId
              ? "Update Doctor"
              : "Add Doctor"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
