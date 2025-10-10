import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { authService, RegistrationData } from '@/services/authService';

const SimpleTestPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<RegistrationData>({
    email: '',
    name: '',
    password: 'password'
  });

  const handleRegister = async () => {
    try {
      const user = await authService.register(formData);
      toast({
        title: 'Registration Successful!',
        description: `User ${user.name} registered. Check your email for verification link.`,
      });
      
      // Clear form
      setFormData({ email: '', name: '', password: 'password' });
    } catch (error) {
      toast({
        title: 'Registration Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  const handleVerifyTest = () => {
    // Get the latest unverified user for testing
    const allUsers: any[] = []; // No longer using localStorage storage
    const unverifiedUsers = allUsers.filter(user => !user.emailVerified);
    
    if (unverifiedUsers.length > 0) {
      const latestUser = unverifiedUsers[unverifiedUsers.length - 1];
      const token = localStorage.getItem(`verification_${latestUser.id}`);
      
      if (token) {
        // Simulate clicking verification link
        const verificationUrl = `${window.location.origin}/verify-email?token=${token}`;
        window.open(verificationUrl, '_blank');
        
        toast({
          title: 'Verification Link Opened',
          description: `Opening verification link for ${latestUser.email}`,
        });
      } else {
        toast({
          title: 'No Token Found',
          description: 'No verification token found for this user',
          variant: 'destructive',
        });
      }
    } else {
      toast({
        title: 'No Unverified Users',
        description: 'All users are already verified',
      });
    }
  };

  const handleShowAllUsers = () => {
    const allUsers: any[] = []; // No longer using localStorage storage
    const verifiedUsers: any[] = []; // No longer using localStorage storage
    
    console.log('🔍 ALL USERS:', allUsers);
    console.log('✅ VERIFIED USERS:', verifiedUsers);
    
    toast({
      title: 'Users Data Logged',
      description: `Total: ${allUsers.length}, Verified: ${verifiedUsers.length}. Check console.`,
    });
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Simple User Registration Test</CardTitle>
            <CardDescription>
              Test the simplified registration and verification system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Enter password (default: password)"
              />
              <p className="text-sm text-muted-foreground">
                Note: All users use password "password" for testing
              </p>
            </div>
            
            <Button onClick={handleRegister} className="w-full">
              Register New User
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Actions</CardTitle>
            <CardDescription>
              Actions to test the system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleVerifyTest} variant="outline" className="w-full">
              Test Email Verification (Open Link)
            </Button>
            
            <Button onClick={handleShowAllUsers} variant="outline" className="w-full">
              Show All Users (Console Log)
            </Button>
            
            <Button 
              onClick={() => window.location.href = '/admin'} 
              variant="outline" 
              className="w-full"
            >
              Go to Admin Panel (Simple Users Tab)
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Users Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {0}
                </div>
                <div className="text-sm text-muted-foreground">Total Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {0}
                </div>
                <div className="text-sm text-muted-foreground">Verified Users</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SimpleTestPage;
