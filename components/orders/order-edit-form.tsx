"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface OrderEditFormProps {
  orderId: string
}

export function OrderEditForm({ orderId }: OrderEditFormProps) {
  const router = useRouter()

  const [formData, setFormData] = useState({
    deliveryStatus: "shipped",
    paymentStatus: "paid",
    trackingNumber: "SPX037739199373",
    carrier: "DHL",
    shippingSpeed: "standard",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Order updated:", formData)
    router.push(`/orders/${orderId}`)
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/orders" className="hover:text-foreground">
          Orders
        </Link>
        <span>/</span>
        <span className="text-foreground">Edit Order</span>
      </div>

      <div className="flex items-center gap-4">
        <Link href={`/orders/${orderId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Edit Order {orderId}</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="deliveryStatus">Delivery Status</Label>
                <Select
                  value={formData.deliveryStatus}
                  onValueChange={(value) => setFormData({ ...formData, deliveryStatus: value })}
                >
                  <SelectTrigger id="deliveryStatus">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="returned">Returned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentStatus">Payment Status</Label>
                <Select
                  value={formData.paymentStatus}
                  onValueChange={(value) => setFormData({ ...formData, paymentStatus: value })}
                >
                  <SelectTrigger id="paymentStatus">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="unpaid">Unpaid</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shipping Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="trackingNumber">Tracking Number</Label>
              <Input
                id="trackingNumber"
                value={formData.trackingNumber}
                onChange={(e) => setFormData({ ...formData, trackingNumber: e.target.value })}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="carrier">Carrier</Label>
                <Select
                  value={formData.carrier}
                  onValueChange={(value) => setFormData({ ...formData, carrier: value })}
                >
                  <SelectTrigger id="carrier">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DHL">DHL</SelectItem>
                    <SelectItem value="FedEx">FedEx</SelectItem>
                    <SelectItem value="UPS">UPS</SelectItem>
                    <SelectItem value="USPS">USPS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="shippingSpeed">Shipping Speed</Label>
                <Select
                  value={formData.shippingSpeed}
                  onValueChange={(value) => setFormData({ ...formData, shippingSpeed: value })}
                >
                  <SelectTrigger id="shippingSpeed">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="express">Express</SelectItem>
                    <SelectItem value="overnight">Overnight</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" size="lg">
            Save Changes
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="bg-transparent"
            onClick={() => router.push(`/orders/${orderId}`)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
