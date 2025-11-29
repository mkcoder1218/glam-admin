"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { BASE_URL } from "@/lib/config";
import { mutate } from "swr";

const serviceSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  price: z.string().min(1, "Price is required"),
  product_price: z.string().optional(),
  duration: z.string().min(1, "Duration is required"),

  description: z.string().optional(),
  category_id: z.string().min(1, "Category is required"),
  type_id: z.string().min(1, "Type is required"),
  discount: z.number().min(0).max(100).default(0),
  rating: z.number().min(0).max(5).default(0),
  file_id: z.any().optional(),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

interface UpdateServiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: any;
  onUpdated?: () => void;
}

export const UpdateServiceModal = ({
  open,
  onOpenChange,
  service,
  onUpdated,
}: UpdateServiceModalProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const { data: ServiceCategory } = api.serviceCategory.getAll();
  const { data: serviceType } = api.categoryType.getAll();

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      price: "",
      duration: "",
      description: "",
      category_id: "",
      product_price: "",
      type_id: "",
      discount: 0,
      rating: 0,
      file_id: undefined,
    },
  });

  // 🧠 Prefill all fields + image when service changes
  console.log("service------>>", service);
  useEffect(() => {
    if (service && open) {
      form.reset({
        name: service.name || "",
        price: service.price?.toString() || "",
        duration: service.duration?.toString() || "",
        description: service.description || "",
        category_id:
          service.category_id?.toString() ||
          service.category?.id?.toString() ||
          "",
        type_id:
          service.type_id?.toString() || service.type?.id?.toString() || "",
        discount: service.discount || 0,
        product_price: service.product_price,
        rating: service.rating || 0,
        file_id: service.file_id || undefined,
      });

      // 🖼️ Set correct image preview (server image or local)
      if (service.imagepath) {
        setPreviewUrl(`${BASE_URL}/${service.imagepath}`);
      } else {
        setPreviewUrl(null);
      }
    }
  }, [service, open, form]);
  useEffect(() => {
    if (!open) {
      form.reset({
        name: "",
        price: "",
        duration: "",
        description: "",
        category_id: "",
        product_price: "",
        type_id: "",
        discount: 0,
        rating: 0,
        file_id: undefined,
      });
      setPreviewUrl(null);
    }
  }, [open, form]);

  // ⬆️ Handles file uploads
  const handleFile = async (
    file: File | null,
    onChange: (value: any) => void
  ) => {
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.file.create(formData);
      onChange((res as any)?.id);
    }
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    onChange: (value: any) => void
  ) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file, onChange);
  };

  const onSubmit = async (data: ServiceFormValues) => {
    try {
      await api.service.update(service.id, data as any);
      mutate("/api/service", undefined, { revalidate: true });

      toast({
        title: "Service Updated",
        description: "The service has been successfully updated.",
      });
      onOpenChange(false);
      onUpdated?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update service.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Service</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Service Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Haircut & Style" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price + Duration */}
            <div className="grid  gap-4">
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input placeholder="ETB 0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="product_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Price</FormLabel>
                      <FormControl>
                        <Input placeholder="ETB 0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 45 min" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the service..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category + Type */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ServiceCategory?.data?.map((cat: any) => (
                          <SelectItem key={cat.id} value={cat.id.toString()}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {serviceType?.data?.map((type: any) => (
                          <SelectItem key={type.id} value={type.id.toString()}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Discount + Rating */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating (0–5)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Image Upload */}
            <FormField
              control={form.control}
              name="file_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Image</FormLabel>
                  <div
                    onDrop={(e) => handleDrop(e, field.onChange)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragActive(true);
                    }}
                    onDragLeave={() => setDragActive(false)}
                    className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition ${
                      dragActive
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300"
                    }`}
                    onClick={() =>
                      document.getElementById("update-file-upload")?.click()
                    }
                  >
                    <p className="text-sm text-gray-500">
                      Drag & drop image here, or{" "}
                      <span className="text-blue-600 underline">browse</span>
                    </p>
                    <Input
                      id="update-file-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        handleFile(file ?? null, field.onChange);
                      }}
                    />
                  </div>

                  {previewUrl && (
                    <div className="mt-3">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-40 h-40 object-cover rounded-md border"
                      />
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-primary">
                Update Service
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
