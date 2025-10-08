import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2, Users, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { resetUsers, getUserCount } from '@/utils/resetUsers';

const UserResetUtility = () => {
  const { toast } = useToast();
  const [isResetting, setIsResetting] = useState(false);
  const [userCounts, setUserCounts] = useState<{ localStorage: number; supabase?: number } | null>(null);

  const loadUserCounts = async () => {
    const counts = await getUserCount();
    setUserCounts(counts);
  };

  const handleResetUsers = async () => {
    if (!confirm('⚠️ Are you sure you want to delete ALL registered users and keep only the admin user?\n\nThis action cannot be undone!')) {
      return;
    }

    setIsResetting(true);
    try {
      await resetUsers(true); // Clear both localStorage and Supabase
      
      toast({
        title: '✅ Users Reset Complete',
        description: 'All users have been deleted. Only admin user remains.',
      });

      // Reload user counts
      await loadUserCounts();
    } catch (error) {
      console.error('Reset error:', error);
      toast({
        title: '❌ Reset Failed',
        description: 'There was an error resetting users. Check console for details.',
        variant: 'destructive',
      });
    } finally {
      setIsResetting(false);
    }
  };

  const handleResetLocalStorageOnly = async () => {
    if (!confirm('⚠️ Are you sure you want to reset localStorage users only?\n\nThis will keep Supabase users intact.')) {
      return;
    }

    setIsResetting(true);
    try {
      await resetUsers(false); // Clear only localStorage
      
      toast({
        title: '✅ LocalStorage Reset Complete',
        description: 'LocalStorage users have been reset. Only admin user remains.',
      });

      // Reload user counts
      await loadUserCounts();
    } catch (error) {
      console.error('Reset error:', error);
      toast({
        title: '❌ Reset Failed',
        description: 'There was an error resetting localStorage users.',
        variant: 'destructive',
      });
    } finally {
      setIsResetting(false);
    }
  };

  React.useEffect(() => {
    loadUserCounts();
  }, []);

  return (
    <div className="space-y-6">
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="h-5 w-5" />
            User Reset Utility
          </CardTitle>
          <CardDescription>
            Danger zone: Reset all registered users and keep only the admin user
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current User Counts */}
          {userCounts && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-2 p-3 bg-white rounded-lg border">
                <Users className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">LocalStorage Users</p>
                  <p className="text-2xl font-bold text-blue-600">{userCounts.localStorage}</p>
                </div>
              </div>
              {userCounts.supabase !== undefined && (
                <div className="flex items-center gap-2 p-3 bg-white rounded-lg border">
                  <Users className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Supabase Users</p>
                    <p className="text-2xl font-bold text-green-600">{userCounts.supabase}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Warning */}
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Warning:</strong> This will permanently delete all registered users except the admin user. 
              This action cannot be undone. Make sure you have backups if needed.
            </AlertDescription>
          </Alert>

          {/* Reset Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={handleResetUsers}
              disabled={isResetting}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              {isResetting ? 'Resetting...' : 'Reset All Users (LocalStorage + Supabase)'}
            </Button>

            <Button
              onClick={handleResetLocalStorageOnly}
              disabled={isResetting}
              variant="outline"
              className="flex items-center gap-2 border-orange-300 text-orange-700 hover:bg-orange-50"
            >
              <Trash2 className="h-4 w-4" />
              {isResetting ? 'Resetting...' : 'Reset LocalStorage Only'}
            </Button>
          </div>

          <Button
            onClick={loadUserCounts}
            variant="ghost"
            size="sm"
            className="text-gray-600"
          >
            🔄 Refresh User Counts
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserResetUtility;
