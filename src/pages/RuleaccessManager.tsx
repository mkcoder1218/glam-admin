

import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

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

export default function RoleAccessManager() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [accessRules, setAccessRules] = useState<AccessRule[]>([]);
  const [loading, setLoading] = useState(false);

  const [newRole, setNewRole] = useState({ name: "", description: "" });
  const [newAccessRule, setNewAccessRule] = useState({ name: "", description: "" });
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [selectedAccessRuleId, setSelectedAccessRuleId] = useState<string>("");
      const {data:resrole,isLoading:roleLoading,mutate:rolemutate} =  api.role.getAll();
      const {data:resroleaccess,isLoading:roleaccessLoading,mutate:roleaccessmutate} =  api.roleAccess.getAll();




  const handleCreateRole = async () => {
    if (!newRole.name) return toast.error("Role name required");
    try {
      setLoading(true);
      api.role.create(newRole as any);
      toast.success("Role created successfully");
      setNewRole({ name: "", description: "" });
        rolemutate()
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
      await api.role.create(newAccessRule as any);
      toast.success("Access Rule created successfully");
      setNewAccessRule({ name: "", description: "" });
roleaccessmutate()
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
      await api.roleAccessrule.create( {
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

  return (
    <AdminLayout>
    <div className="container py-10 space-y-10">
      <h1 className="text-3xl font-bold text-center">Role & Access Rule Manager</h1>

      {/* Create Role */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Create Role</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="roleName">Role Name</Label>
              <Input
                id="roleName"
                placeholder="e.g. Admin"
                value={newRole.name}
                onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="roleDesc">Description</Label>
              <Input
                id="roleDesc"
                placeholder="Describe the role"
                value={newRole.description}
                onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={handleCreateRole} disabled={loading}>
            {loading ? "Creating..." : "Create Role"}
          </Button>
        </CardContent>
      </Card>

      <Separator />

      {/* Create Access Rule */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Create Access Rule</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ruleName">Rule Name</Label>
              <Input
                id="ruleName"
                placeholder="e.g. read_user"
                value={newAccessRule.name}
                onChange={(e) => setNewAccessRule({ ...newAccessRule, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="ruleDesc">Description</Label>
              <Input
                id="ruleDesc"
                placeholder="Describe the rule"
                value={newAccessRule.description}
                onChange={(e) => setNewAccessRule({ ...newAccessRule, description: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={handleCreateAccessRule} disabled={loading}>
            {loading ? "Creating..." : "Create Access Rule"}
          </Button>
        </CardContent>
      </Card>

      <Separator />

      {/* Create Role Access Rule */}
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
                  {resrole?.data?.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Select Access Rule</Label>
              <Select value={selectedAccessRuleId} onValueChange={setSelectedAccessRuleId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an access rule" />
                </SelectTrigger>
                <SelectContent>
                  {resroleaccess?.data?.map((rule) => (
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
    </div>
      </AdminLayout>
  );
}
