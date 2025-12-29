import { useState, useMemo } from "react";
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
import { Search, Plus, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

import { api } from "@/lib/api";
import { QueryParams } from "@/lib/utils";

// --- Loading Shimmer ---
const LoadingRow = () => (
  <TableRow>
    {Array.from({ length: 6 }).map((_, idx) => (
      <TableCell key={idx}>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
      </TableCell>
    ))}
  </TableRow>
);

const Users = () => {
  // --- Pagination & Filters ---
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRole, setSelectedRole] = useState<string | undefined>(undefined);

  // --- Modal & Form ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [form, setForm] = useState<{
    name: string,
    point: string,
    phone_number: string,
    status: string,
    password?: string,
    role_id: string,
  }>({
    name: "",
    point: "",
    phone_number: "",
    status: "Active",
    password: "",
    role_id: "",
  });

  // --- Queries ---
  const query: QueryParams = useMemo(
    () => ({
      search: searchText ? { name: searchText } : undefined,
      limit: pageSize,
      filters: selectedRole ? { role_id: selectedRole } : undefined,
      offset: page * pageSize,
      order: [["createdAt", "DESC"]],
    }),
    [searchText, page, pageSize, selectedRole]
  );

  const roleQuery: QueryParams = useMemo(
    () => ({
      limit: 1000,
      offset: 0,
      order: [["createdAt", "DESC"]],
    }),
    []
  );

  const { data: usersData, isLoading, mutate: mutateUsers } = api.user.getAll(query);
  const { data: rolesData } = api.role.getAll(roleQuery);

  const users =
    usersData?.data?.map((user) => ({
      id: user.id,
      name: user.name,
      role_id: user.role_id,
      phone: user.phone_number,
      coins: user.point,
      status: user.status,
    })) ?? [];

  const total = (usersData?.meta as any)?.total ?? 0;

  // --- Handlers ---
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setPage(0);
  };

  const handlePrevPage = () => setPage((p) => Math.max(p - 1, 0));
  const handleNextPage = () => {
    const maxPage = Math.floor((total - 1) / pageSize);
    setPage((p) => Math.min(p + 1, maxPage));
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (val: string) => {
    setForm((prev) => ({ ...prev, role_id: val }));
  };

  const openAddUserModal = () => {
    setEditingUser(null);
    setForm({ name: "", phone_number: "", point: "", status: "active", password: "", role_id: "" });
    setIsModalOpen(true);
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      phone_number: user.phone,
      point: user?.coins?.toString(),
      status: user.status,
      role_id: user.role_id,
    });
    setIsModalOpen(true);
  };

  const handleManageCoins = (user: any) => {
    const coinsToAdd = prompt("Enter coins to add:", "0");
    if (coinsToAdd !== null) {
      api.user.update(user.id, { point: Number(user.coins) + Number(coinsToAdd) })
        .then(() => mutateUsers())
        .catch(console.error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingUser) {
        await api.user.update(editingUser.id, { ...form, point: Number(form.point) });
      } else {
        await api.regester.create({ ...form });
      }
      setIsModalOpen(false);
      setForm({ name: "", phone_number: "", point: "", status: "active", password: "", role_id: "" });
      setEditingUser(null);
      mutateUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusToggle = async (userId: string, currentStatus: string) => {
    try {
      await api.user.update(userId, { status: currentStatus === "Active" ? "Inactive" : "Active" });
      mutateUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">User Management</h1>
            <p className="text-muted-foreground">Manage your salon customers</p>
          </div>
          <Button className="bg-gradient-primary" onClick={openAddUserModal}>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
                <DialogDescription>
                  {editingUser ? "Update user information." : "Fill out the form below to create a new user."}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input placeholder="Name" name="name" value={form.name} onChange={handleFormChange} required />
                <Input placeholder="Phone Number" name="phone_number" value={form.phone_number} onChange={handleFormChange} />
                <Input placeholder="Point" name="point" value={form.point} onChange={handleFormChange} />
                <Select onValueChange={handleRoleChange}>
                  <SelectTrigger>{form.role_id ? rolesData?.data?.find(r => r.id === form.role_id)?.name : "Choose Role"}</SelectTrigger>
                  <SelectContent>
                    {rolesData?.data?.map((role) => (
                      <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!editingUser && (
                  <Input placeholder="Password" type="password" name="password" value={form.password} onChange={handleFormChange} required />
                )}
              </div>
              <DialogFooter>
                <Button onClick={handleSubmit}>{editingUser ? "Update User" : "Create User"}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Card */}
        <Card className="p-6">
          <div className="mb-6 flex justify-between">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search users by name..." className="pl-10" value={searchText} onChange={handleSearchChange} />
            </div>
            <Select onValueChange={(val) => setSelectedRole(val as any)}>
              <SelectTrigger className="max-w-fit">Role Filter</SelectTrigger>
              <SelectContent>
                <SelectItem value={undefined}>All</SelectItem>
                {rolesData?.data?.map((role) => (
                  <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Coins</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: pageSize }).map((_, idx) => <LoadingRow key={idx} />)
                : users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>{user.coins} coins</TableCell>
                      <TableCell><Badge variant="secondary">{user.status}</Badge></TableCell>
                      <TableCell>
                        <Badge variant="default">
                          {rolesData?.data?.find((item) => item.id === user.role_id)?.name}
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
                            <DropdownMenuItem onClick={() => handleEditUser(user)}>Edit User</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleManageCoins(user)}>Manage Coins</DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleStatusToggle(user.id, user.status)}
                              className="text-destructive"
                            >
                              {user.status === "Active" ? "Deactivate" : "Activate"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>

          <div className="flex justify-between items-center mt-4">
            <Button onClick={handlePrevPage} disabled={page === 0}>Previous</Button>
            <span>Page {page + 1} of {Math.max(1, Math.ceil(total / pageSize))}</span>
            <Button onClick={handleNextPage} disabled={page + 1 >= Math.ceil(total / pageSize)}>Next</Button>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Users;
