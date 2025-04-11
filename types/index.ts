export interface Patient {
  id: string
  name: string
  age: number
  gender: "Male" | "Female" | "Other"
  bloodGroup: string
  phoneNumber: string
  email: string
  avatar: string
  selected?: boolean
}

export interface Doctor {
  id: string
  name: string
  specialization: string
  qualification: string
  phoneNumber: string
  floorRoom: string
  dayOff: string
  gender: "Male" | "Female" | "Other"
  age: number
  avatar: string
}

export interface Appointment {
  id: string
  patientId: string
  doctorId: string
  time: string
  date: string
  status: "Scheduled" | "Completed" | "Cancelled"
  feeStatus?: "Paid" | "Unpaid"
}

export interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: string
  read: boolean
}

export interface MedicineProduct {
  id: string
  name: string
  type: string
  price: number
  stock: number
  unit: string
  expiryDate: string
  manufacturer: string
  category: string
  selected?: boolean
}

export interface EducationContent {
  id: string
  title: string
  description: string
  author: string
  thumbnail: string
  content: string
  category: string
  createdAt: string
  assignedTo?: string[]
}

export interface ActivityOverview {
  appointments: number
  newPatients: number
  medicinesSold: number
  labTests: number
}

export interface TopMedicine {
  name: string
  percentage: number
  color: string
}

export interface PatientFee {
  patientId: string
  amount: number
  status: "pending" | "paid"
  date: string
}
