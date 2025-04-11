"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Smile, Paperclip, Send, MoreVertical } from "lucide-react"
import { messages, patients, doctors } from "@/lib/mock-data"

interface ChatProps {
  patientId: string
  doctorId: string
  onClose?: () => void
}

export function Chat({ patientId, doctorId, onClose }: ChatProps) {
  const [newMessage, setNewMessage] = useState("")
  const patient = patients.find((p) => p.id === patientId)
  const doctor = doctors.find((d) => d.id === doctorId)

  const chatMessages = messages.filter(
    (m) =>
      (m.senderId === patientId && m.receiverId === doctorId) ||
      (m.senderId === doctorId && m.receiverId === patientId),
  )

  const handleSendMessage = () => {
    if (!newMessage.trim()) return
    // In a real app, this would send the message to the API
    console.log("Sending message:", newMessage)
    setNewMessage("")
  }

  return (
    <Card className="w-full max-w-md absolute right-0 bottom-0 z-10 shadow-lg">
      <CardHeader className="bg-blue-500 text-white p-3 flex flex-row items-center justify-between">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2 border-2 border-white">
            <AvatarImage src={patient?.avatar} />
            <AvatarFallback>{patient?.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{patient?.name}</div>
            <div className="text-xs text-blue-100">Online</div>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" className="text-white hover:bg-blue-600">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-64 overflow-y-auto p-4 space-y-4">
          {chatMessages.map((message) => {
            const isPatient = message.senderId === patientId
            return (
              <div key={message.id} className={`flex ${isPatient ? "justify-start" : "justify-end"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    isPatient ? "bg-gray-100 text-gray-800" : "bg-blue-500 text-white"
                  }`}
                >
                  <p>{message.content}</p>
                  <div className={`text-xs mt-1 ${isPatient ? "text-gray-500" : "text-blue-100"}`}>
                    {message.timestamp}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="border-t p-3 flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="text-gray-400">
            <Smile className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input
            placeholder="Type a message"
            className="flex-1"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage()
              }
            }}
          />
          <Button size="icon" className="bg-blue-500 text-white hover:bg-blue-600" onClick={handleSendMessage}>
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
