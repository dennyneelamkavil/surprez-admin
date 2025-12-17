"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Calendar } from "lucide-react"
import Link from "next/link"

const orders = [
  {
    id: "#60110",
    customer: {
      name: "Jayvion Simon",
      email: "nannie.abernathy70@yahoo.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    date: "16 Dec 2025",
    time: "10:51 am",
    amount: "$484.15",
    items: 6,
    paymentStatus: "paid",
    deliveryStatus: "refunded",
  },
  {
    id: "#60111",
    customer: {
      name: "Lucian Obrien",
      email: "ashlynn.ohara62@gmail.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    date: "15 Dec 2025",
    time: "9:51 am",
    amount: "$83.74",
    items: 1,
    paymentStatus: "paid",
    deliveryStatus: "completed",
  },
  {
    id: "#60112",
    customer: {
      name: "Soren Durham",
      email: "vergie.block82@hotmail.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    date: "06 Dec 2025",
    time: "12:51 am",
    amount: "$400.41",
    items: 5,
    paymentStatus: "unpaid",
    deliveryStatus: "pending",
  },
  {
    id: "#60113",
    customer: {
      name: "Cortez Herring",
      email: "vito.hudson@hotmail.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    date: "04 Dec 2025",
    time: "11:51 pm",
    amount: "$83.74",
    items: 1,
    paymentStatus: "paid",
    deliveryStatus: "completed",
  },
  {
    id: "#60114",
    customer: {
      name: "Emily Chen",
      email: "emily.chen@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    date: "03 Dec 2025",
    time: "3:22 pm",
    amount: "$234.50",
    items: 3,
    paymentStatus: "paid",
    deliveryStatus: "shipped",
  },
]

export function OrderList() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Dashboard</span>
        <span>/</span>
        <span>Orders</span>
        <span>/</span>
        <span className="text-foreground">List</span>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">
            All{" "}
            <Badge variant="secondary" className="ml-2">
              20
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending{" "}
            <Badge variant="secondary" className="ml-2">
              6
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed{" "}
            <Badge variant="secondary" className="ml-2">
              10
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled{" "}
            <Badge variant="secondary" className="ml-2">
              2
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="refunded">
            Refunded{" "}
            <Badge variant="secondary" className="ml-2">
              2
            </Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <Button variant="outline" className="gap-2 w-full md:w-48 bg-transparent">
            <Calendar className="h-4 w-4" />
            Start date
          </Button>
          <Button variant="outline" className="gap-2 w-full md:w-48 bg-transparent">
            <Calendar className="h-4 w-4" />
            End date
          </Button>
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search customer or order number..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Orders Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium text-primary">
                  <Link href={`/orders/${order.id.replace("#", "")}`}>{order.id}</Link>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={order.customer.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{order.customer.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">{order.customer.name}</p>
                      <p className="text-xs text-muted-foreground">{order.customer.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-0.5">
                    <p className="text-sm">{order.date}</p>
                    <p className="text-xs text-muted-foreground">{order.time}</p>
                  </div>
                </TableCell>
                <TableCell>{order.items}</TableCell>
                <TableCell className="font-medium">{order.amount}</TableCell>
                <TableCell>
                  <Select defaultValue={order.deliveryStatus}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">
                        <Badge className="bg-warning text-warning-foreground">Pending</Badge>
                      </SelectItem>
                      <SelectItem value="shipped">
                        <Badge className="bg-info text-info-foreground">Shipped</Badge>
                      </SelectItem>
                      <SelectItem value="completed">
                        <Badge className="bg-success text-success-foreground">Completed</Badge>
                      </SelectItem>
                      <SelectItem value="refunded">
                        <Badge variant="secondary">Refunded</Badge>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
