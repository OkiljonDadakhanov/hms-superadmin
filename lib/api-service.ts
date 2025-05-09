import type {
  Patient,
  Doctor,
  Appointment,
  Message,
  MedicineProduct,
  EducationContent,
  ActivityOverview,
  TopMedicine,
  PatientFee,
} from "@/types";
import {
  patients as mockPatients,
  doctors as mockDoctors,
  appointments as mockAppointments,
  messages as mockMessages,
  medicineProducts as mockMedicineProducts,
  educationContents as mockEducationContents,
  activityOverview as mockActivityOverview,
  topMedicines as mockTopMedicines,
  patientFees as mockPatientFees,
} from "./mock-data";

// This service will be used when integrating with a real API
// For now, it uses the mock data

// Patients API
export const fetchPatients = async (): Promise<Patient[]> => {
  // In a real app, this would be:
  // const response = await fetch('/api/patients')
  // return response.json()

  return new Promise((resolve) => {
    setTimeout(() => resolve([...mockPatients]), 500);
  });
};

export const fetchPatient = async (
  id: string
): Promise<Patient | undefined> => {
  // In a real app, this would be:
  // const response = await fetch(`/api/patients/${id}`)
  // return response.json()

  return new Promise((resolve) => {
    setTimeout(() => resolve(mockPatients.find((p) => p.id === id)), 500);
  });
};

// Update createPatient function
export const createPatient = async (
  patient: Omit<Patient, "id" | "avatar">
): Promise<Patient> => {
  return new Promise((resolve) => {
    const newPatient = {
      ...patient,
      id: `p${mockPatients.length + 1}`,
      avatar: "/placeholder.svg",
    };
    mockPatients.push(newPatient);
    setTimeout(() => resolve(newPatient), 500);
  });
};

// Update updatePatient function
export const updatePatient = async (
  id: string,
  data: Partial<Patient>
): Promise<Patient> => {
  return new Promise((resolve, reject) => {
    const patientIndex = mockPatients.findIndex((p) => p.id === id);
    if (patientIndex === -1) {
      reject(new Error("Patient not found"));
      return;
    }

    const updatedPatient = {
      ...mockPatients[patientIndex],
      ...data,
    };
    mockPatients[patientIndex] = updatedPatient;

    setTimeout(() => resolve(updatedPatient), 500);
  });
};

// Update deletePatient function
export const deletePatient = async (id: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const patientIndex = mockPatients.findIndex((p) => p.id === id);
    if (patientIndex === -1) {
      reject(new Error("Patient not found"));
      return;
    }
    mockPatients.splice(patientIndex, 1);
    setTimeout(() => resolve(true), 500);
  });
};

// Doctors API
export const fetchDoctors = async (): Promise<Doctor[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...mockDoctors]), 500);
  });
};

export const fetchDoctor = async (id: string): Promise<Doctor | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockDoctors.find((d) => d.id === id)), 500);
  });
};

// Update createDoctor function
export const createDoctor = async (
  doctor: Omit<Doctor, "id" | "avatar">
): Promise<Doctor> => {
  return new Promise((resolve) => {
    const newDoctor = {
      ...doctor,
      id: `d${mockDoctors.length + 1}`,
      avatar: "/placeholder.svg",
    };
    mockDoctors.push(newDoctor);
    setTimeout(() => resolve(newDoctor), 500);
  });
};

// Update updateDoctor function
export const updateDoctor = async (
  id: string,
  data: Partial<Doctor>
): Promise<Doctor> => {
  return new Promise((resolve, reject) => {
    const doctorIndex = mockDoctors.findIndex((d) => d.id === id);
    if (doctorIndex === -1) {
      reject(new Error("Doctor not found"));
      return;
    }

    const updatedDoctor = {
      ...mockDoctors[doctorIndex],
      ...data,
    };
    mockDoctors[doctorIndex] = updatedDoctor;

    setTimeout(() => resolve(updatedDoctor), 500);
  });
};

// Update deleteDoctor function
export const deleteDoctor = async (id: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const doctorIndex = mockDoctors.findIndex((d) => d.id === id);
    if (doctorIndex === -1) {
      reject(new Error("Doctor not found"));
      return;
    }
    mockDoctors.splice(doctorIndex, 1);
    setTimeout(() => resolve(true), 500);
  });
};

// Appointments API
export const fetchAppointments = async (): Promise<Appointment[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...mockAppointments]), 500);
  });
};

export const fetchAppointment = async (
  id: string
): Promise<Appointment | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockAppointments.find((a) => a.id === id)), 500);
  });
};

// Update createAppointment function
export const createAppointment = async (
  appointment: Omit<Appointment, "id">
): Promise<Appointment> => {
  return new Promise((resolve) => {
    const newAppointment = {
      ...appointment,
      id: `a${mockAppointments.length + 1}`,
    };
    mockAppointments.push(newAppointment);
    setTimeout(() => resolve(newAppointment), 500);
  });
};

// Update updateAppointment function
export const updateAppointment = async (
  id: string,
  data: Partial<Appointment>
): Promise<Appointment> => {
  return new Promise((resolve, reject) => {
    const appointmentIndex = mockAppointments.findIndex((a) => a.id === id);
    if (appointmentIndex === -1) {
      reject(new Error("Appointment not found"));
      return;
    }

    const updatedAppointment = {
      ...mockAppointments[appointmentIndex],
      ...data,
    };
    mockAppointments[appointmentIndex] = updatedAppointment;

    setTimeout(() => resolve(updatedAppointment), 500);
  });
};

// Update deleteAppointment function
export const deleteAppointment = async (id: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const appointmentIndex = mockAppointments.findIndex((a) => a.id === id);
    if (appointmentIndex === -1) {
      reject(new Error("Appointment not found"));
      return;
    }
    mockAppointments.splice(appointmentIndex, 1);
    setTimeout(() => resolve(true), 500);
  });
};

// Messages API
export const fetchMessages = async (userId?: string): Promise<Message[]> => {
  return new Promise((resolve) => {
    if (userId) {
      const userMessages = mockMessages.filter(
        (m) => m.senderId === userId || m.receiverId === userId
      );
      setTimeout(() => resolve([...userMessages]), 500);
    } else {
      setTimeout(() => resolve([...mockMessages]), 500);
    }
  });
};

export const sendMessage = async (
  message: Omit<Message, "id">
): Promise<Message> => {
  return new Promise((resolve) => {
    const newMessage = {
      ...message,
      id: `m${mockMessages.length + 1}`,
    };
    setTimeout(() => resolve(newMessage), 500);
  });
};

// Medicine Products API
export const fetchMedicineProducts = async (): Promise<MedicineProduct[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...mockMedicineProducts]), 500);
  });
};

export const fetchMedicineProduct = async (
  id: string
): Promise<MedicineProduct | undefined> => {
  return new Promise((resolve) => {
    setTimeout(
      () => resolve(mockMedicineProducts.find((p) => p.id === id)),
      500
    );
  });
};

// Update createMedicineProduct function
export const createMedicineProduct = async (
  product: Omit<MedicineProduct, "id">
): Promise<MedicineProduct> => {
  return new Promise((resolve) => {
    const newProduct = {
      ...product,
      id: `med${mockMedicineProducts.length + 1}`,
    };
    mockMedicineProducts.push(newProduct);
    setTimeout(() => resolve(newProduct), 500);
  });
};

// Update updateMedicineProduct function
export const updateMedicineProduct = async (
  id: string,
  data: Partial<MedicineProduct>
): Promise<MedicineProduct> => {
  return new Promise((resolve, reject) => {
    const productIndex = mockMedicineProducts.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      reject(new Error("Product not found"));
      return;
    }

    const updatedProduct = {
      ...mockMedicineProducts[productIndex],
      ...data,
    };
    mockMedicineProducts[productIndex] = updatedProduct;

    setTimeout(() => resolve(updatedProduct), 500);
  });
};

// Update deleteMedicineProduct function
export const deleteMedicineProduct = async (id: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const productIndex = mockMedicineProducts.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      reject(new Error("Product not found"));
      return;
    }
    mockMedicineProducts.splice(productIndex, 1);
    setTimeout(() => resolve(true), 500);
  });
};

// Education Content API
export const createEducationContent = async (
  content: Omit<EducationContent, "id" | "createdAt" | "thumbnail">
): Promise<EducationContent> => {
  return new Promise((resolve) => {
    const newContent = {
      ...content,
      id: `ec${mockEducationContents.length + 1}`,
      createdAt: new Date().toISOString().split("T")[0],
      thumbnail: "/placeholder.svg",
      assignedTo: [],
    };

    // Add this line to actually add the content to the array
    mockEducationContents.push(newContent);

    setTimeout(() => resolve(newContent), 500);
  });
};

export const fetchEducationContents = async (): Promise<EducationContent[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...mockEducationContents]), 500);
  });
};

export const fetchEducationContent = async (
  id: string
): Promise<EducationContent | undefined> => {
  return new Promise((resolve) => {
    setTimeout(
      () => resolve(mockEducationContents.find((c) => c.id === id)),
      500
    );
  });
};

export const updateEducationContent = async (
  id: string,
  data: Partial<EducationContent>
): Promise<EducationContent> => {
  return new Promise((resolve, reject) => {
    const contentIndex = mockEducationContents.findIndex((c) => c.id === id);
    if (contentIndex === -1) {
      reject(new Error("Content not found"));
      return;
    }

    const updatedContent = {
      ...mockEducationContents[contentIndex],
      ...data,
    };

    // Add this line to update the content in the array
    mockEducationContents[contentIndex] = updatedContent;

    setTimeout(() => resolve(updatedContent), 500);
  });
};

export const deleteEducationContent = async (id: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const contentIndex = mockEducationContents.findIndex((c) => c.id === id);
    if (contentIndex === -1) {
      reject(new Error("Content not found"));
      return;
    }

    // Remove the content from the array
    mockEducationContents.splice(contentIndex, 1);

    setTimeout(() => resolve(true), 500);
  });
};

export const assignEducationContent = async (
  contentId: string,
  patientIds: string[]
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const contentIndex = mockEducationContents.findIndex(
      (c) => c.id === contentId
    );
    if (contentIndex === -1) {
      reject(new Error("Content not found"));
      return;
    }

    // Update the assignedTo property
    mockEducationContents[contentIndex].assignedTo = patientIds;

    setTimeout(() => resolve(true), 500);
  });
};

// Dashboard API
export const fetchActivityOverview = async (): Promise<ActivityOverview> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ ...mockActivityOverview }), 500);
  });
};

export const fetchTopMedicines = async (): Promise<TopMedicine[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...mockTopMedicines]), 500);
  });
};

export const fetchPatientFees = async (): Promise<PatientFee[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...mockPatientFees]), 500);
  });
};

export const updatePatientFee = async (
  patientId: string,
  status: "paid" | "pending"
): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), 500);
  });
};
