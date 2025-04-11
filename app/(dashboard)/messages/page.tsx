"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Paperclip, Send, MoreVertical } from "lucide-react"
import { useAppContext } from "@/context/app-context"
import { sendMessage } from "@/lib/api-service"
import { toast } from "@/components/ui/use-toast"

export default function MessagesPage() {
  const { patients, doctors, messages } = useAppContext()
  const [searchQuery, setSearchQuery] = useState("")
  const [newMessage, setNewMessage] = useState("")
  const [selectedContact, setSelectedContact] = useState<string | null>(null)
  const [activeConversation, setActiveConversation] = useState<any[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Combine patients and doctors for contacts list
  const contacts = [
    ...patients.map((p) => ({ id: p.id, name: p.name, avatar: p.avatar, type: "patient" })),
    ...doctors.map((d) => ({ id: d.id, name: d.name, avatar: d.avatar, type: "doctor" })),
  ]

  // Filter contacts based on search query
  const filteredContacts = contacts.filter((contact) => contact.name.toLowerCase().includes(searchQuery.toLowerCase()))

  // Get conversation messages when a contact is selected
  useEffect(() => {
    if (selectedContact) {
      // In a real app, this would fetch messages from an API
      const conversation = messages
        .filter((m) => m.senderId === selectedContact || m.receiverId === selectedContact)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

      setActiveConversation(conversation)
    } else {
      setActiveConversation([])
    }
  }, [selectedContact, messages])

  // Scroll to bottom of messages when conversation changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [activeConversation])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedContact) return

    try {
      // In a real app, this would send to an API
      const message = {
        senderId: "admin", // Admin user ID
        receiverId: selectedContact,
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        read: false,
      }

      await sendMessage(message)
      setNewMessage("")

      // Update the conversation with the new message
      setActiveConversation([...activeConversation, message])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive",
      })
    }
  }

  const getSelectedContact = () => {
    return contacts.find((c) => c.id === selectedContact)
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] overflow-hidden bg-white rounded-md shadow">
      {/* Left sidebar - contacts */}
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search"
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 ${
                selectedContact === contact.id ? "bg-blue-50" : ""
              }`}
              onClick={() => setSelectedContact(contact.id)}
            >
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={contact.avatar} />
                <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="font-medium truncate">{contact.name}</p>
                  <span className="text-xs text-gray-500">9:00am</span>
                </div>
                <p className="text-sm text-gray-500 truncate">Sent attachment</p>
              </div>
              {contact.type === "doctor" && <div className="ml-2 w-2 h-2 bg-green-500 rounded-full"></div>}
            </div>
          ))}
        </div>
      </div>

      {/* Right side - conversation */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            {/* Conversation header */}
            <div className="flex items-center justify-between p-4 border-b bg-blue-500 text-white">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3 border-2 border-white">
                  <AvatarImage src={getSelectedContact()?.avatar} />
                  <AvatarFallback>{getSelectedContact()?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{getSelectedContact()?.name}</p>
                  <p className="text-xs text-blue-100">Online</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-white hover:bg-blue-600">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeConversation.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No messages yet. Start a conversation!
                </div>
              ) : (
                <>
                  {/* Today marker */}
                  <div className="flex justify-center">
                    <div className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full">Today</div>
                  </div>

                  {activeConversation.map((msg, index) => {
                    const isAdmin = msg.senderId === "admin"
                    return (
                      <div key={index} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            isAdmin ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          <p>{msg.content}</p>
                          <div className={`text-xs mt-1 ${isAdmin ? "text-blue-100" : "text-gray-500"}`}>
                            {msg.timestamp}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Message input */}
            <div className="border-t p-3 flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="text-gray-400">
                <Paperclip className="h-5 w-5" />
              </Button>
              <Input
                placeholder="Type a message..."
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
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a contact to start messaging
          </div>
        )}
      </div>
    </div>
  )
}
