"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAppContext } from "@/context/app-context"
import { assignEducationContent, fetchEducationContent } from "@/lib/api-service"
import { toast } from "@/components/ui/use-toast"

interface AssignEducationContentProps {
  contentId: string
  onSuccess: () => void
}

export function AssignEducationContent({ contentId, onSuccess }: AssignEducationContentProps) {
  const { patients } = useAppContext()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPatients, setSelectedPatients] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [contentTitle, setContentTitle] = useState("")

  useEffect(() => {
    fetchEducationContent(contentId).then((content) => {
      if (content) {
        setContentTitle(content.title)
        setSelectedPatients(content.assignedTo || [])
      }
    })
  }, [contentId])

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handlePatientSelection = (patientId: string, checked: boolean) => {
    if (checked) {
      setSelectedPatients([...selectedPatients, patientId])
    } else {
      setSelectedPatients(selectedPatients.filter((id) => id !== patientId))
    }
  }

  const handleAssign = async () => {
    setIsLoading(true)
    try {
      await assignEducationContent(contentId, selectedPatients)
      toast({
        title: "Content assigned",
        description: `The content has been assigned to ${selectedPatients.length} patient(s).`,
      })
      onSuccess()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign content to patients.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-500">Assign "{contentTitle}" to patients</div>

      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search Patient's Name"
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="border rounded-md max-h-[300px] overflow-y-auto">
        {filteredPatients.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No patients found</div>
        ) : (
          filteredPatients.map((patient) => (
            <div key={patient.id} className="flex items-center space-x-3 p-3 border-b last:border-b-0">
              <Checkbox
                id={`patient-${patient.id}`}
                checked={selectedPatients.includes(patient.id)}
                onCheckedChange={(checked) => handlePatientSelection(patient.id, !!checked)}
              />
              <Avatar className="h-8 w-8">
                <AvatarImage src={patient.avatar} />
                <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <label htmlFor={`patient-${patient.id}`} className="flex-1 text-sm font-medium cursor-pointer">
                {patient.name}
              </label>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button onClick={handleAssign} disabled={isLoading || selectedPatients.length === 0}>
          {isLoading ? "Assigning..." : "Assign Ed Content"}
        </Button>
      </div>
    </div>
  )
}
