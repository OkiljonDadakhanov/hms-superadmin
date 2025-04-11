"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Pill, FlaskRoundIcon as Flask } from "lucide-react";
import { useAppContext } from "@/context/app-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AssignEducationContent } from "@/components/assign-education-content";
import { toast } from "@/components/ui/use-toast";
import { updatePatientFee } from "@/lib/api-service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PieChart } from "@/components/pie-chart";

export default function DashboardPage() {
  const {
    activityOverview,
    appointments,
    patients,
    doctors,
    educationContents,
    topMedicines,
    patientFees,
    refreshData,
  } = useAppContext();

  const [timeframe, setTimeframe] = useState("weekly");
  const [dynamicTopMedicines, setDynamicTopMedicines] = useState(topMedicines);
  const [isAssignContentOpen, setIsAssignContentOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<string | null>(null);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  useEffect(() => {
    // In a real app, this would fetch data from an API based on the timeframe
    // For this demo, we'll just modify the data slightly based on the timeframe
    if (timeframe === "daily") {
      setDynamicTopMedicines([
        { name: "Paracetamol", percentage: 30, color: "#4F46E5" },
        { name: "Vitamin Tablets", percentage: 20, color: "#10B981" },
        { name: "Antibiotics", percentage: 25, color: "#F59E0B" },
        { name: "Others", percentage: 25, color: "#6B7280" },
      ]);
    } else if (timeframe === "weekly") {
      setDynamicTopMedicines([
        { name: "Paracetamol", percentage: 35, color: "#4F46E5" },
        { name: "Vitamin Tablets", percentage: 25, color: "#10B981" },
        { name: "Antibiotics", percentage: 20, color: "#F59E0B" },
        { name: "Others", percentage: 20, color: "#6B7280" },
      ]);
    } else if (timeframe === "monthly") {
      setDynamicTopMedicines([
        { name: "Paracetamol", percentage: 40, color: "#4F46E5" },
        { name: "Vitamin Tablets", percentage: 30, color: "#10B981" },
        { name: "Antibiotics", percentage: 15, color: "#F59E0B" },
        { name: "Others", percentage: 15, color: "#6B7280" },
      ]);
    }
  }, [timeframe]);

  const handleAssignContent = (contentId: string) => {
    setSelectedContent(contentId);
    setIsAssignContentOpen(true);
  };

  const handleRequestFee = async (patientId: string) => {
    try {
      await updatePatientFee(patientId, "paid");
      toast({
        title: "Fee requested",
        description: "The fee request has been sent to the patient.",
      });
      refreshData("patientFees");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to request fee.",
        variant: "destructive",
      });
    }
  };

  // Get upcoming appointments (first 5)
  const upcomingAppointments = appointments
    .filter((a) => a.status === "Scheduled")
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Activity Overview</h2>
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activityOverview?.appointments || 0}
            </div>
            <p className="text-xs text-gray-500">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">New Patients</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activityOverview?.newPatients || 0}
            </div>
            <p className="text-xs text-gray-500">+8% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Medicines Sold
            </CardTitle>
            <Pill className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activityOverview?.medicinesSold || 0}
            </div>
            <p className="text-xs text-gray-500">+15% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Lab Tests</CardTitle>
            <Flask className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activityOverview?.labTests || 0}
            </div>
            <p className="text-xs text-gray-500">+5% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-500"
                onClick={() => (window.location.href = "/appointments")}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="new-appointments">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="new-appointments">
                  NEW APPOINTMENTS
                </TabsTrigger>
                <TabsTrigger value="completed-appointments">
                  COMPLETED APPOINTMENTS
                </TabsTrigger>
              </TabsList>
              <TabsContent value="new-appointments">
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => {
                    const patient = patients.find(
                      (p) => p.id === appointment.patientId
                    );
                    const doctor = doctors.find(
                      (d) => d.id === appointment.doctorId
                    );

                    return (
                      <div
                        key={appointment.id}
                        className="flex items-center justify-between py-2"
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={patient?.avatar} />
                            <AvatarFallback>
                              {patient?.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{patient?.name}</div>
                            <div className="text-xs text-gray-500">
                              {appointment.time} | {appointment.date}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm">{doctor?.name}</div>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
              <TabsContent value="completed-appointments">
                <div className="space-y-4">
                  {appointments
                    .filter((a) => a.status === "Completed")
                    .slice(0, 5)
                    .map((appointment) => {
                      const patient = patients.find(
                        (p) => p.id === appointment.patientId
                      );
                      const doctor = doctors.find(
                        (d) => d.id === appointment.doctorId
                      );

                      return (
                        <div
                          key={appointment.id}
                          className="flex items-center justify-between py-2"
                        >
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={patient?.avatar} />
                              <AvatarFallback>
                                {patient?.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{patient?.name}</div>
                              <div className="text-xs text-gray-500">
                                {appointment.time} | {appointment.date}
                              </div>
                            </div>
                          </div>
                          <div className="text-sm">{doctor?.name}</div>
                        </div>
                      );
                    })}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Education Content</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-500"
                onClick={() => (window.location.href = "/education")}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {educationContents.slice(0, 4).map((content) => (
                <div
                  key={content.id}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={content.thumbnail} />
                      <AvatarFallback>{content.title.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{content.title}</div>
                      <div className="text-xs text-gray-500">
                        By {content.author}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAssignContent(content.id)}
                  >
                    Assign
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Top Medicines Sold</CardTitle>
            <div className="text-xs text-gray-500">
              {timeframe === "weekly"
                ? "Weekly"
                : timeframe === "monthly"
                ? "Monthly"
                : "Daily"}
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <PieChart data={dynamicTopMedicines} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Patient Fee</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {patientFees.map((fee) => {
                const patient = patients.find((p) => p.id === fee.patientId);

                return (
                  <div
                    key={fee.patientId}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={patient?.avatar} />
                        <AvatarFallback>
                          {patient?.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{patient?.name}</div>
                        <div className="text-xs text-gray-500">
                          {fee.status === "pending"
                            ? "Payment pending"
                            : "Payment completed"}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRequestFee(fee.patientId)}
                      disabled={fee.status === "paid"}
                    >
                      Request Fee
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

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
    </div>
  );
}
