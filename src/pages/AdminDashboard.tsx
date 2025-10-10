import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  TrendingUp, 
  Settings, 
  LogOut,
  Home,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  FileText,
  ClipboardList
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TalentsManagement from '@/components/admin/TalentsManagement';
import BackendUsersManagement from '@/components/admin/BackendUsersManagement';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';
import RequestsManagement from '@/components/admin/RequestsManagement';
import TalentApplicationsManagement from '@/components/admin/TalentApplicationsManagement';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('applications');

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      toast({
        title: 'Logout successful',
        description: 'You have been logged out successfully.',
      });
    } catch (error) {
      toast({
        title: 'Logout failed',
        description: 'An error occurred during logout.',
        variant: 'destructive',
      });
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-destructive">Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access the admin panel.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={handleBackToHome} className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <Badge variant="secondary" className="bg-primary text-primary-foreground">
                Admin Panel
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-muted-foreground">
                Welcome, <span className="font-semibold text-foreground">{user.name}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleBackToHome}>
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center space-x-2">
              <ClipboardList className="h-4 w-4" />
              <span>Talent Apps</span>
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Richieste</span>
            </TabsTrigger>
            <TabsTrigger value="talents" className="flex items-center space-x-2">
              <UserCheck className="h-4 w-4" />
              <span>Talents</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Users</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <TalentApplicationsManagement />
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            <RequestsManagement />
          </TabsContent>

          <TabsContent value="talents" className="space-y-6">
            <TalentsManagement />
          </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <BackendUsersManagement />
        </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
