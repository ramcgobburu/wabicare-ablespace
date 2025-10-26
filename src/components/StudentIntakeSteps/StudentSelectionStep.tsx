"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  User, 
  UserPlus, 
  Search, 
  Calendar,
  Phone,
  Mail,
  CheckCircle
} from "lucide-react"
import { useStudents } from "@/hooks/useSupabase"

interface StudentSelectionData {
  type: 'new' | 'registered'
  selectedStudentId?: string
  selectedStudentName?: string
}

interface StudentSelectionStepProps {
  data: StudentSelectionData
  onUpdate: (data: StudentSelectionData) => void
}

function StudentSelectionStep({ data, onUpdate }: StudentSelectionStepProps) {
  const router = useRouter()
  const { students, loading } = useStudents()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStudent, setSelectedStudent] = useState<any>(null)

  // Ensure data has default values
  const safeData = data || { type: 'new' }

  // Filter students based on search term
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.school.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleStudentTypeSelect = (type: 'new' | 'registered') => {
    onUpdate({ ...safeData, type })
  }

  const handleStudentSelect = (student: any) => {
    setSelectedStudent(student)
    onUpdate({
      ...safeData,
      type: 'registered',
      selectedStudentId: student.id,
      selectedStudentName: student.name
    })
    
    // Navigate to student overview page
    router.push(`/student-overview?student=${student.id}`)
  }

  const handleNewStudent = () => {
    setSelectedStudent(null)
    onUpdate({
      ...safeData,
      type: 'new',
      selectedStudentId: undefined,
      selectedStudentName: undefined
    })
  }

  return (
    <div className="space-y-6">
      {/* Student Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card 
          className={`cursor-pointer transition-all ${
            safeData.type === 'new' 
              ? 'border-blue-500 bg-blue-50 shadow-md' 
              : 'hover:border-gray-300 hover:shadow-sm'
          }`}
          onClick={() => handleStudentTypeSelect('new')}
        >
          <CardContent className="p-6 text-center">
            <UserPlus className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">New Student</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create a new student record from scratch
            </p>
            {safeData.type === 'new' && (
              <Badge className="bg-blue-600">
                <CheckCircle className="h-3 w-3 mr-1" />
                Selected
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all ${
            safeData.type === 'registered' 
              ? 'border-green-500 bg-green-50 shadow-md' 
              : 'hover:border-gray-300 hover:shadow-sm'
          }`}
          onClick={() => handleStudentTypeSelect('registered')}
        >
          <CardContent className="p-6 text-center">
            <User className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Registered Student</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Select from existing students in the system
            </p>
            {safeData.type === 'registered' && (
              <Badge className="bg-green-600">
                <CheckCircle className="h-3 w-3 mr-1" />
                Selected
              </Badge>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Registered Student Selection */}
      {safeData.type === 'registered' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Select Registered Student
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students by name, ID, or school..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-muted-foreground mt-2">Loading students...</p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center py-8">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm ? 'No students found matching your search.' : 'No students available.'}
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredStudents.map((student) => (
                  <Card
                    key={student.id}
                    className={`cursor-pointer transition-colors ${
                      selectedStudent?.id === student.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => handleStudentSelect(student)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={student.profile_picture_url || undefined} alt={student.name} />
                          <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold">{student.name}</h3>
                          <p className="text-sm text-muted-foreground">{student.school}</p>
                          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                            <span>ID: {student.student_id}</span>
                            <span>Grade: {student.grade}</span>
                          </div>
                        </div>
                        {selectedStudent?.id === student.id && (
                          <CheckCircle className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* New Student Option */}
      {safeData.type === 'new' && (
        <Card>
          <CardContent className="p-6 text-center">
            <UserPlus className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Create New Student</h3>
            <p className="text-sm text-muted-foreground mb-4">
              You'll be able to enter all student information in the next step.
            </p>
            <Button 
              onClick={handleNewStudent}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Create New Student
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Selected Student Summary */}
      {selectedStudent && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedStudent.profile_picture_url || undefined} alt={selectedStudent.name} />
                <AvatarFallback>{selectedStudent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-green-800">{selectedStudent.name}</h3>
                <p className="text-sm text-green-600">{selectedStudent.school} • Grade {selectedStudent.grade}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Selected
                </Badge>
                <Button 
                  onClick={() => router.push(`/student-overview?student=${selectedStudent.id}`)}
                  className="bg-green-600 hover:bg-green-700"
                  size="sm"
                >
                  Continue to Student Overview
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default StudentSelectionStep
