"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pagination } from "@/components/pagination";
import { DatePicker } from "@/components/date-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppContext } from "@/context/app-context";
import { DoctorForm } from "@/components/doctor-form";
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
import { toast } from "@/components/ui/use-toast";

// API configuration with token
const API_URL = "https://33ab-90-156-197-210.ngrok-free.app/doctor/get";
const TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiRE9DVE9SIiwiaWQiOjEsInN1YiI6InNhbmphcjRAZ21haWwuY29tIiwiaWF0IjoxNzQ1MTU0NDYwLCJleHAiOjE3NDUyNDA4NjB9.sSgZBRKyvMp-bk40-MI-vdLDrnXzM_kdDVQPS3LfP5w";

// Interface for doctor API response
interface DoctorApiResponse {
  id: number;
  user: {
    specialization: any;
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
    gender: string;
    phone: string;
    role: string;
  };
  specialty: string;
  specialization: string;
  experience: number;
  floor: number;
  room: number;
  dateOfBirth: string;
}

// Interface for our component's state
interface Doctor {
  id: string;
  name: string;
  gender: string;
  specialization: string;
  phoneNumber: string;
  floorRoom: string;
  dateOfBirth: string;
  avatar?: string;
}

export default function DoctorsPage() {
  const { refreshData } = useAppContext();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddDoctorOpen, setIsAddDoctorOpen] = useState(false);
  const [isEditDoctorOpen, setIsEditDoctorOpen] = useState(false);
  const [isDeleteDoctorOpen, setIsDeleteDoctorOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const itemsPerPage = 5;

  // Safely detect client-side rendering after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // API function to fetch doctors with proper error handling
  const fetchAllDoctors = async (): Promise<DoctorApiResponse[]> => {
    try {
      console.log("Fetching doctors from:", API_URL);

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
      });

      console.log("Response doctors status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error response:", errorText);
        throw new Error(`API error: ${response.status}`);
      }

      // Get the raw text first for debugging
      const rawText = await response.text();
      console.log("Raw response (first 100 chars):", rawText.substring(0, 100));

      // Parse the JSON manually
      try {
        const data = JSON.parse(rawText) as DoctorApiResponse[];
        console.log(
          "Successfully fetched doctors:",
          data.length || 0,
          "doctors"
        );
        return data;
      } catch (jsonError) {
        console.error("Failed to parse JSON:", jsonError);
        throw new Error("Invalid JSON response from server");
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      throw error;
    }
  };

  // Delete doctor function with fixed endpoint
  const deleteDoctorFromApi = async (doctorId: string): Promise<void> => {
    try {
      console.log(`Attempting to delete doctor with ID: ${doctorId}`);

      // Updated to use the correct delete endpoint
      const url = `https://33ab-90-156-197-210.ngrok-free.app/doctor/${doctorId}/delete`;
      console.log(`Sending DELETE request to: ${url}`);

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
      });

      const responseText = await response.text();
      console.log(`Delete response status: ${response.status}`);
      console.log(`Delete response body: ${responseText}`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status} - ${responseText}`);
      }

      console.log("Doctor deleted successfully");
      return;
    } catch (error) {
      console.error("Error deleting doctor:", error);
      throw error;
    }
  };

  // Load doctors on component mount
  useEffect(() => {
    // Only run after client hydration to avoid mismatches
    if (!isClient) return;

    const loadDoctors = async () => {
      setLoading(true);
      setError(null);

      try {
        const apiData = await fetchAllDoctors();

        // Format the response based on the actual API structure
        const formattedDoctors = apiData.map((doctorData) => ({
          id: doctorData.id.toString(),
          // Combine first and last name for display
          name: `${doctorData.user.firstName} ${doctorData.user.lastName}`,
          // Calculate age from date of birth
          gender: doctorData.user.gender,
          specialization:
            doctorData.specialization || doctorData.user.specialization,
          phoneNumber: doctorData.user.phone,
          floorRoom: ` Room ${doctorData.room}`,
          dateOfBirth: doctorData.user.dateOfBirth || "Not provided",
          // Deterministic avatar based on ID
          avatar: `/avatars/doctor-${(doctorData.id % 8) + 1}.png`,
        }));

        setDoctors(formattedDoctors);
      } catch (error: any) {
        console.error("Failed to load doctors:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to load doctors. Please try again later.";

        setError(errorMessage);

        // Fallback to mock data if available
        const mockDoctors = [
          {
            id: "1",
            name: "Dr. John Smith",
            age: 45,
            gender: "Male",
            qualification: "MD, Cardiology",
            specialization: "Cardiology",
            phoneNumber: "+1 234 567 8901",
            floorRoom: "Floor 2, Room 201",

            dayOff: "Sunday",
            avatar: "/avatars/doctor-1.png",
          },
          {
            id: "2",
            name: "Dr. Sarah Johnson",
            age: 38,
            gender: "Female",
            qualification: "MD, Pediatrics",
            specialization: "Pediatrics",
            phoneNumber: "+1 987 654 3210",
            floorRoom: "Floor 1, Room 105",
            dayOff: "Saturday",
            avatar: "/avatars/doctor-2.png",
          },
          {
            id: "3",
            name: "Dr. Michael Chen",
            age: 42,
            gender: "Male",
            qualification: "MD, PhD, Neurology",
            specialization: "Neurology",
            phoneNumber: "+1 555 123 4567",
            floorRoom: "Floor 3, Room 302",
            dayOff: "Friday",
            avatar: "/avatars/doctor-3.png",
          },
        ];
      } finally {
        setLoading(false);
      }
    };

    loadDoctors();
  }, [isClient, refreshData]);

  // Filter doctors based on search query
  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);
  const paginatedDoctors = filteredDoctors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddDoctor = () => {
    setIsAddDoctorOpen(true);
  };

  const handleEditDoctor = (doctorId: string) => {
    setSelectedDoctor(doctorId);
    setIsEditDoctorOpen(true);
  };

  const handleDeleteDoctor = (doctorId: string) => {
    setSelectedDoctor(doctorId);
    setIsDeleteDoctorOpen(true);
  };

  const confirmDeleteDoctor = async () => {
    if (!selectedDoctor) return;

    try {
      setIsDeleting(true);
      await deleteDoctorFromApi(selectedDoctor);

      // Update local state to remove the deleted doctor
      setDoctors((prevDoctors) =>
        prevDoctors.filter((doctor) => doctor.id !== selectedDoctor)
      );

      toast({
        title: "Doctor deleted",
        description: "The doctor has been successfully deleted.",
      });
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete doctor.";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDoctorOpen(false);
      setSelectedDoctor(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Doctors</h2>
        <Button onClick={handleAddDoctor}>
          <span className="mr-2">New Doctor</span>
          <span className="text-lg">+</span>
        </Button>
      </div>

      {isClient && error && (
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

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
            {isClient && loading ? (
              <div className="py-10 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <p className="mt-2 text-gray-600">Loading doctors...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Doctor Name</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Date of Birth</TableHead>
                    <TableHead>User Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!isClient ? (
                    // Show empty row during server rendering
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : paginatedDoctors.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-6">
                        No doctors found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedDoctors.map((doctor) => (
                      <TableRow key={doctor.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarImage src={doctor.avatar} />
                              <AvatarFallback>
                                {doctor.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            {doctor.name}
                          </div>
                        </TableCell>
                        <TableCell>{doctor.gender}</TableCell>
                        <TableCell>{doctor.specialization}</TableCell>
                        <TableCell>{doctor.phoneNumber}</TableCell>
                        <TableCell>{doctor.floorRoom}</TableCell>
                        <TableCell>{doctor.dateOfBirth}</TableCell>
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
                    ))
                  )}
                </TableBody>
              </Table>
            )}
            {isClient && !loading && paginatedDoctors.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
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
            onSuccessAction={() => {
              setIsAddDoctorOpen(false);
              // Refresh doctors list after adding
              fetchAllDoctors()
                .then((data) => {
                  const formattedDoctors = data.map((doctorData) => ({
                    id: doctorData.id.toString(),
                    name: `${doctorData.user.firstName} ${doctorData.user.lastName}`,
                    gender: doctorData.user.gender,
                    specialization:
                      doctorData.specialization ||
                      doctorData.user.specialization,
                    phoneNumber: doctorData.user.phone,
                    floorRoom: `Room ${doctorData.room}`,

                    dateOfBirth: doctorData.user.dateOfBirth || "Not provided",
                    avatar: `/avatars/doctor-${(doctorData.id % 8) + 1}.png`,
                  }));
                  setDoctors(formattedDoctors);
                })
                .catch((error) => {
                  console.error("Failed to refresh doctors:", error);
                  toast({
                    title: "Error",
                    description: "Failed to refresh doctor list.",
                    variant: "destructive",
                  });
                });
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
            onSuccessAction={() => {
              setIsEditDoctorOpen(false);
              // Refresh doctors list after editing
              fetchAllDoctors()
                .then((data) => {
                  const formattedDoctors = data.map((doctorData) => ({
                    id: doctorData.id.toString(),
                    name: `${doctorData.user.firstName} ${doctorData.user.lastName}`,
                    gender: doctorData.user.gender,
                    specialization:
                      doctorData.specialization ||
                      doctorData.user.specialization,
                    phoneNumber: doctorData.user.phone,
                    floorRoom: ` Room ${doctorData.room}`,

                    dateOfBirth: doctorData.user.dateOfBirth || "Not provided",
                    avatar: `/avatars/doctor-${(doctorData.id % 8) + 1}.png`,
                  }));
                  setDoctors(formattedDoctors);
                })
                .catch((error) => {
                  console.error("Failed to refresh doctors:", error);
                  toast({
                    title: "Error",
                    description: "Failed to refresh doctor list.",
                    variant: "destructive",
                  });
                });
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Doctor Alert */}
      <AlertDialog
        open={isDeleteDoctorOpen}
        onOpenChange={setIsDeleteDoctorOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              doctor and remove their data from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteDoctor}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
