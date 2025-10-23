"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { AdminLayout } from "@/components/AdminLayout";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

interface PromoCode {
  id: string;
  code: string;
  discount: number;
  valid_until: string;
  createdAt: string;
  updatedAt: string;
}

export default function PromoCodeManager() {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<PromoCode | null>(null);
  const { data: promoCodes, isLoading: isPromoLoading, mutate } = api.promocode.getAll();

  const [form, setForm] = useState({
    code: "",
    discount: "",
    valid_until: "",
  });

  const [date, setDate] = useState<Date | undefined>(undefined);

  // ✅ Sync date picker value with form.valid_until
  useEffect(() => {
    if (date) {
      const formatted = format(date, "yyyy-MM-dd");
      setForm((prev) => ({ ...prev, valid_until: formatted }));
    }
  }, [date]);

  // ✅ Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Create or Update Promo Code
  const handleSubmit = async () => {
    if (!form.code || !form.discount || !form.valid_until) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);

      if (editData) {
        await api.promocode.update(editData.id, {
          code: form.code,
          discount: Number(form.discount),
          valid_until: form.valid_until,
        } as any);
        toast.success("Promo code updated successfully");
      } else {
        await api.promocode.create({
          code: form.code,
          discount: Number(form.discount),
          valid_until: form.valid_until,
        } as any);
        toast.success("Promo code created successfully");
      }

      setOpen(false);
      setForm({ code: "", discount: "", valid_until: "" });
      setDate(undefined);
      setEditData(null);
      mutate();
    } catch (error: any) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Open Modal for Create or Edit
  const openModal = (data?: PromoCode) => {
    if (data) {
      setEditData(data);
      setForm({
        code: data.code,
        discount: String(data.discount),
        valid_until: data.valid_until,
      });
      setDate(data.valid_until ? new Date(data.valid_until) : undefined);
    } else {
      setEditData(null);
      setForm({ code: "", discount: "", valid_until: "" });
      setDate(undefined);
    }
    setOpen(true);
  };

  // ✅ Delete Promo Code
  const handleDelete = async (id: string) => {
    try {
      await api.promocode.delete(id);
      toast.success("Promo code deleted");
      mutate();
    } catch (error) {
      toast.error("Failed to delete promo code");
    }
  };

  return (
    <AdminLayout>
      <div className="container py-10">
        <Card className="shadow-card border border-border">
          <CardHeader className="flex justify-between items-center flex-row">
            <CardTitle className="text-lg font-semibold">
              Promo Code Management
            </CardTitle>
            <Button onClick={() => openModal()} className="bg-gradient-primary text-white">
              + New Promo Code
            </Button>
          </CardHeader>
          <CardContent className="border-none shadow-none">
            {loading ? (
              <p className="text-center text-muted-foreground">Loading...</p>
            ) : promoCodes?.data?.length === 0 ? (
              <p className="text-center text-muted-foreground">
                No promo codes found.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-border rounded-lg overflow-hidden">
                  <thead className="text-foreground">
                    <tr>
                      <th className="px-4 py-2 text-left">Code</th>
                      <th className="px-4 py-2 text-left">Discount (%)</th>
                      <th className="px-4 py-2 text-left">Valid Until</th>
                      <th className="px-4 py-2 text-left">Created</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {promoCodes?.data?.map((promo) => (
                      <tr
                        key={promo.id}
                        className="border-t border-border hover:bg-accent/30 transition"
                      >
                        <td className="px-4 py-2">{promo.code}</td>
                        <td className="px-4 py-2">{promo.discount}</td>
                        <td className="px-4 py-2">{promo.valid_until}</td>
                        <td className="px-4 py-2">
                          {new Date(promo.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2 flex gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => openModal(promo)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(promo.id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ✅ Modal for Create / Update */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editData ? "Edit Promo Code" : "Create Promo Code"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div>
                <Label>Code</Label>
                <Input
                  name="code"
                  placeholder="Enter code"
                  value={form.code}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>Discount (%)</Label>
                <Input
                  type="number"
                  name="discount"
                  placeholder="Enter discount"
                  value={form.discount}
                  onChange={handleChange}
                />
              </div>

              {/* ✅ Valid Until Date Picker */}
              <div>
                <Label>Valid Until</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${
                        !date && "text-muted-foreground"
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Select a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="secondary"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {editData ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
