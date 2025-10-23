"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { AdminLayout } from "@/components/AdminLayout";

export default function PointManager() {
  const [loading, setLoading] = useState(false);
  const [customPoint, setCustomPoint] = useState<string>("");

  const { data: pointData, isLoading: pointLoading, mutate } = api.point.getAll();
  const point = pointData?.data?.[0];

  // ✅ Update point with a specific value
  const updatePoint = async (value: number) => {
    if (!point) {
      toast.error("No point data found!");
      return;
    }

    try {
      setLoading(true);
      await api.point.update(point.id, { point: value as any });
      toast.success(`Point updated to ${value}`);
      mutate();
    } catch (err: any) {
      console.error(err);
      toast.error("Error updating point");
    } finally {
      setLoading(false);
      setCustomPoint("");
    }
  };

  // ✅ Increment and Decrement
  const handleIncrement = () => {
    if (!point) return;
    updatePoint(point.point + 1);
  };

  const handleDecrement = () => {
    if (!point) return;
    updatePoint(Math.max(point.point - 1, 0)); // prevent negative
  };

  // ✅ Handle custom input update
  const handleCustomUpdate = () => {
    const num = parseInt(customPoint);
    if (isNaN(num)) {
      toast.error("Please enter a valid number");
      return;
    }
    updatePoint(num);
  };

  return (
    <AdminLayout>
      <div className="flex justify-center items-center min-h-screen bg-background">
        <Card className="w-[400px] shadow-luxury">
          <CardHeader>
            <CardTitle className="text-center text-xl font-semibold">
              🎯 Point Manager
            </CardTitle>
          </CardHeader>

          <CardContent className="text-center space-y-6">
            {(loading || pointLoading) && (
              <p className="text-sm text-muted-foreground">Loading...</p>
            )}

            {!loading && !pointLoading && point && (
              <>
                {/* Current Point Display */}
                <div className="text-5xl font-bold text-primary">
                  {point.point}
                </div>
                <p className="text-sm text-muted-foreground">
                  Last updated: {new Date(point.updatedAt).toLocaleString()}
                </p>

                {/* Increment / Decrement Controls */}
                <div className="flex justify-center gap-3">
                  <Button
                    variant="outline"
                    disabled={loading}
                    onClick={handleDecrement}
                    className="w-1/3"
                  >
                    ➖
                  </Button>
                  <Button
                    variant="outline"
                    disabled={loading}
                    onClick={handleIncrement}
                    className="w-1/3"
                  >
                    ➕
                  </Button>
                </div>

                {/* Input for Custom Point */}
                <div className="space-y-2 mt-4">
                  <Input
                    type="number"
                    placeholder="Enter custom point..."
                    value={customPoint}
                    onChange={(e) => setCustomPoint(e.target.value)}
                    className="text-center"
                  />
                  <Button
                    onClick={handleCustomUpdate}
                    disabled={loading || !customPoint}
                    className="w-full bg-gradient-primary hover:opacity-90 transition"
                  >
                    Update Point
                  </Button>
                </div>
              </>
            )}

            {!loading && !pointLoading && !point && (
              <p className="text-muted-foreground">No point data available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
