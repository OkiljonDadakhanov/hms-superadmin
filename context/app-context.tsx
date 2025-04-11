"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import {
  fetchPatients,
  fetchDoctors,
  fetchAppointments,
  fetchMedicineProducts,
  fetchEducationContents,
  fetchActivityOverview,
  fetchTopMedicines,
  fetchPatientFees,
  fetchMessages,
} from "@/lib/api-service"
import type {
  Patient,
  Doctor,
  Appointment,
  MedicineProduct,
  EducationContent,
  ActivityOverview,
  TopMedicine,
  PatientFee,
  Message,
} from "@/types"

interface AppContextType {
  patients: Patient[]
  doctors: Doctor[]
  appointments: Appointment[]
  medicineProducts: MedicineProduct[]
  educationContents: EducationContent[]
  activityOverview: ActivityOverview | null
  topMedicines: TopMedicine[]
  patientFees: PatientFee[]
  messages: Message[]
  loading: boolean
  error: string | null
  refreshData: (dataType?: string) => Promise<void>
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>
  setDoctors: React.Dispatch<React.SetStateAction<Doctor[]>>
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>
  setMedicineProducts: React.Dispatch<React.SetStateAction<MedicineProduct[]>>
  setEducationContents: React.Dispatch<React.SetStateAction<EducationContent[]>>
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [medicineProducts, setMedicineProducts] = useState<MedicineProduct[]>([])
  const [educationContents, setEducationContents] = useState<EducationContent[]>([])
  const [activityOverview, setActivityOverview] = useState<ActivityOverview | null>(null)
  const [topMedicines, setTopMedicines] = useState<TopMedicine[]>([])
  const [patientFees, setPatientFees] = useState<PatientFee[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshData = async (dataType?: string) => {
    setLoading(true)
    setError(null)
    try {
      if (!dataType || dataType === "patients") {
        const patientsData = await fetchPatients()
        setPatients(patientsData)
      }

      if (!dataType || dataType === "doctors") {
        const doctorsData = await fetchDoctors()
        setDoctors(doctorsData)
      }

      if (!dataType || dataType === "appointments") {
        const appointmentsData = await fetchAppointments()
        setAppointments(appointmentsData)
      }

      if (!dataType || dataType === "medicineProducts") {
        const medicineProductsData = await fetchMedicineProducts()
        setMedicineProducts(medicineProductsData)
      }

      if (!dataType || dataType === "educationContents") {
        const educationContentsData = await fetchEducationContents()
        setEducationContents(educationContentsData)
      }

      if (!dataType || dataType === "activityOverview") {
        const activityOverviewData = await fetchActivityOverview()
        setActivityOverview(activityOverviewData)
      }

      if (!dataType || dataType === "topMedicines") {
        const topMedicinesData = await fetchTopMedicines()
        setTopMedicines(topMedicinesData)
      }

      if (!dataType || dataType === "patientFees") {
        const patientFeesData = await fetchPatientFees()
        setPatientFees(patientFeesData)
      }

      if (!dataType || dataType === "messages") {
        const messagesData = await fetchMessages()
        setMessages(messagesData)
      }
    } catch (err) {
      setError("Failed to fetch data")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshData()
  }, [])

  return (
    <AppContext.Provider
      value={{
        patients,
        doctors,
        appointments,
        medicineProducts,
        educationContents,
        activityOverview,
        topMedicines,
        patientFees,
        messages,
        loading,
        error,
        refreshData,
        setPatients,
        setDoctors,
        setAppointments,
        setMedicineProducts,
        setEducationContents,
        setMessages,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}
