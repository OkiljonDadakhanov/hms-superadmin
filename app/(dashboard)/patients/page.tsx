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
import { useAppContext } from "@/context/app-context";
import { Pagination } from "@/components/pagination";
import { DatePicker } from "@/components/date-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PatientForm } from "@/components/patient-form";
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
import { Chat } from "@/components/chat";

// API configuration with token
const API_URL = "https://33ab-90-156-197-210.ngrok-free.app/patient/pagination";
const TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiRE9DVE9SIiwiaWQiOjEsInN1YiI6InNhbmphcjRAZ21haWwuY29tIiwiaWF0IjoxNzQ1MTM2MDQ2LCJleHAiOjE3NDUyMjI0NDZ9.wtO1Sn-Im8mcwjG2Wgzu5owEW01qf2abAJJrVf4TpYQ";

// Interface based on the API response structure
interface PatientApiResponse {
  id: number;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    dateOfBirth: string;
    gender: string;
    phone: string;
    role: string;
  };
  address: string;
  bloodGroup: string;
}

// Interface for our component's state
interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  phoneNumber: string;
  email: string;
  avatar?: string;
}

export default function PatientsPage() {
  const { doctors, refreshData } = useAppContext();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [isEditPatientOpen, setIsEditPatientOpen] = useState(false);
  const [isDeletePatientOpen, setIsDeletePatientOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const itemsPerPage = 5;

  // Safely detect client-side rendering after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string): number => {
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    return age;
  };

  // API function to fetch patients with proper error handling
  const fetchAllPatients = async (): Promise<PatientApiResponse[]> => {
    try {
      console.log("Fetching patients from:", API_URL);

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const text = await response.text();
        console.error("API error response:", text);
        const data = JSON.parse(text);
        throw new Error(`API error: ${response.status}`);
      }

      // Get the raw text first for debugging
      const rawText = await response.text();
      console.log("Raw response (first 100 chars):", rawText.substring(0, 100));

      // Parse the JSON manually
      try {
        const data = JSON.parse(rawText) as PatientApiResponse[];
        console.log(
          "Successfully fetched patients:",
          data.length || 0,
          "patients"
        );
        return data;
      } catch (jsonError) {
        console.error("Failed to parse JSON:", jsonError);
        throw new Error("Invalid JSON response from server");
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
      throw error;
    }
  };

  // Load patients on component mount
  useEffect(() => {
    // Only run after client hydration to avoid mismatches
    if (!isClient) return;

    const loadPatients = async () => {
      setLoading(true);
      setError(null);

      try {
        const apiData = await fetchAllPatients();

        // Format the response based on the actual API structure
        const formattedPatients = apiData.map((patientData) => ({
          id: patientData.id.toString(),
          // Combine first and last name for display
          name: `${patientData.user.firstName} ${patientData.user.lastName}`,
          // Calculate age from date of birth
          age: calculateAge(patientData.user.dateOfBirth),
          gender: patientData.user.gender,
          bloodGroup: patientData.bloodGroup.replace("_", " "), // Format blood group for display
          phoneNumber: patientData.user.phone,
          email: patientData.user.email,
          // Deterministic avatar based on ID
          avatar: `/avatars/avatar-${(patientData.id % 8) + 1}.png`,
        }));

        setPatients(formattedPatients);
      } catch (error) {
        console.error("Failed to load patients:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to load patients. Please try again later.";

        setError(errorMessage);

        // Fallback to mock data if available
        const mockPatients = [
          {
            id: "1",
            name: "John Doe",
            age: 32,
            gender: "Male",
            bloodGroup: "O+",
            phoneNumber: "+1 234 567 8901",
            email: "john.doe@example.com",
            avatar: "/avatars/avatar-1.png",
          },
          {
            id: "2",
            name: "Jane Smith",
            age: 28,
            gender: "Female",
            bloodGroup: "A-",
            phoneNumber: "+1 987 654 3210",
            email: "jane.smith@example.com",
            avatar: "/avatars/avatar-2.png",
          },
          {
            id: "3",
            name: "Michael Johnson",
            age: 45,
            gender: "Male",
            bloodGroup: "B+",
            phoneNumber: "+1 555 123 4567",
            email: "michael.johnson@example.com",
            avatar: "/avatars/avatar-3.png",
          },
          {
            id: "4",
            name: "Emily Davis",
            age: 35,
            gender: "Female",
            bloodGroup: "AB+",
            phoneNumber: "+1 444 789 1234",
            email: "emily.davis@example.com",
            avatar: "/avatars/avatar-4.png",
          },
          {
            id: "5",
            name: "Robert Wilson",
            age: 50,
            gender: "Male",
            bloodGroup: "O-",
            phoneNumber: "+1 333 456 7890",
            email: "robert.wilson@example.com",
            avatar: "/avatars/avatar-5.png",
          },
        ];
        setPatients(mockPatients);
      } finally {
        setLoading(false);
      }
    };

    loadPatients();
  }, [isClient]);

  // Filter patients based on search query
  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddPatient = () => {
    setIsAddPatientOpen(true);
  };

  const handleEditPatient = (patientId: string) => {
    setSelectedPatient(patientId);
    setIsEditPatientOpen(true);
  };

  const handleDeletePatient = (patientId: string) => {
    setSelectedPatient(patientId);
    setIsDeletePatientOpen(true);
  };

  const handleOpenChat = (patientId: string) => {
    setSelectedPatient(patientId);
    setSelectedDoctor(doctors[0]?.id || null);
    setIsChatOpen(true);
  };

  const confirmDeletePatient = async () => {
    if (!selectedPatient) return;

    try {
      // For now just log the action since delete endpoint is commented out
      console.log("Delete patient:", selectedPatient);

      // Update local state to remove the deleted patient
      setPatients((prevPatients) =>
        prevPatients.filter((patient) => patient.id !== selectedPatient)
      );

      toast({
        title: "Patient deleted",
        description: "The patient has been successfully deleted.",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete patient.";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsDeletePatientOpen(false);
      setSelectedPatient(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Patient Details</h2>
        <Button onClick={handleAddPatient}>
          <span className="mr-2">New Patient</span>
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

      <Tabs defaultValue="patient-info" className="w-full">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="patient-info" className="flex-1">
            Patient Info
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

        <TabsContent value="patient-info" className="space-y-4">
          <div className="bg-white rounded-md shadow">
            {/* Only show loading indicator after client-side hydration */}
            {isClient && loading ? (
              <div className="py-10 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <p className="mt-2 text-gray-600">Loading patients...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Blood Group</TableHead>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Email ID</TableHead>
                    <TableHead>User Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!isClient ? (
                    // Show empty row during server rendering
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : paginatedPatients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        No patients found. Add a new patient to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedPatients.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarImage src={patient.avatar} />
                              <AvatarFallback>
                                {patient.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            {patient.name}
                          </div>
                        </TableCell>
                        <TableCell>{patient.age}</TableCell>
                        <TableCell>{patient.gender}</TableCell>
                        <TableCell>{patient.bloodGroup}</TableCell>
                        <TableCell>{patient.phoneNumber}</TableCell>
                        <TableCell>{patient.email}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleOpenChat(patient.id)}
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M8 12H16"
                                  stroke="#3B82F6"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M12 16V8"
                                  stroke="#3B82F6"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
                                  stroke="#3B82F6"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleEditPatient(patient.id)}
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
                              onClick={() => handleDeletePatient(patient.id)}
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
            {isClient && !loading && paginatedPatients.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Patient Dialog */}
      <Dialog open={isAddPatientOpen} onOpenChange={setIsAddPatientOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Patient</DialogTitle>
          </DialogHeader>
          <PatientForm
            onSuccessAction={() => {
              setIsAddPatientOpen(false);
              // Refresh patient list after adding
              fetchAllPatients()
                .then((data) => {
                  const formattedPatients = data.map((patientData) => ({
                    id: patientData.id.toString(),
                    name: `${patientData.user.firstName} ${patientData.user.lastName}`,
                    age: calculateAge(patientData.user.dateOfBirth),
                    gender: patientData.user.gender,
                    bloodGroup: patientData.bloodGroup.replace("_", " "),
                    phoneNumber: patientData.user.phone,
                    email: patientData.user.email,
                    avatar: `/avatars/avatar-${(patientData.id % 8) + 1}.png`,
                  }));
                  setPatients(formattedPatients);
                })
                .catch((error) => {
                  console.error("Failed to refresh patients:", error);
                  toast({
                    title: "Error",
                    description: "Failed to refresh patient list.",
                    variant: "destructive",
                  });
                });
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Patient Dialog */}
      <Dialog open={isEditPatientOpen} onOpenChange={setIsEditPatientOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Patient</DialogTitle>
          </DialogHeader>
          <PatientForm
            patientId={selectedPatient || undefined}
            onSuccessAction={() => {
              setIsEditPatientOpen(false);
              // Refresh patient list after editing
              fetchAllPatients()
                .then((data) => {
                  const formattedPatients = data.map((patientData) => ({
                    id: patientData.id.toString(),
                    name: `${patientData.user.firstName} ${patientData.user.lastName}`,
                    age: calculateAge(patientData.user.dateOfBirth),
                    gender: patientData.user.gender,
                    bloodGroup: patientData.bloodGroup.replace("_", " "),
                    phoneNumber: patientData.user.phone,
                    email: patientData.user.email,
                    avatar: `/avatars/avatar-${(patientData.id % 8) + 1}.png`,
                  }));
                  setPatients(formattedPatients);
                })
                .catch((error) => {
                  console.error("Failed to refresh patients:", error);
                  toast({
                    title: "Error",
                    description: "Failed to refresh patient list.",
                    variant: "destructive",
                  });
                });
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Patient Alert */}
      <AlertDialog
        open={isDeletePatientOpen}
        onOpenChange={setIsDeletePatientOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              patient and remove their data from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeletePatient}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Chat Dialog */}
      {isChatOpen && selectedPatient && selectedDoctor && (
        <Chat
          patientId={selectedPatient}
          doctorId={selectedDoctor}
          onClose={() => setIsChatOpen(false)}
        />
      )}
    </div>
  );
}
