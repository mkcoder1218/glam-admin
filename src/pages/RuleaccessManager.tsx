"use client";
import React, { useState } from "react";
import {
  Button,
} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import { api } from "@/lib/api";

interface Role {
  id: string;
  name: string;
  description: string;
}

interface AccessRule {
  id: string;
  name: string;
  description: string;
}

type DeleteTarget = { id: string; name: string; type: "role" | "access" } | null;

export default function RoleAccessManager() {
  const [loading, setLoading] = useState(false);
  const [newRole, setNewRole] = useState({ name: "", description: "" });
  const [newAccessRule, setNewAccessRule] = useState({
    name: "",
    description: "",
  });
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [selectedAccessRuleId, setSelectedAccessRuleId] = useState<string>("");

  const {
    data: resrole,
    mutate: rolemutate,
  } = api.role.getAll();
  const {
    data: resroleaccess,
    mutate: roleaccessmutate,
  } = api.roleAccess.getAll();

  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleCreateRole = async () => {
    if (!newRole.name) return toast.error("Role name required");
    try {
      setLoading(true);
      await api.role.create(newRole as any);
      toast.success("Role created successfully");
      setNewRole({ name: "", description: "" });
      rolemutate();
    } catch (err: any) {
      toast.error(err.message || "Failed to create role");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccessRule = async () => {
    if (!newAccessRule.name) return toast.error("Access rule name required");
    try {
      setLoading(true);
      await api.roleAccess.create(newAccessRule as any);
      toast.success("Access Rule created successfully");
      setNewAccessRule({ name: "", description: "" });
      roleaccessmutate();
    } catch (err: any) {
      toast.error(err.message || "Failed to create access rule");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoleAccessRule = async () => {
    if (!selectedRoleId || !selectedAccessRuleId)
      return toast.error("Select both Role and Access Rule");
    try {
      setLoading(true);
      await api.roleAccessrule.create({
        role_id: selectedRoleId,
        access_rule_id: selectedAccessRuleId,
      } as any);
      toast.success("Role Access Rule linked successfully");
      setSelectedRoleId("");
      setSelectedAccessRuleId("");
    } catch (err: any) {
      toast.error(err.message || "Failed to link role and access rule");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (target: DeleteTarget) => {
    setDeleteTarget(target);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setLoading(true);
      if (deleteTarget.type === "role") {
        await api.role.delete(deleteTarget.id);
        rolemutate();
      } else {
        await api.roleAccess.delete(deleteTarget.id);
        roleaccessmutate();
      }
      toast.success(`"${deleteTarget.name}" deleted successfully`);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete");
    } finally {
      setLoading(false);
      setIsDeleteDialogOpen(false);
      setDeleteTarget(null);
    }
  };

  return (
    <AdminLayout>
      <div className="container py-10 space-y-10">
        <h1 className="text-3xl font-bold text-center">
          Role & Access Rule Manager
        </h1>

        {/* Create Role */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Create Role</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Role Name</Label>
                <Input
                  placeholder="e.g. Admin"
                  value={newRole.name}
                  onChange={(e) =>
                    setNewRole({ ...newRole, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  placeholder="Describe the role"
                  value={newRole.description}
                  onChange={(e) =>
                    setNewRole({ ...newRole, description: e.target.value })
                  }
                />
              </div>
            </div>
            <Button onClick={handleCreateRole} disabled={loading}>
              {loading ? "Creating..." : "Create Role"}
            </Button>

            <Separator className="my-4" />

            <div>
              <h3 className="font-semibold mb-2">Existing Roles</h3>
              <div className="grid gap-2 grid-cols-4">
                {resrole?.data?.length ? (
                  resrole.data.map((role: Role) => (
                    <div
                      key={role.id}
                      className="flex items-center text-xs justify-between border rounded-lg px-2 py-1 hover:bg-muted/40 transition"
                    >
                      <div>
                        <p className="font-medium ">{role.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {role.description || "No description"}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hover:text-red-700"
                        onClick={() =>
                          confirmDelete({
                            id: role.id,
                            name: role.name,
                            type: "role",
                          })
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No roles found.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Create Access Rule */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Create Access Rule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Rule Name</Label>
                <Input
                  placeholder="e.g. read_user"
                  value={newAccessRule.name}
                  onChange={(e) =>
                    setNewAccessRule({
                      ...newAccessRule,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  placeholder="Describe the rule"
                  value={newAccessRule.description}
                  onChange={(e) =>
                    setNewAccessRule({
                      ...newAccessRule,
                      description: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <Button onClick={handleCreateAccessRule} disabled={loading}>
              {loading ? "Creating..." : "Create Access Rule"}
            </Button>

            <Separator className="my-4" />

            <div>
              <h3 className="font-semibold mb-2">Existing Access Rules</h3>
              <div className="grid grid-cols-4 gap-2">
                {resroleaccess?.data?.length ? (
                  resroleaccess.data.map((rule: AccessRule) => (
                    <div
                      key={rule.id}
                      className="flex items-center justify-between border rounded-lg px-2 py-1 hover:bg-muted/40 transition"
                    >
                      <div>
                        <p className="font-medium text-xs">{rule.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {rule.description || "No description"}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hover:text-red-700"
                        onClick={() =>
                          confirmDelete({
                            id: rule.id,
                            name: rule.name,
                            type: "access",
                          })
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No access rules found.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Link Role to Access Rule */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Link Role to Access Rule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Select Role</Label>
                <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {resrole?.data?.map((role: Role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Select Access Rule</Label>
                <Select
                  value={selectedAccessRuleId}
                  onValueChange={setSelectedAccessRuleId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an access rule" />
                  </SelectTrigger>
                  <SelectContent className="">
                    {resroleaccess?.data?.map((rule: AccessRule) => (
                      <SelectItem key={rule.id} value={rule.id}>
                        {rule.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleCreateRoleAccessRule} disabled={loading}>
              {loading ? "Linking..." : "Link Role & Rule"}
            </Button>
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete{" "}
                <strong>{deleteTarget?.name}</strong>? This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
