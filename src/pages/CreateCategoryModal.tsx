"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface CreateCategoryModalProps {
  onCreated?: () => void;
  children: React.ReactNode;
}

export const CreateCategoryModal = ({
  onCreated,
  children,
}: CreateCategoryModalProps) => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("create");

  const { data: categories, mutate } = api.serviceCategory.getAll();
  const [form, setForm] = useState({ name: "", description: "" });
  const [updateForm, setUpdateForm] = useState({
    id: "",
    name: "",
    description: "",
  });
  const [deleteId, setDeleteId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!form.name.trim()) return;
    setLoading(true);
    try {
      await api.serviceCategory.create(form as any);
      toast.success("Category created!");
      onCreated?.();
      setForm({ name: "", description: "" });
      setOpen(false);
      mutate();
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!updateForm.id) return;
    setLoading(true);
    try {
      await api.serviceCategory.update(updateForm.id, {
        name: updateForm.name,
        description: updateForm.description,
      } as any);
      toast.success("Category updated!");
      onCreated?.();
      setUpdateForm({ id: "", name: "", description: "" });
      setOpen(false);
      mutate();
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const confirmDelete = window.confirm("Are you sure you want to delete this category?");
    if (!confirmDelete) return;

    setLoading(true);
    try {
      await api.serviceCategory.delete(deleteId);
      toast.success("Category deleted!");
      onCreated?.();
      setDeleteId("");
      setOpen(false);
      mutate();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChange = (id: string) => {
    const selected = categories?.data?.find((c) => c.id === id);
    if (selected) {
      setUpdateForm({
        id: selected.id,
        name: selected.name,
        description: selected.description || "",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Category Management</DialogTitle>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="create">Create</TabsTrigger>
            <TabsTrigger value="update">Update</TabsTrigger>
            <TabsTrigger value="delete">Delete</TabsTrigger>
          </TabsList>

          {/* CREATE TAB */}
          <TabsContent value="create" className="space-y-4 mt-4">
            <Input
              placeholder="Category Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
            <Button className="w-full" onClick={handleCreate} disabled={loading}>
              {loading ? "Creating..." : "Create Category"}
            </Button>
          </TabsContent>

          {/* UPDATE TAB */}
          <TabsContent value="update" className="space-y-4 mt-4">
            <Select value={updateForm.id} onValueChange={handleSelectChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a Category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.data?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {updateForm.id && (
              <>
                <Input
                  placeholder="Category Name"
                  value={updateForm.name}
                  onChange={(e) =>
                    setUpdateForm({ ...updateForm, name: e.target.value })
                  }
                />
                <Textarea
                  placeholder="Description"
                  value={updateForm.description}
                  onChange={(e) =>
                    setUpdateForm({
                      ...updateForm,
                      description: e.target.value,
                    })
                  }
                />
                <Button
                  className="w-full"
                  onClick={handleUpdate}
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Category"}
                </Button>
              </>
            )}
          </TabsContent>

          {/* DELETE TAB */}
          <TabsContent value="delete" className="space-y-4 mt-4">
            <Select value={deleteId} onValueChange={setDeleteId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a Category to Delete" />
              </SelectTrigger>
              <SelectContent>
                {categories?.data?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDelete}
              disabled={loading || !deleteId}
            >
              {loading ? "Deleting..." : "Delete Category"}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
