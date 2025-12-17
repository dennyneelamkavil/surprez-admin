"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"

const adminUsers = [
  {
    id: 1,
    name: "John Admin",
    email: "john@shop.com",
    avatar: "/placeholder.svg?height=32&width=32",
    role: "Super Admin",
    lastLogin: "2 hours ago",
  },
  {
    id: 2,
    name: "Sarah Manager",
    email: "sarah@shop.com",
    avatar: "/placeholder.svg?height=32&width=32",
    role: "Shop Manager",
    lastLogin: "1 day ago",
  },
  {
    id: 3,
    name: "Mike Support",
    email: "mike@shop.com",
    avatar: "/placeholder.svg?height=32&width=32",
    role: "Support Agent",
    lastLogin: "3 hours ago",
  },
  {
    id: 4,
    name: "Lisa Editor",
    email: "lisa@shop.com",
    avatar: "/placeholder.svg?height=32&width=32",
    role: "Shop Manager",
    lastLogin: "5 days ago",
  },
]

export function AdminUsers() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("shop-manager")

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Dashboard</span>
        <span>/</span>
        <span className="text-foreground">Admin Users & Permissions</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Users</h1>
          <p className="text-muted-foreground mt-1">Manage team access and permissions</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Invite New User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>Send an invitation to add a new team member to your admin panel.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="colleague@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super-admin">Super Admin</SelectItem>
                    <SelectItem value="shop-manager">Shop Manager</SelectItem>
                    <SelectItem value="support-agent">Support Agent</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {role === "super-admin" && "Full access to all features and settings"}
                  {role === "shop-manager" && "Manage products, orders, and customers"}
                  {role === "support-agent" && "View and respond to customer inquiries"}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setOpen(false)}>Send Invitation</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Admin Users Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Last Login</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {adminUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={
                      user.role === "Super Admin"
                        ? "bg-primary/10 text-primary"
                        : user.role === "Shop Manager"
                          ? "bg-info/10 text-info"
                          : "bg-muted text-muted-foreground"
                    }
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{user.lastLogin}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Role Permissions Info */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Super Admin</h3>
          <p className="text-sm text-muted-foreground">
            Full access to all features, settings, and user management. Can create and delete users.
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Shop Manager</h3>
          <p className="text-sm text-muted-foreground">
            Manage products, categories, orders, and customers. Cannot access admin settings.
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Support Agent</h3>
          <p className="text-sm text-muted-foreground">
            View orders and customer information. Can update order statuses and respond to inquiries.
          </p>
        </Card>
      </div>
    </div>
  )
}
