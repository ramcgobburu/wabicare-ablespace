"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  FileText, 
  Search, 
  Filter, 
  Copy, 
  Mail, 
  Calendar, 
  User, 
  Phone, 
  AlertCircle,
  CheckCircle,
  Clock,
  X
} from "lucide-react"
import { getAllDocumentLinks, updateDocumentLinkStatus } from "@/lib/documentUploadStorage"
import { DocumentUploadLink } from "@/types/document-upload"
import { format } from "date-fns"
import PageLayout from "@/components/PageLayout"

export default function DocumentLinksPage() {
  const [links, setLinks] = useState<DocumentUploadLink[]>([])
  const [filteredLinks, setFilteredLinks] = useState<DocumentUploadLink[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLinks()
  }, [])

  useEffect(() => {
    filterLinks()
  }, [links, searchTerm, statusFilter])

  const loadLinks = () => {
    const allLinks = getAllDocumentLinks()
    setLinks(allLinks)
    setLoading(false)
  }

  const filterLinks = () => {
    let filtered = links

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(link => 
        link.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.parentEmail.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(link => link.status === statusFilter)
    }

    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    setFilteredLinks(filtered)
  }

  const copyLinkToClipboard = (link: DocumentUploadLink) => {
    navigator.clipboard.writeText(link.uploadUrl)
    alert('Link copied to clipboard!')
  }

  const getStatusIcon = (status: DocumentUploadLink['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'uploaded':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'expired':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case 'cancelled':
        return <X className="h-4 w-4 text-gray-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: DocumentUploadLink['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'uploaded':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const isExpired = (link: DocumentUploadLink) => {
    return new Date() > link.expiresAt
  }

  if (loading) {
    return (
      <PageLayout
        breadcrumbs={[
          { label: "Students", href: "/students" },
          { label: "Document Upload Links" }
        ]}
      >
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout
      breadcrumbs={[
        { label: "Students", href: "/students" },
        { label: "Document Upload Links" }
      ]}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Document Upload Links</h1>
            <p className="text-muted-foreground">
              Manage secure document upload links for parents
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by student name, parent name, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="uploaded">Uploaded</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Links List */}
        <div className="space-y-4">
          {filteredLinks.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Document Links Found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || statusFilter !== "all" 
                      ? "No links match your current filters." 
                      : "No document upload links have been created yet."
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredLinks.map((link) => (
              <Card key={link.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      {/* Header */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(link.status)}
                          <h3 className="font-semibold text-lg">{link.studentName}</h3>
                        </div>
                        <Badge className={getStatusColor(link.status)}>
                          {link.status}
                        </Badge>
                        {isExpired(link) && link.status === 'pending' && (
                          <Badge variant="destructive">Expired</Badge>
                        )}
                      </div>

                      {/* Parent Information */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Parent:</span>
                          <span>{link.parentName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Email:</span>
                          <span>{link.parentEmail}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Phone:</span>
                          <span>{link.parentPhone}</span>
                        </div>
                      </div>

                      {/* Upload Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Created:</span>
                          <span>{format(link.createdAt, 'MMM d, yyyy h:mm a')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Expires:</span>
                          <span className={isExpired(link) ? 'text-red-600' : ''}>
                            {format(link.expiresAt, 'MMM d, yyyy h:mm a')}
                          </span>
                        </div>
                      </div>

                      {/* Uploaded Documents */}
                      {link.uploadedDocuments.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Uploaded Documents ({link.uploadedDocuments.length}):</h4>
                          <div className="flex flex-wrap gap-2">
                            {link.uploadedDocuments.map((doc) => (
                              <Badge key={doc.id} variant="outline" className="text-xs">
                                {doc.fileName}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Upload Link */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Upload Link:</Label>
                        <div className="flex items-center gap-2">
                          <Input 
                            value={link.uploadUrl} 
                            readOnly 
                            className="font-mono text-sm"
                          />
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => copyLinkToClipboard(link)}
                            className="flex items-center gap-1"
                          >
                            <Copy className="h-3 w-3" />
                            Copy
                          </Button>
                        </div>
                      </div>

                      {/* Notes */}
                      {link.notes && (
                        <div className="space-y-1">
                          <Label className="text-sm font-medium">Notes:</Label>
                          <p className="text-sm text-muted-foreground">{link.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Summary */}
        {filteredLinks.length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {filteredLinks.filter(l => l.status === 'pending').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {filteredLinks.filter(l => l.status === 'uploaded').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Uploaded</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {filteredLinks.filter(l => l.status === 'expired').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Expired</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-600">
                    {filteredLinks.filter(l => l.status === 'cancelled').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Cancelled</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageLayout>
  )
}
