import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Users, UserCheck, Calendar, TrendingUp, RefreshCw } from 'lucide-react';
import { talentService } from '@/services/talent';
import { userService } from '@/services/user';
import { requestService } from '@/services/request';
import { useStats } from '@/contexts/StatsContext';

const AnalyticsDashboard = () => {
  const { refreshTrigger } = useStats();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    activeTalents: 0,
    totalBookings: 0,
    confirmedBookings: 0,
    loading: true,
  });

  const fetchStats = async () => {
    setStats(prev => ({ ...prev, loading: true }));
    try {
      const [usersCount, adminsCount, activeTalentsCount, requests] = await Promise.all([
        userService.getUsersCount(),
        userService.getAdminsCount(),
        talentService.getActiveTalentsCount(),
        requestService.getAllRequests(), // Get all requests
      ]);

      // Count confirmed bookings (requests with time slots)
      const confirmedBookings = requests.filter(req => req.timeSlot && req.status === 'confirmed').length;

      setStats({
        totalUsers: usersCount,
        totalAdmins: adminsCount,
        activeTalents: activeTalentsCount,
        totalBookings: requests.length, // Total requests
        confirmedBookings: confirmedBookings, // Actual scheduled consultations
        loading: false,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchStats();
    
    // Refresh stats every 30 seconds to catch new bookings
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [refreshTrigger]); // Re-run when refreshTrigger changes

  const StatCard = ({ 
    title, 
    value, 
    description, 
    icon: Icon, 
    color = "default" 
  }: {
    title: string;
    value: number | string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    color?: "default" | "primary" | "secondary" | "destructive";
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${
          color === 'primary' ? 'text-primary' :
          color === 'secondary' ? 'text-secondary-foreground' :
          color === 'destructive' ? 'text-destructive' :
          'text-muted-foreground'
        }`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );

  if (stats.loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="space-y-0 pb-2">
                <Skeleton className="h-4 w-[100px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[60px] mb-2" />
                <Skeleton className="h-3 w-[120px]" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Overview of your talent showcase platform</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchStats}
          disabled={stats.loading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${stats.loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          description="Registered users"
          icon={Users}
          color="primary"
        />
        <StatCard
          title="Admin Users"
          value={stats.totalAdmins}
          description="Administrators"
          icon={UserCheck}
          color="secondary"
        />
        <StatCard
          title="Active Talents"
          value={stats.activeTalents}
          description="Available consultants"
          icon={TrendingUp}
          color="default"
        />
        <StatCard
          title="Total Bookings"
          value={stats.confirmedBookings}
          description="Scheduled consultations"
          icon={Calendar}
          color="destructive"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common administrative tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center space-x-4 rounded-lg border p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <UserCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Manage Talents</p>
                <p className="text-xs text-muted-foreground">
                  Add, edit, or deactivate talents
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 rounded-lg border p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
                <Users className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">Manage Users</p>
                <p className="text-xs text-muted-foreground">
                  View and manage user accounts
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 rounded-lg border p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                <Calendar className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm font-medium">View Bookings</p>
                <p className="text-xs text-muted-foreground">
                  Monitor scheduled consultations
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>
            Current system health and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium">System Online</span>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Healthy
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <span className="text-sm font-medium">Database</span>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Connected
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                <span className="text-sm font-medium">Last Backup</span>
              </div>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                Today
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
