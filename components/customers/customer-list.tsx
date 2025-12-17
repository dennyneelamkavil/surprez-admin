"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import { useRouter } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const customers = [
  {
    id: 1,
    name: "Jayvion Simon",
    email: "nannie.abernathy70@yahoo.com",
    avatar: "/placeholder.svg?height=32&width=32",
    totalOrders: 24,
    totalSpend: "$2,845.50",
    accountCreated: "12 Jan 2024",
  },
  {
    id: 2,
    name: "Lucian Obrien",
    email: "ashlynn.ohara62@gmail.com",
    avatar: "/placeholder.svg?height=32&width=32",
    totalOrders: 18,
    totalSpend: "$1,923.00",
    accountCreated: "08 Feb 2024",
  },
  {
    id: 3,
    name: "Soren Durham",
    email: "vergie.block82@hotmail.com",
    avatar: "/placeholder.svg?height=32&width=32",
    totalOrders: 32,
    totalSpend: "$4,122.75",
    accountCreated: "03 Mar 2024",
  },
  {
    id: 4,
    name: "Cortez Herring",
    email: "vito.hudson@hotmail.com",
    avatar: "/placeholder.svg?height=32&width=32",
    totalOrders: 12,
    totalSpend: "$1,456.00",
    accountCreated: "15 Mar 2024",
  },
  {
    id: 5,
    name: "Emily Chen",
    email: "emily.chen@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
    totalOrders: 45,
    totalSpend: "$6,234.90",
    accountCreated: "22 Apr 2024",
  },
]

export function CustomerList() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const handleDelete = (id: number) => {
    console.log("Deleting customer:", id)
    setDeleteId(null)
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Dashboard</span>
        <span>/</span>
        <span className="text-foreground">Customers</span>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </Card>

      {/* Customers Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Total Orders</TableHead>
              <TableHead>Total Spend</TableHead>
              <TableHead>Account Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={customer.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{customer.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{customer.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{customer.email}</TableCell>
                <TableCell>{customer.totalOrders}</TableCell>
                <TableCell className="font-medium">{customer.totalSpend}</TableCell>
                <TableCell className="text-muted-foreground">{customer.accountCreated}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => router.push(`/customers/${customer.id}`)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push(`/customers/${customer.id}/edit`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => setDeleteId(customer.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Customer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this customer? This action cannot be undone and will remove all associated
              orders and data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
