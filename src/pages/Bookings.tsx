"use client";

import { useState, useMemo } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import moment from "moment";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, CheckCircle, X } from "lucide-react";
import { CreateBookingModal } from "@/components/CreateBookingModal";
import { api } from "@/lib/api";
import { QueryParams } from "@/lib/utils";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

// Booking Details Modal
const BookingDetailsModal = ({
  booking,
  onClose,
}: {
  booking: any;
  onClose: () => void;
}) => {
  if (!booking) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-6 border-b pb-2">Booking Details</h2>

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Customer Info</h3>
          <div className="grid grid-cols-2 gap-2">
            <p>
              <span className="font-medium">Name:</span> {booking.User.name}
            </p>
            <p>
              <span className="font-medium">Phone:</span> {booking.User.phone_number}
            </p>
            <p>
              <span className="font-medium">Points:</span> {booking.User.point}
            </p>
            <p>
              <span className="font-medium">Status:</span> {booking.User.status}
            </p>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Service Info</h3>
          <div className="grid grid-cols-2 gap-2">
            <p>
              <span className="font-medium">Name:</span> {booking.Service.name}
            </p>
            <p>
              <span className="font-medium">Price:</span> ${booking.Service.price}
            </p>
            <p>
              <span className="font-medium">Duration:</span> {booking.Service.duration}
            </p>
            <p>
              <span className="font-medium">Description:</span> {booking.Service.description}
            </p>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Booking Info</h3>
          <div className="grid grid-cols-2 gap-2">
            <p>
              <span className="font-medium">Date:</span> {moment(booking.date).format("YYYY-MM-DD")}
            </p>
            <p>
              <span className="font-medium">Time:</span> {moment(booking.time, "HH:mm").format("hh:mm A")}
            </p>
            <p>
              <span className="font-medium">Status:</span>{" "}
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
            </p>
            <p>
              <span className="font-medium">Checked In:</span>{" "}
              {booking.is_checked_in ? (
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Yes
                </Badge>
              ) : (
                <Badge variant="outline">No</Badge>
              )}
            </p>
            <p>
              <span className="font-medium">Created At:</span>{" "}
              {moment(booking.createdAt).format("YYYY-MM-DD hh:mm A")}
            </p>
            <p>
              <span className="font-medium">Updated At:</span>{" "}
              {moment(booking.updatedAt).format("YYYY-MM-DD hh:mm A")}
            </p>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={onClose} className="bg-gray-200 text-gray-700 hover:bg-gray-300">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

// Main Bookings Page
const Bookings = () => {
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
const [hoveredCheckMap, setHoveredCheckMap] = useState<Record<string, boolean>>({});
const handleMouseEnter = (id: string) => {
  setHoveredCheckMap((prev) => ({ ...prev, [id]: true }));
};

const handleMouseLeave = (id: string) => {
  setHoveredCheckMap((prev) => ({ ...prev, [id]: false }));
};
  const userQuery: QueryParams = useMemo(
    () => ({
      search: searchQuery
        ? {
            "Service.name": searchQuery,
            "User.name": searchQuery,
          }
        : undefined,
      limit: 10,
      include: [{ model: "User" }, { model: "Service" }],
      offset: 0,
      order: [["createdAt", "DESC"]],
    }),
    [searchQuery]
  );

  const { data: booking, isLoading: loadingBooking, mutate } = api.booking.getAll(userQuery);

  const bookings = booking?.data ?? [];

  const handleStatusUpdate = (bookingId: string, status: string) => {
    api.booking.update(bookingId, { status }).then(() => {
      mutate();
    });
  };

  return (
    <AdminLayout>
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Booking Management</h1>
            <p className="text-muted-foreground">Manage appointments and check-ins</p>
          </div>
        </div>

        <Card className="p-6">
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bookings by customer or service..."
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Phone number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-medium">{b.User.name}</TableCell>
                  <TableCell>{b.Service.name}</TableCell>
                  <TableCell>{moment(b.date).format("YYYY-MM-DD")}</TableCell>
                  <TableCell>{moment(b.time, "HH:mm").format("hh:mm A")}</TableCell>
                  <TableCell>{<a href={`tel:${b.User?.phone_number}`} className="transition-all duration-300 hover:text-blue-500">{b.User?.phone_number}</a>}</TableCell>
                  <TableCell>
                    <Select
                      value={b.status}
                      onValueChange={(value) => handleStatusUpdate(b.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Idle">Idle</SelectItem>
                        <SelectItem value="Failed">Failed</SelectItem>
                        <SelectItem value="Success">Success</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {b.is_checked_in ? (
                        <Badge
      variant="default"
      className="bg-green-500 cursor-pointer w-[100px] h-[18px] whitespace-nowrap flex items-center"
      onClick={() => {
        api.booking.uncheck(b?.id).then(() => mutate());
      }}
      onMouseEnter={() => handleMouseEnter(b.id)}
      onMouseLeave={() => handleMouseLeave(b.id)}
    >
      <CheckCircle className="h-3 w-3 mr-1" />
      {hoveredCheckMap[b.id] ? "Uncheck" : "Checked In"}
    </Badge>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          api.booking.checkIn(b?.id).then(() => mutate());
                        }}
                      >
                        Check In
                      </Button>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedBooking(b)}
                    >
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {selectedBooking && (
          <BookingDetailsModal
            booking={selectedBooking}
            onClose={() => setSelectedBooking(null)}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default Bookings;
