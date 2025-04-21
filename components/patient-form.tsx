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
  "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiRE9DVE9SIiwiaWQiOjEsInN1YiI6InNhbmphcjRAZ21haWwuY29tIiwiaWF0IjoxNzQ1MTM2MDQ2LCJleHAiOjE3NDUyMjI0NDZ9.wtO1Sn-Im8mcwjG2Wgzu5owEW01qf2abAJJrVf4TpYQ";

// The schema should match the expected API structure
const patientFormSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters." }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." })
    .optional(), // Make password optional for updates
  dateOfBirth: z.date({ required_error: "Date of birth is required." }),
  gender: z.string().min(1, { message: "Please select a gender." }),
  phone: z.string().min(10, { message: "Phone number is required." }),
  address: z.string().min(5, { message: "Address is required." }),
  bloodGroup: z.string().min(1, { message: "Blood group is required." }),
});

type PatientFormValues = z.infer<typeof patientFormSchema>;

interface PatientFormProps {
  patientId?: string;
  onSuccessAction: () => void;
}

// Define a TypeScript interface for the user object
interface UserData {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  role: string;
}

export function PatientForm({ patientId, onSuccessAction }: PatientFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [originalData, setOriginalData] = useState<any>(null);

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      dateOfBirth: undefined,
      gender: "",
      phone: "",
      address: "",
      bloodGroup: "",
    },
  });

  useEffect(() => {
    if (patientId) {
      setIsLoading(true);
      console.log(`Fetching patient with ID: ${patientId}`);

      // Fetch patient details from API
      fetch(
        `https://33ab-90-156-197-210.ngrok-free.app/patient/${patientId}/profile`,
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
              `Failed to fetch patient details: ${response.status} - ${responseText}`
            );
          }

          // Parse the JSON after we've logged it
          return JSON.parse(responseText);
        })
        .then((data) => {
          console.log("Fetched patient data:", data);

          // Store the original data for later use
          setOriginalData(data);

          // Format the date of birth to a Date object
          const dob = new Date(data.user.dateOfBirth);

          form.reset({
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            email: data.user.email,
            // Don't pre-fill password for security
            password: undefined,
            dateOfBirth: dob,
            gender: data.user.gender,
            phone: data.user.phone,
            address: data.address,
            bloodGroup: data.bloodGroup,
          });
        })
        .catch((error) => {
          console.error("Error fetching patient:", error);
          toast({
            title: "Error",
            description: `Failed to fetch patient details: ${error.message}`,
            variant: "destructive",
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [patientId, form]);

  const onSubmit = async (data: PatientFormValues) => {
    setIsLoading(true);
    try {
      console.log("Form values being submitted:", data);

      // Create a properly typed user object
      const user: UserData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        dateOfBirth: format(data.dateOfBirth, "yyyy-MM-dd"),
        gender: data.gender.toUpperCase(),
        phone: data.phone,
        role: "PATIENT",
      };

      // Only add password if provided
      if (data.password) {
        user.password = data.password;
      }

      // If we're editing, include the user ID from the original data
      if (
        patientId &&
        originalData &&
        originalData.user &&
        originalData.user.id
      ) {
        user.id = originalData.user.id;
      }

      // Prepare the request data in the expected format
      const requestData = {
        user: user,
        address: data.address,
        bloodGroup: data.bloodGroup,
      };

      console.log("Sending data to API:", JSON.stringify(requestData, null, 2));

      let url, method;
      if (patientId) {
        // Update existing patient
        url = `https://33ab-90-156-197-210.ngrok-free.app/patient/${patientId}/update`;
        method = "PUT";
      } else {
        // Create new patient - use the sign-up endpoint
        url = "https://33ab-90-156-197-210.ngrok-free.app/auth/sign-up";
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
        title: patientId ? "Patient updated" : "Patient created",
        description: patientId
          ? "The patient has been successfully updated."
          : "The patient has been successfully created.",
      });

      onSuccessAction();
    } catch (error: any) {
      console.error("Error saving patient:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save patient.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Mapping for blood group selection
  const bloodGroups = [
    { value: "A_POSITIVE", label: "A+ve" },
    { value: "A_NEGATIVE", label: "A-ve" },
    { value: "B_POSITIVE", label: "B+ve" },
    { value: "B_NEGATIVE", label: "B-ve" },
    { value: "AB_POSITIVE", label: "AB+ve" },
    { value: "AB_NEGATIVE", label: "AB-ve" },
    { value: "O_POSITIVE", label: "O+ve" },
    { value: "O_NEGATIVE", label: "O-ve" },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
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
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
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

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="bloodGroup"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Blood Group</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {bloodGroups.map((group) => (
                      <SelectItem key={group.value} value={group.value}>
                        {group.label}
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
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+1234567890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input
                  placeholder="123 Main Street, City, Country"
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="john.doe@example.com"
                    {...field}
                    disabled={!!patientId} // Disable email editing in update mode
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {patientId
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
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? "Saving..."
              : patientId
              ? "Update Patient"
              : "Add Patient"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
