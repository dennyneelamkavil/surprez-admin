"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MapPin, Phone, Package, CheckCircle2, Circle, Edit } from "lucide-react"
import Link from "next/link"

const orderData = {
  id: "#60111",
  customer: {
    name: "Lucian Obrien",
    email: "ashlynn.ohara62@gmail.com",
    avatar: "/placeholder.svg?height=40&width=40",
    phone: "365-374-4961",
  },
  orderDate: "15 Dec 2025 9:51 am",
  paymentTime: "15 Dec 2025 9:51 am",
  items: [
    {
      id: 1,
      name: "Urban Explorer Sneakers",
      sku: "16H9UR0",
      image: "/green-sneakers.jpg",
      quantity: 1,
      price: 83.74,
    },
  ],
  subtotal: 83.74,
  shipping: -10,
  discount: -10,
  taxes: 10,
  total: 73.74,
  shipping: {
    address: "19034 Verna Unions Apt. 164 -Honolulu,",
    city: "RI / 87535",
    phone: "365-374-4961",
  },
  delivery: {
    carrier: "DHL",
    speed: "Standard",
    trackingNo: "SPX037739199373",
  },
  timeline: [
    {
      status: "Delivery successful",
      date: "15 Dec 2025 9:51 am",
      completed: true,
    },
    {
      status: "Transporting to [2]",
      date: "14 Nov 2025 8:51 am",
      completed: true,
    },
    {
      status: "Transporting to [1]",
      date: "13 Nov 2025 7:43 am",
      completed: true,
    },
    {
      status: "The shipping unit has picked up the goods",
      date: "12 Nov 2025 6:32 am",
      completed: true,
    },
    {
      status: "Order has been created",
      date: "11 Nov 2025 5:21 am",
      completed: true,
    },
  ],
}

export function OrderDetails({ orderId }: { orderId: string }) {
  const router = useRouter()

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Dashboard
        </Link>
        <span>/</span>
        <Link href="/orders" className="hover:text-foreground">
          Orders
        </Link>
        <span>/</span>
        <span className="text-foreground">Details</span>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Order {orderData.id}</h1>
        <Button onClick={() => router.push(`/orders/${orderId}/edit`)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Order Details and Timeline */}
        <div className="space-y-6 lg:col-span-2">
          {/* Order Items */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Details</CardTitle>
              <Button variant="ghost" size="icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                </svg>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {orderData.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-lg bg-muted overflow-hidden">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.sku}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm">x{item.quantity}</p>
                    <p className="font-medium">${item.price}</p>
                  </div>
                </div>
              ))}

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${orderData.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-destructive">${orderData.shipping}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="text-destructive">${orderData.discount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taxes</span>
                  <span>${orderData.taxes}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${orderData.total}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery History */}
          <Card>
            <CardHeader>
              <CardTitle>History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderData.timeline.map((event, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      {event.completed ? (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success">
                          <CheckCircle2 className="h-4 w-4 text-success-foreground" />
                        </div>
                      ) : (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-muted-foreground">
                          <Circle className="h-3 w-3 text-muted-foreground" />
                        </div>
                      )}
                      {index < orderData.timeline.length - 1 && <div className="h-full w-0.5 bg-border my-1" />}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-medium">{event.status}</p>
                      <p className="text-sm text-muted-foreground">{event.date}</p>
                    </div>
                  </div>
                ))}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-primary bg-primary/10">
                      <Package className="h-3 w-3 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Order placed</p>
                    <p className="text-sm text-muted-foreground">{orderData.orderDate}</p>
                    <p className="text-sm text-muted-foreground mt-1">Payment time</p>
                    <p className="text-sm text-muted-foreground">{orderData.paymentTime}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Customer, Delivery, Shipping Info */}
        <div className="space-y-6">
          {/* Customer */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Customer</CardTitle>
              <Button variant="ghost" size="icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                </svg>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={orderData.customer.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{orderData.customer.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{orderData.customer.name}</p>
                  <p className="text-sm text-muted-foreground">{orderData.customer.email}</p>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>IP address: 192.158.1.38</p>
              </div>
              <Button variant="destructive" size="sm" className="w-full">
                Add to blacklist
              </Button>
            </CardContent>
          </Card>

          {/* Delivery */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Delivery</CardTitle>
              <Button variant="ghost" size="icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                </svg>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ship by</span>
                <span className="font-medium">{orderData.delivery.carrier}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Speedy</span>
                <span className="font-medium">{orderData.delivery.speed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tracking No.</span>
                <span className="font-medium text-primary underline cursor-pointer">
                  {orderData.delivery.trackingNo}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Shipping */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Shipping</CardTitle>
              <Button variant="ghost" size="icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                </svg>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-muted-foreground">{orderData.shipping.address}</p>
                  <p className="text-muted-foreground">{orderData.shipping.city}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Phone className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Phone number</p>
                  <p className="text-muted-foreground">{orderData.shipping.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
