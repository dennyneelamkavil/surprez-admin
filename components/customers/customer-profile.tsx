"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Mail, Phone, Calendar, MapPin, MoreHorizontal, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
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

const customerData = {
  id: 1,
  name: "Lucian Obrien",
  email: "ashlynn.ohara62@gmail.com",
  phone: "365-374-4961",
  avatar: "/placeholder.svg?height=80&width=80",
  joinedDate: "15 Jan 2024",
  totalOrders: 18,
  totalSpend: "$1,923.00",
  status: "Active",
  addresses: [
    {
      id: 1,
      type: "Home",
      address: "19034 Verna Unions Apt. 164",
      city: "Honolulu, RI 87535",
      isDefault: true,
    },
    {
      id: 2,
      type: "Office",
      address: "1147 Rohan Drive Suite 819",
      city: "New York, NY 10001",
      isDefault: false,
    },
  ],
  recentOrders: [
    {
      id: "#60111",
      date: "15 Dec 2025",
      total: "$83.74",
      status: "completed",
      items: 1,
    },
    {
      id: "#60089",
      date: "10 Dec 2025",
      total: "$234.50",
      status: "completed",
      items: 3,
    },
    {
      id: "#60065",
      date: "05 Dec 2025",
      total: "$156.20",
      status: "shipped",
      items: 2,
    },
    {
      id: "#60042",
      date: "28 Nov 2025",
      total: "$445.00",
      status: "completed",
      items: 5,
    },
  ],
}

export function CustomerProfile({ customerId }: { customerId: string }) {
  const router = useRouter()
  const [deleteOpen, setDeleteOpen] = useState(false)

  const handleDelete = () => {
    console.log("Deleting customer:", customerId)
    setDeleteOpen(false)
    router.push("/customers")
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Dashboard
        </Link>
        <span>/</span>
        <Link href="/customers" className="hover:text-foreground">
          Customers
        </Link>
        <span>/</span>
        <span className="text-foreground">Profile</span>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Customer Profile</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/customers/${customerId}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Customer
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Customer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Customer Info */}
        <div className="space-y-6">
          {/* Customer Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={customerData.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{customerData.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{customerData.name}</h3>
                  <Badge variant="outline" className="mt-2 bg-success/10 text-success border-success/20">
                    {customerData.status}
                  </Badge>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{customerData.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{customerData.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Joined {customerData.joinedDate}</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-lg border bg-muted/30 p-3 text-center">
                  <p className="text-2xl font-bold">{customerData.totalOrders}</p>
                  <p className="text-xs text-muted-foreground">Total Orders</p>
                </div>
                <div className="rounded-lg border bg-muted/30 p-3 text-center">
                  <p className="text-2xl font-bold">{customerData.totalSpend}</p>
                  <p className="text-xs text-muted-foreground">Total Spend</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Addresses */}
          <Card>
            <CardHeader>
              <CardTitle>Saved Addresses</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {customerData.addresses.map((address) => (
                <div key={address.id} className="space-y-2 pb-4 border-b last:border-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-sm">{address.type}</span>
                    </div>
                    {address.isDefault && (
                      <Badge variant="secondary" className="text-xs">
                        Default
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground pl-6">{address.address}</p>
                  <p className="text-sm text-muted-foreground pl-6">{address.city}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Order History */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerData.recentOrders.map((order) => (
                    <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium text-primary">{order.id}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>{order.items}</TableCell>
                      <TableCell className="font-medium">{order.total}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            order.status === "completed"
                              ? "bg-success text-success-foreground"
                              : order.status === "shipped"
                                ? "bg-info text-info-foreground"
                                : "bg-warning text-warning-foreground"
                          }
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
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
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
