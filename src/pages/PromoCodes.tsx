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

const PromoCodes = () => {
  const promoCodes = [
    { id: 1, code: "WELCOME20", discount: "20%", uses: 45, maxUses: 100, expires: "2025-12-31", status: "active" },
    { id: 2, code: "FIRST50", discount: "$50", uses: 23, maxUses: 50, expires: "2025-11-30", status: "active" },
    { id: 3, code: "SUMMER25", discount: "25%", uses: 89, maxUses: 200, expires: "2025-09-30", status: "expired" },
    { id: 4, code: "VIP15", discount: "15%", uses: 12, maxUses: "unlimited", expires: "2026-01-31", status: "active" },
    { id: 5, code: "LOYALTY10", discount: "10%", uses: 156, maxUses: "unlimited", expires: "2026-06-30", status: "active" },
  ];

  return (
    <AdminLayout>
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Promo Code Management</h1>
            <p className="text-muted-foreground">Create and manage promotional codes</p>
          </div>
          <Button className="bg-gradient-primary">
            <Plus className="h-4 w-4 mr-2" />
            Create Code
          </Button>
        </div>

        <Card className="p-6">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search promo codes..."
                className="pl-10"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Max Uses</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promoCodes.map((promo) => (
                <TableRow key={promo.id}>
                  <TableCell className="font-mono font-bold">{promo.code}</TableCell>
                  <TableCell className="font-semibold text-accent">{promo.discount}</TableCell>
                  <TableCell>{promo.uses}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{promo.maxUses}</Badge>
                  </TableCell>
                  <TableCell>{promo.expires}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        promo.status === "active"
                          ? "default"
                          : promo.status === "expired"
                          ? "outline"
                          : "secondary"
                      }
                    >
                      {promo.status}
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
                        <DropdownMenuItem>Edit Code</DropdownMenuItem>
                        <DropdownMenuItem>View Analytics</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Deactivate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default PromoCodes;
