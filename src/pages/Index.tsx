"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { StatsCard } from "@/components/StatsCard";
import { Users, Calendar, DollarSign, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";


import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { api } from "@/lib/api";
import YearSelector from "@/components/yearSelector";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Index = () => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);

  const { data, isLoading, mutate } = api.analytics.getAll({ year });



  const monthlyLabels = data?.data?.monthlyRevenue.map((m) => m.month) || [];
  const monthlyRevenue = data?.data?.monthlyRevenue.map((m) => m.revenue) || [];

  const chartData = {
    labels: monthlyLabels,
    datasets: [
      {
        label: "Monthly Revenue",
        data: monthlyRevenue,
        backgroundColor: "#4F46E5",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: `Revenue by Month (${year})` },
    },
  };

  return (
    <AdminLayout>
      <div className="p-4 space-y-2">
        <div>
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your salon overview.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Users"
            value={data?.data?.totalUsers}
            icon={Users}
            trend="+12% from last month"
            trendUp
          />
          <StatsCard
            title="Today's Bookings"
            value={data?.data?.totalBookings}
            icon={Calendar}
            trend="+8% from yesterday"
            trendUp
          />
          <StatsCard
            title="Revenue (MTD)"
            value={data?.data?.totalRevenue}
            icon={DollarSign}
            trend="+23% from last month"
            trendUp
          />
        <StatsCard
  title="Growth Rate"
  value={data?.data?.growth?.growthRate}
  icon={TrendingUp}
  trend={(() => {
    const { thisMonthRevenue, lastMonthRevenue } = data?.data?.growth || {};
    if (lastMonthRevenue === 0) {
      return thisMonthRevenue > 0 ? "100% increase" : "0% increase";
    }
    const percent = ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
    return `${percent.toFixed(2)}% increase`;
  })()}
  trendUp
/>
        </div>

        {/* Year Filter */}
        <div className="w-40">
                  <YearSelector selectedYear={year} onChange={(val)=>{setYear(val)
                    mutate()
                  }} />

        </div>

        {/* Bar Chart */}
        <Card className="p-1 bg-transparent shadow-none border-none">
          <Bar data={chartData} options={chartOptions} />
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Index;
