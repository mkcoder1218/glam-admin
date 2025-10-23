"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { UploadCloud, Grid, List, ImageIcon, Trash2 } from "lucide-react";
import { cn, QueryParams } from "@/lib/utils";
import { api } from "@/lib/api";
import { AdminLayout } from "@/components/AdminLayout";
import { BASE_URL } from "@/lib/config";

interface GalleryItem {
  id: string;
  name: string;
  description: string;
  file_id: string;
  createdAt: string;
}

export default function GalleryPage() {
  const [loading, setLoading] = useState(false);
  const [isGridView, setIsGridView] = useState(true);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileId, setFileId] = useState<string>("");
  const [form, setForm] = useState({ name: "", description: "" });
  const [page, setPage] = useState(0);
  const [pageSize] = useState(9);
  const [searchText, setSearchText] = useState("");

  // Query params
  const query: QueryParams = useMemo(
    () => ({
      search: searchText ? { name: searchText } : undefined,
      limit: pageSize,
      offset: page * pageSize,
      order: [["createdAt", "DESC"]],
      include: [{ model: "File" }],
    }),
    [searchText, page, pageSize]
  );

  const { data: gallery, isLoading: loadingGallery, mutate } = api.gallery.getAll(query);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.file.create(formData);
      console.log(res)
      setFileId((res as any)?.id);
      toast.success("File uploaded successfully");
    } catch (err) {
      toast.error("File upload failed");
    }
  };

  // Create new gallery item
  const handleCreate = async () => {
    if (!form.name || !fileId) {
      toast.error("Please fill all fields and upload a file");
      return;
    }

    try {
      await api.gallery.create({
        name: form.name,
        description: form.description,
        file_id: fileId,
      } as any);
      toast.success("Gallery item created");
      setOpen(false);
      setForm({ name: "", description: "" });
      setFile(null);
      mutate();
    } catch (err) {
      toast.error("Failed to create gallery item");
    }
  };

  // Delete gallery item
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await api.gallery.delete(id);
      toast.success("Gallery item deleted");
      mutate();
    } catch (err) {
      toast.error("Failed to delete gallery item");
    }
  };

  // Handle drag & drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      handleFileUpload(droppedFile);
    }
  };

  // Pagination controls
  const totalPages = gallery?.meta?.total ? Math.ceil(gallery?.meta?.total / pageSize) : 1;

  return (
    <AdminLayout>
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <CardTitle className="text-2xl font-bold">Gallery Management</CardTitle>
        <div className="flex gap-2">
          <Input
            placeholder="Search gallery..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button variant="outline" onClick={() => setIsGridView(!isGridView)}>
            {isGridView ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
          </Button>
          <Button onClick={() => setOpen(true)}>Add New</Button>
        </div>
      </div>

      {/* Loading */}
      {loadingGallery ? (
        <p>Loading...</p>
      ) : gallery?.data?.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-muted-foreground py-12">
          <ImageIcon className="w-12 h-12 mb-3" />
          <p>No gallery items found</p>
        </div>
      ) : isGridView ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {gallery?.data?.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow relative">
              <CardHeader>
                <CardTitle>{item.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <img
              src={BASE_URL+'/'+item?.File?.path}
                  alt={item.name}
                  crossOrigin="anonymous"
                  className="rounded-lg object-cover w-full h-48"
                />
                <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="divide-y rounded-lg border">
          {gallery.data.map((item) => (
            <div key={item.id} className="p-4 flex items-center justify-between hover:bg-muted/40">
              <div className="flex items-center gap-4">
                <img
                  src={{BASE_URL}+'/'+item?.File?.path}
                  alt={item.name}
                  crossOrigin="anonymous"
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <Button
            variant="outline"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
          >
            Previous
          </Button>
          <span>
            Page {page + 1} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
          >
            Next
          </Button>
        </div>
      )}

      {/* Create Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Gallery Item</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Enter gallery name"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Enter description"
              />
            </div>

            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className={cn(
                "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer",
                file ? "border-primary bg-muted/40" : "border-muted"
              )}
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              <UploadCloud className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {file ? file.name : "Drag & drop file here or click to browse"}
              </p>
              <input
                type="file"
                id="fileInput"
                className="hidden"
                onChange={(e) => {
                  const selected = e.target.files?.[0];
                  if (selected) {
                    setFile(selected);
                    handleFileUpload(selected);
                  }
                }}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </AdminLayout>
  );
}
