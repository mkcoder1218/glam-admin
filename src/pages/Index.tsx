import { AdminLayout } from "@/components/AdminLayout";
import { StatsCard } from "@/components/StatsCard";
import { Users, Calendar, DollarSign, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const recentBookings = [
    { id: 1, customer: "Emma Wilson", service: "Haircut & Style", time: "10:00 AM", status: "confirmed" },
    { id: 2, customer: "James Chen", service: "Color Treatment", time: "11:30 AM", status: "pending" },
    { id: 3, customer: "Sarah Johnson", service: "Hair Spa", time: "2:00 PM", status: "completed" },
    { id: 4, customer: "Michael Brown", service: "Beard Trim", time: "3:30 PM", status: "confirmed" },
  ];

  return (
    <AdminLayout>
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your salon overview.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Users"
            value="2,847"
            icon={Users}
            trend="+12% from last month"
            trendUp
          />
          <StatsCard
            title="Today's Bookings"
            value="24"
            icon={Calendar}
            trend="+8% from yesterday"
            trendUp
          />
          <StatsCard
            title="Revenue (MTD)"
            value="$12,450"
            icon={DollarSign}
            trend="+23% from last month"
            trendUp
          />
          <StatsCard
            title="Growth Rate"
            value="18.2%"
            icon={TrendingUp}
            trend="+4.3% increase"
            trendUp
          />
        </div>

        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Recent Bookings</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.customer}</TableCell>
                  <TableCell>{booking.service}</TableCell>
                  <TableCell>{booking.time}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        booking.status === "completed"
                          ? "default"
                          : booking.status === "confirmed"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {booking.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Index;
