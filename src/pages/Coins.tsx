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
import { Search, Plus, TrendingUp, TrendingDown } from "lucide-react";

const Coins = () => {
  const transactions = [
    { id: 1, user: "Emma Wilson", type: "earned", amount: 50, reason: "Booking completion", date: "2025-10-14", balance: 250 },
    { id: 2, user: "James Chen", type: "spent", amount: 100, reason: "Service discount", date: "2025-10-14", balance: 180 },
    { id: 3, user: "Sarah Johnson", type: "earned", amount: 75, reason: "Referral bonus", date: "2025-10-13", balance: 420 },
    { id: 4, user: "Michael Brown", type: "earned", amount: 25, reason: "Review reward", date: "2025-10-13", balance: 95 },
    { id: 5, user: "Lisa Anderson", type: "spent", amount: 150, reason: "Product purchase", date: "2025-10-12", balance: 310 },
  ];

  return (
    <AdminLayout>
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Coin Management</h1>
            <p className="text-muted-foreground">Track and manage user loyalty coins</p>
          </div>
          <Button className="bg-gradient-primary">
            <Plus className="h-4 w-4 mr-2" />
            Award Coins
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-gradient-card shadow-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Coins Issued</p>
                <h3 className="text-3xl font-bold">45,680</h3>
              </div>
              <div className="p-3 bg-gradient-primary rounded-xl">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-card shadow-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Coins Redeemed</p>
                <h3 className="text-3xl font-bold">12,340</h3>
              </div>
              <div className="p-3 bg-accent rounded-xl">
                <TrendingDown className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-card shadow-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active Balance</p>
                <h3 className="text-3xl font-bold">33,340</h3>
              </div>
              <div className="p-3 bg-gradient-luxury rounded-xl">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                className="pl-10"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.user}</TableCell>
                  <TableCell>
                    <Badge
                      variant={transaction.type === "earned" ? "default" : "outline"}
                      className={transaction.type === "earned" ? "bg-green-500" : ""}
                    >
                      {transaction.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold">
                    <span className={transaction.type === "earned" ? "text-green-600" : "text-red-600"}>
                      {transaction.type === "earned" ? "+" : "-"}{transaction.amount}
                    </span>
                  </TableCell>
                  <TableCell>{transaction.reason}</TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{transaction.balance} coins</Badge>
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

export default Coins;
