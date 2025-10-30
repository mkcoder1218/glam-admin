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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface CreateTypeModalProps {
  onCreated?: () => void;
  children: React.ReactNode;
}

export const CreateTypeModal = ({ onCreated, children }: CreateTypeModalProps) => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("create");

  const { data: types, mutate: mutateTypes } = api.categoryType.getAll();
  const { data: categories } = api.serviceCategory.getAll();

  const [form, setForm] = useState({ name: "", description: "", service_category_id: "" });
  const [updateForm, setUpdateForm] = useState({ id: "", name: "", description: "", service_category_id: "" });
  const [deleteId, setDeleteId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!form.name.trim() || !form.service_category_id) {
      toast.error("Please enter name and select a category");
      return;
    }
    setLoading(true);
    try {
      await api.categoryType.create(form as any);
      toast.success("Type created!");
      onCreated?.();
      setForm({ name: "", description: "", service_category_id: "" });
      setOpen(false);
      mutateTypes();
    } catch (error) {
      console.error("Error creating type:", error);
      toast.error("Failed to create type");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!updateForm.id || !updateForm.service_category_id) {
      toast.error("Please select a type and category");
      return;
    }
    setLoading(true);
    try {
      await api.categoryType.update(updateForm.id, {
        name: updateForm.name,
        description: updateForm.description,
        service_category_id: updateForm.service_category_id,
      } as any);
      toast.success("Type updated!");
      onCreated?.();
      setUpdateForm({ id: "", name: "", description: "", service_category_id: "" });
      setOpen(false);
      mutateTypes();
    } catch (error) {
      console.error("Error updating type:", error);
      toast.error("Failed to update type");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const confirmDelete = window.confirm("Are you sure you want to delete this type?");
    if (!confirmDelete) return;

    setLoading(true);
    try {
      await api.categoryType.delete(deleteId);
      toast.success("Type deleted!");
      onCreated?.();
      setDeleteId("");
      setOpen(false);
      mutateTypes();
    } catch (error) {
      console.error("Error deleting type:", error);
      toast.error("Failed to delete type");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = types?.data?.find((t) => t.id === e.target.value);
    if (selected) {
      setUpdateForm({
        id: selected.id,
        name: selected.name,
        description: selected.description || "",
        service_category_id: selected.service_category_id || "",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Type Management</DialogTitle>
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
              placeholder="Type Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <Select
              onValueChange={(val) => setForm({ ...form, service_category_id: val })}
              value={form.service_category_id}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.data?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button className="w-full" onClick={handleCreate} disabled={loading}>
              {loading ? "Creating..." : "Create Type"}
            </Button>
          </TabsContent>

          {/* UPDATE TAB */}
          <TabsContent value="update" className="space-y-4 mt-4">
            <Select
              onValueChange={(val) => {
                const selected = types?.data?.find((t) => t.id === val);
                if (selected) {
                  setUpdateForm({
                    id: selected.id,
                    name: selected.name,
                    description: selected.description || "",
                    service_category_id: selected.service_category_id || "",
                  });
                }
              }}
              value={updateForm.id}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a Type" />
              </SelectTrigger>
              <SelectContent>
                {types?.data?.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {updateForm.id && (
              <>
                <Input
                  placeholder="Type Name"
                  value={updateForm.name}
                  onChange={(e) =>
                    setUpdateForm({ ...updateForm, name: e.target.value })
                  }
                />
                <Textarea
                  placeholder="Description"
                  value={updateForm.description}
                  onChange={(e) =>
                    setUpdateForm({ ...updateForm, description: e.target.value })
                  }
                />
                <Select
                  onValueChange={(val) => setUpdateForm({ ...updateForm, service_category_id: val })}
                  value={updateForm.service_category_id}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
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
                  className="w-full"
                  onClick={handleUpdate}
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Type"}
                </Button>
              </>
            )}
          </TabsContent>

          {/* DELETE TAB */}
          <TabsContent value="delete" className="space-y-4 mt-4">
            <Select
              onValueChange={setDeleteId}
              value={deleteId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a Type to Delete" />
              </SelectTrigger>
              <SelectContent>
                {types?.data?.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDelete}
              disabled={loading || !deleteId}
            >
              {loading ? "Deleting..." : "Delete Type"}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
