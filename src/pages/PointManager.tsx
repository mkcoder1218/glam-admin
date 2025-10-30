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
  const [customRedeem, setCustomRedeem] = useState<string>("");
  const [customGiveaway, setCustomGiveaway] = useState<string>("");

  const { data: pointData, isLoading: pointLoading, mutate } = api.point.getAll();
  const point = pointData?.data?.[0];

  // ✅ Update function
  const updatePoint = async (updateObj: { point?: number; reedem_amount?: number; give_away?: number }) => {
    if (!point) {
      toast.error("No point data found!");
      return;
    }

    try {
      setLoading(true);
      await api.point.update(point.id, updateObj as any);

      if (updateObj.point !== undefined) {
        toast.success(`Point updated to ${updateObj.point}`);
      }
      if (updateObj.reedem_amount !== undefined) {
        toast.success(`Redeem amount updated to ${updateObj.reedem_amount}`);
      }
      if (updateObj.give_away !== undefined) {
        toast.success(`Give Away updated to ${updateObj.give_away}`);
      }

      mutate();
    } catch (err: any) {
      console.error(err);
      toast.error("Error updating data");
    } finally {
      setLoading(false);
      setCustomPoint("");
      setCustomRedeem("");
      setCustomGiveaway("");
    }
  };

  // ✅ Increment / Decrement Points
  const handleIncrement = () => {
    if (!point) return;
    updatePoint({ point: point.point + 1 });
  };

  const handleDecrement = () => {
    if (!point) return;
    updatePoint({ point: Math.max(point.point - 1, 0) }); // prevent negative
  };

  // ✅ Handle custom input updates
  const handleCustomPointUpdate = () => {
    const num = parseInt(customPoint);
    if (isNaN(num)) {
      toast.error("Please enter a valid number for points");
      return;
    }
    updatePoint({ point: num });
  };

  const handleCustomRedeemUpdate = () => {
    const num = parseInt(customRedeem);
    if (isNaN(num)) {
      toast.error("Please enter a valid number for redeem amount");
      return;
    }
    updatePoint({ reedem_amount: num });
  };

  const handleCustomGiveawayUpdate = () => {
    const num = parseInt(customGiveaway);
    if (isNaN(num)) {
      toast.error("Please enter a valid number for giveaway amount");
      return;
    }
    updatePoint({ give_away: num });
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

                {/* Custom Point Input */}
                <div className="space-y-2 mt-4">
                  <Input
                    type="number"
                    placeholder="Enter custom point..."
                    value={customPoint}
                    onChange={(e) => setCustomPoint(e.target.value)}
                    className="text-center"
                  />
                  <Button
                    onClick={handleCustomPointUpdate}
                    disabled={loading || !customPoint}
                    className="w-full bg-gradient-primary hover:opacity-90 transition"
                  >
                    Update Point
                  </Button>
                </div>

                {/* Redeem Amount Input */}
                <div className="space-y-2 mt-4">
                  <Input
                    type="number"
                    placeholder="Enter redeem amount..."
                    value={customRedeem}
                    onChange={(e) => setCustomRedeem(e.target.value)}
                    className="text-center"
                  />
                  <Button
                    onClick={handleCustomRedeemUpdate}
                    disabled={loading || !customRedeem}
                    className="w-full bg-gradient-primary hover:opacity-90 transition"
                  >
                    Update Redeem Amount
                  </Button>
                </div>

                {/* Give Away Input */}
                <div className="space-y-2 mt-4">
                  <Input
                    type="number"
                    placeholder="Enter give away amount..."
                    value={customGiveaway}
                    onChange={(e) => setCustomGiveaway(e.target.value)}
                    className="text-center"
                  />
                  <Button
                    onClick={handleCustomGiveawayUpdate}
                    disabled={loading || !customGiveaway}
                    className="w-full bg-gradient-primary hover:opacity-90 transition"
                  >
                    Update Give Away
                  </Button>
                </div>

                {/* Display Current Values */}
                <div className="text-sm text-muted-foreground mt-4 space-y-1">
                  {(point as any).reedem_amount !== undefined && (
                    <p>Current Redeem Amount: {(point as any).reedem_amount}</p>
                  )}
                  {(point as any).give_away !== undefined && (
                    <p>Current Give Away: {(point as any).give_away}</p>
                  )}
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
