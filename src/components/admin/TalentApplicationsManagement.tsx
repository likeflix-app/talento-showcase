import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Eye, 
  Check, 
  X, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Image as ImageIcon,
  ExternalLink,
  Search,
  Filter,
  Download,
  Trash2,
  MessageSquare,
  Star
} from 'lucide-react';
import { format } from 'date-fns';
import { getTalentApplications, updateTalentApplicationStatus, TalentApplication } from '@/services/talentApplication';

const TalentApplicationsManagement = () => {
  const [applications, setApplications] = useState<TalentApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<TalentApplication[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<TalentApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const { toast } = useToast();

  // Fetch applications from backend API
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const data = await getTalentApplications();
        setApplications(data.applications || []);
        setFilteredApplications(data.applications || []);
      } catch (error) {
        console.error('Error fetching applications:', error);
        toast({
          title: 'Error',
          description: 'Failed to load talent applications.',
          variant: 'destructive',
        });
        // Fallback to empty array
        setApplications([]);
        setFilteredApplications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [toast]);

  // Filter applications based on search and status
  useEffect(() => {
    let filtered = applications;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.contentCategories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredApplications(filtered);
  }, [applications, searchTerm, statusFilter]);

  const handleStatusChange = async (applicationId: string, newStatus: 'verified' | 'rejected') => {
    try {
      const result = await updateTalentApplicationStatus(
        applicationId, 
        newStatus, 
        reviewNotes || undefined
      );
      
      // Update local state with the response from backend
      setApplications(prev => prev.map(app => 
        app.id === applicationId 
          ? { ...app, ...result.application }
          : app
      ));

      toast({
        title: `Application ${newStatus === 'verified' ? 'approved' : 'rejected'}`,
        description: `Talent application has been ${newStatus === 'verified' ? 'approved' : 'rejected'}.`,
      });

      setIsReviewDialogOpen(false);
      setSelectedApplication(null);
      setReviewNotes('');
    } catch (error) {
      console.error('Status change error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update application status.',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="mr-1 h-3 w-3" />Pending</Badge>;
      case 'verified':
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><Check className="mr-1 h-3 w-3" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-100 text-red-800"><X className="mr-1 h-3 w-3" />Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const MediaKitGallery = ({ urls }: { urls: string[] }) => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {urls.map((url, index) => (
        <div key={index} className="relative group">
          <img
            src={url}
            alt={`Media kit ${index + 1}`}
            className="w-full h-32 object-cover rounded-lg border"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/200x200?text=Image+Not+Found';
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
            <Button
              size="sm"
              variant="secondary"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => window.open(url, '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Talent Applications</h2>
          <p className="text-muted-foreground">Manage pending talent applications</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">
            Total: {applications.length}
          </Badge>
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Pending: {applications.filter(app => app.status === 'pending').length}
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name, email, city, or categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="md:w-48">
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="verified">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="grid gap-4">
        {filteredApplications.map((application) => (
          <Card key={application.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{application.fullName}</CardTitle>
                  <CardDescription className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Mail className="mr-1 h-3 w-3" />
                      {application.email}
                    </span>
                    <span className="flex items-center">
                      <MapPin className="mr-1 h-3 w-3" />
                      {application.city}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      {format(new Date(application.createdAt), 'MMM dd, yyyy')}
                    </span>
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(application.status)}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Talent Application - {application.fullName}</DialogTitle>
                        <DialogDescription>
                          Submitted on {format(new Date(application.createdAt), 'PPP')}
                        </DialogDescription>
                      </DialogHeader>
                      
                      <Tabs defaultValue="personal" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                          <TabsTrigger value="personal">Personal</TabsTrigger>
                          <TabsTrigger value="profile">Profile</TabsTrigger>
                          <TabsTrigger value="availability">Availability</TabsTrigger>
                          <TabsTrigger value="media">Media Kit</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="personal" className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Full Name</Label>
                              <p className="font-medium">{application.fullName}</p>
                            </div>
                            <div>
                              <Label>Birth Year</Label>
                              <p className="font-medium">{application.birthYear}</p>
                            </div>
                            <div>
                              <Label>Email</Label>
                              <p className="font-medium">{application.email}</p>
                            </div>
                            <div>
                              <Label>Phone</Label>
                              <p className="font-medium">{application.phone}</p>
                            </div>
                            <div>
                              <Label>City</Label>
                              <p className="font-medium">{application.city}</p>
                            </div>
                            {application.nickname && (
                              <div>
                                <Label>Nickname</Label>
                                <p className="font-medium">{application.nickname}</p>
                              </div>
                            )}
                          </div>
                          {application.bio && (
                            <div>
                              <Label>Bio</Label>
                              <p className="text-sm bg-muted p-3 rounded-md">{application.bio}</p>
                            </div>
                          )}
                        </TabsContent>
                        
                        <TabsContent value="profile" className="space-y-4">
                          <div>
                            <Label>Social Channels</Label>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {application.socialChannels.map((channel, index) => (
                                <Badge key={index} variant="secondary">{channel}</Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <Label>Social Links</Label>
                            <p className="text-sm bg-muted p-3 rounded-md whitespace-pre-line">{application.socialLinks}</p>
                          </div>
                          <div>
                            <Label>Content Categories</Label>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {application.contentCategories.map((category, index) => (
                                <Badge key={index} variant="outline">{category}</Badge>
                              ))}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Available for Products</Label>
                              <p className="font-medium">{application.availableForProducts}</p>
                            </div>
                            <div>
                              <Label>Available for Reels</Label>
                              <p className="font-medium">{application.availableForReels}</p>
                            </div>
                          </div>
                          {application.shippingAddress && (
                            <div>
                              <Label>Shipping Address</Label>
                              <p className="text-sm bg-muted p-3 rounded-md">{application.shippingAddress}</p>
                            </div>
                          )}
                        </TabsContent>
                        
                        <TabsContent value="availability" className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Available Next 3 Months</Label>
                              <p className="font-medium">{application.availableNext3Months}</p>
                            </div>
                            {application.availabilityPeriod && (
                              <div>
                                <Label>Availability Period</Label>
                                <p className="font-medium">{application.availabilityPeriod}</p>
                              </div>
                            )}
                            <div>
                              <Label>Collaborated with Agencies</Label>
                              <p className="font-medium">{application.collaboratedAgencies}</p>
                            </div>
                            <div>
                              <Label>Collaborated with Brands</Label>
                              <p className="font-medium">{application.collaboratedBrands}</p>
                            </div>
                          </div>
                          {application.agenciesList && (
                            <div>
                              <Label>Agencies List</Label>
                              <p className="text-sm bg-muted p-3 rounded-md">{application.agenciesList}</p>
                            </div>
                          )}
                          {application.brandsList && (
                            <div>
                              <Label>Brands List</Label>
                              <p className="text-sm bg-muted p-3 rounded-md">{application.brandsList}</p>
                            </div>
                          )}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Has VAT/Receipt</Label>
                              <p className="font-medium">{application.hasVAT}</p>
                            </div>
                            <div>
                              <Label>Payment Methods</Label>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {application.paymentMethod.map((method, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">{method}</Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="media" className="space-y-4">
                          <div>
                            <Label>Media Kit Photos ({application.mediaKitUrls.length})</Label>
                            <MediaKitGallery urls={application.mediaKitUrls} />
                          </div>
                        </TabsContent>
                      </Tabs>
                      
                      {application.status === 'pending' && (
                        <div className="flex justify-end space-x-2 pt-4 border-t">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                                <X className="mr-2 h-4 w-4" />
                                Reject
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Reject Application</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to reject this talent application? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <div className="space-y-2">
                                <Label htmlFor="reject-notes">Rejection Notes (Optional)</Label>
                                <Textarea
                                  id="reject-notes"
                                  placeholder="Add notes about why this application was rejected..."
                                  value={reviewNotes}
                                  onChange={(e) => setReviewNotes(e.target.value)}
                                />
                              </div>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleStatusChange(application.id, 'rejected')}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Reject Application
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button className="bg-green-600 hover:bg-green-700">
                                <Check className="mr-2 h-4 w-4" />
                                Approve
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Approve Application</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to approve this talent application? The talent will be notified.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <div className="space-y-2">
                                <Label htmlFor="approve-notes">Approval Notes (Optional)</Label>
                                <Textarea
                                  id="approve-notes"
                                  placeholder="Add notes about this approval..."
                                  value={reviewNotes}
                                  onChange={(e) => setReviewNotes(e.target.value)}
                                />
                              </div>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleStatusChange(application.id, 'verified')}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Approve Application
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {application.contentCategories.slice(0, 3).map((category, index) => (
                      <Badge key={index} variant="outline" className="text-xs">{category}</Badge>
                    ))}
                    {application.contentCategories.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{application.contentCategories.length - 3} more
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {application.socialChannels.join(', ')} • {application.mediaKitUrls.length} photos
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    Age: {new Date().getFullYear() - application.birthYear}
                  </p>
                  {application.availableForProducts === 'Si' && (
                    <Badge variant="secondary" className="text-xs mt-1">
                      Products OK
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <User className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No applications found</h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your filters to see more results.'
                : 'No talent applications have been submitted yet.'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TalentApplicationsManagement;
