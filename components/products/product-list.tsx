"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Package } from "lucide-react"
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

const products = [
  {
    id: 1,
    name: "Urban Explorer Sneakers",
    sku: "16H9UR0",
    category: "Shoes",
    price: "$83.74",
    stock: 0,
    stockStatus: "out",
    image: "/images/image.png",
  },
  {
    id: 2,
    name: "Classic Leather Loafers",
    sku: "WW75K521YW",
    category: "Shoes",
    price: "$97.14",
    stock: 72,
    stockStatus: "in-stock",
    image: "/images/image.png",
  },
  {
    id: 3,
    name: "Mountain Trekking Boots",
    sku: "MTB-2024",
    category: "Shoes",
    price: "$68.71",
    stock: 10,
    stockStatus: "low",
    image: "/images/image.png",
  },
  {
    id: 4,
    name: "Running Pro Sneakers",
    sku: "RPS-100",
    category: "Shoes",
    price: "$125.00",
    stock: 45,
    stockStatus: "in-stock",
    image: "/images/image.png",
  },
  {
    id: 5,
    name: "Casual Canvas Shoes",
    sku: "CCS-250",
    category: "Shoes",
    price: "$45.99",
    stock: 8,
    stockStatus: "low",
    image: "/images/image.png",
  },
]

export function ProductList() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [stockFilter, setStockFilter] = useState("all")
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const handleEdit = (id: number) => {
    router.push(`/products/${id}/edit`)
  }

  const handleDelete = (id: number) => {
    console.log("Deleting product:", id)
    setDeleteId(null)
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Dashboard</span>
        <span>/</span>
        <span>Products</span>
        <span>/</span>
        <span className="text-foreground">List</span>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <Button className="gap-2" onClick={() => router.push("/products/new")}>
          <Plus className="h-4 w-4" />
          Add New Product
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="shoes">Shoes</SelectItem>
              <SelectItem value="accessories">Accessories</SelectItem>
              <SelectItem value="clothing">Clothing</SelectItem>
            </SelectContent>
          </Select>
          <Select value={stockFilter} onValueChange={setStockFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Stock Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stock</SelectItem>
              <SelectItem value="in-stock">In Stock</SelectItem>
              <SelectItem value="low">Low Stock</SelectItem>
              <SelectItem value="out">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Product Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Image</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-muted">
                    <Package className="absolute inset-0 m-auto h-6 w-6 text-muted-foreground" />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="text-muted-foreground">{product.sku}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell className="font-medium">{product.price}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {product.stockStatus === "in-stock" && (
                      <>
                        <div className="h-2 w-20 rounded-full bg-success/20">
                          <div className="h-full rounded-full bg-success" style={{ width: "75%" }} />
                        </div>
                        <Badge className="bg-success text-success-foreground">{product.stock} in stock</Badge>
                      </>
                    )}
                    {product.stockStatus === "low" && (
                      <>
                        <div className="h-2 w-20 rounded-full bg-warning/20">
                          <div className="h-full rounded-full bg-warning" style={{ width: "25%" }} />
                        </div>
                        <Badge className="bg-warning text-warning-foreground">{product.stock} low stock</Badge>
                      </>
                    )}
                    {product.stockStatus === "out" && (
                      <Badge variant="secondary" className="bg-muted text-muted-foreground">
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(product.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => setDeleteId(product.id)}>
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
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
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
