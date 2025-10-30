"use client";
import { AdminLayout } from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  MoreVertical,
  ChevronRight,
  ChevronLeft,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateServiceModal } from "@/components/CreateServiceModal";
import { useMemo, useState } from "react";
import { api } from "@/lib/api";
import { QueryParams } from "@/lib/utils";
import { BASE_URL } from "@/lib/config";
import { UpdateServiceModal } from "@/components/UpdateServiceModal";
import { CreateCategoryModal } from "./CreateCategoryModal";
import { CreateTypeModal } from "./CreateTypeModal";
import { toast } from "sonner";

const Services = () => {
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);

  const query: QueryParams = useMemo(
    () => ({
      search: searchText ? { name: searchText } : undefined,
      limit: pageSize,
      offset: page * pageSize,
      order: [["createdAt", "DESC"]],
      include: [
        { model: "ServiceCategory" },
        { model: "CategoryType" },
        { model: "File" },
      ],
    }),
    [searchText, page, pageSize]
  );

  const {
    data: serviceslist,
    isLoading: serviceLoading,
    mutate,
  } = api.service.getAll(query);

  const services = serviceslist?.data?.map((item: any) => ({
    id: item?.id,
    imagepath: item?.File?.path,
    name: item?.name,
    duration: item?.duration,
    price: item?.price,
    description: item?.description,
    category_id: item?.ServiceCategory?.id,
    type_id: item?.CategoryType?.id,
    product_price:item?.product_price,
    category: item?.ServiceCategory?.name,
    status: item?.rating,
  }));

  const totalPages = Math.ceil((serviceslist?.meta?.total || 0) / pageSize);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setPage(0);
  };

  const handlePrevPage = () => setPage((prev) => Math.max(prev - 1, 0));
  const handleNextPage = () =>
    setPage((prev) => Math.min(prev + 1, totalPages - 1));

  const handleDeleteService = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this service?");
    if (!confirmDelete) return;

    try {
      setDeleting(true);
      await api.service.delete( id );
      toast.success("Service deleted successfully!");
      mutate(); // refresh list
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to delete service");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Service Management</h1>
            <p className="text-muted-foreground">
              Manage your salon services and pricing
            </p>
          </div>
          <div className="flex gap-3">
            <CreateCategoryModal onCreated={() => mutate()}>
              <Button variant="outline">
                <Plus className="h-4 w-4" />
                Add Category
              </Button>
            </CreateCategoryModal>

            <CreateTypeModal onCreated={() => mutate()}>
              <Button variant="outline">
                <Plus className="h-4 w-4 " />
                Add Type
              </Button>
            </CreateTypeModal>

            <CreateServiceModal onCreated={() => mutate()}>
              <Button className="bg-gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            </CreateServiceModal>
          </div>
        </div>

        <Card className="p-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search services..."
              className="pl-10"
              value={searchText}
              onChange={handleSearchChange}
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Service Name</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services?.map((service) => (
                <TableRow
                  key={service.id}
                  className="hover:bg-muted/30"
                >
                  <TableCell>
                    <img
                      className="w-10 h-10 rounded"
                      src={`${BASE_URL}/${service.imagepath}`}
                      alt=""
                      crossOrigin="anonymous"
                    />
                  </TableCell>
                  <TableCell>{service.name}</TableCell>
                  <TableCell>{service.duration}</TableCell>
                  <TableCell className="font-semibold">
                    {service.price}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{service.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        service.status === "active" ? "default" : "outline"
                      }
                    >
                      {service.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedService(service);
                            setEditOpen(true);
                          }}
                        >
                          Edit Service
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => handleDeleteService(service.id)}
                          disabled={deleting}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Service
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <Button onClick={handlePrevPage} disabled={page === 0}>
              Previous
            </Button>
            <span>
              Page {page + 1} of{" "}
              {Math.max(1, Math.ceil((serviceslist?.meta?.total || 0) / pageSize))}
            </span>
            <Button
              onClick={handleNextPage}
              disabled={page + 1 >= Math.ceil((serviceslist?.meta?.total || 0) / pageSize)}
            >
              Next
            </Button>
          </div>
        </Card>
      </div>

      {/* Update Modal */}
      <UpdateServiceModal
        open={editOpen}
        onOpenChange={setEditOpen}
        service={selectedService}
        onUpdated={() => mutate()}
      />
    </AdminLayout>
  );
};

export default Services;
