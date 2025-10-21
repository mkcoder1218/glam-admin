import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { mutate } from "swr";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

const serviceSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  price: z.string().min(1, "Price is required"),
  duration: z.string().min(1, "Duration is required"),
  description: z.string().optional(),
  category_id: z.string().min(1, "Category is required"),
  type_id: z.string().min(1, "Type is required"),
  discount: z.number().min(0).max(100).default(0),
  rating: z.number().min(0).max(5).default(0),
  // review_id: z.string().optional(),
  file_id: z.any().optional(), // changed from file_id
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

interface CreateServiceModalProps {
  children: React.ReactNode;
    onCreated?: () => void; // callback to refresh services

}

export const CreateServiceModal = ({ children,onCreated }: CreateServiceModalProps) => {
  const [open, setOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
const {data:ServiceCategory,isLoading:serviceCategoryLoading}=api.serviceCategory.getAll()
const {data:serviceType,isLoading:serviceTypeLoading}=api.categoryType.getAll()
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      price: "",
      duration: "",
      description: "",
      category_id: "",
      type_id: "",
      discount: 0,
      rating: 0,
      // review_id: "",
      file_id: undefined,
    },
  });

  const handleFile = async (file: File | null, onChange: (value: any) => void) => {
    if (file) {
      onChange(file);
      setPreviewUrl(URL.createObjectURL(file));
      const fileForm=new FormData()
      console.log(file)
      fileForm.append('file',file)
      const res=await api.file.create(fileForm)
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
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", data.price);
    formData.append("duration", data.duration);
    formData.append("description", data.description || "");
    formData.append("category_id", data.category_id);
    formData.append("type_id", data.type_id);
    formData.append("discount", data.discount.toString());
    formData.append("rating", data.rating.toString());
    if (data.file_id instanceof File) {
      formData.append("file_id", data.file_id);
    }

    // console.log(Object.fromEntries(formData.entries()));
    // await fetch("/api/services", { method: "POST", body: formData });

    
      api.service.create(form.control._formValues).then(()=>{
        toast({
      title: "Service created",
      description: "The service has been created successfully.",
    });
    onCreated?.();
  })
    setOpen(false);
    // form.reset();
    setPreviewUrl(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Service</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* name */}
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

            {/* price + duration */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input placeholder="$0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

            {/* description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the service..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* category + type */}
            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                     {ServiceCategory?.data?.map((item)=>{return(<SelectItem value={item.id}>{item.name}</SelectItem>)}) }
                     
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {serviceType?.data?.map((type)=>{return(<SelectItem value={type?.id}>{type?.name}</SelectItem>)})}
                  
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* discount + rating */}
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
                        placeholder="0"
                        {...field}
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
                    <FormLabel>Rating (0-5)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* ✅ Drag & drop image upload */}
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
                    className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition
                      ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
                    onClick={() => {
                      const input = document.getElementById("file-upload");
                      input?.click();
                    }}
                  >
                    <p className="text-sm text-gray-500">
                      Drag & drop image here, or <span className="text-blue-600 underline">browse</span>
                    </p>
                    <Input
                      id="file-upload"
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

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-primary">
                Create Service
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
