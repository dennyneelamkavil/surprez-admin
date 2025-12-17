"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, MoreHorizontal, Edit, Trash2, ChevronRight, FolderTree } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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

const categories = [
  {
    id: 1,
    name: "Footwear",
    slug: "footwear",
    products: 145,
    subcategories: [
      { id: 11, name: "Sneakers", slug: "sneakers", products: 68 },
      { id: 12, name: "Boots", slug: "boots", products: 42 },
      { id: 13, name: "Sandals", slug: "sandals", products: 35 },
    ],
  },
  {
    id: 2,
    name: "Accessories",
    slug: "accessories",
    products: 89,
    subcategories: [
      { id: 21, name: "Bags", slug: "bags", products: 45 },
      { id: 22, name: "Watches", slug: "watches", products: 44 },
    ],
  },
  {
    id: 3,
    name: "Clothing",
    slug: "clothing",
    products: 234,
    subcategories: [
      { id: 31, name: "Shirts", slug: "shirts", products: 120 },
      { id: 32, name: "Pants", slug: "pants", products: 78 },
      { id: 33, name: "Jackets", slug: "jackets", products: 36 },
    ],
  },
]

export function CategoryList() {
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [addSubOpen, setAddSubOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<{
    id: number
    name: string
    slug: string
    parentId?: number
  } | null>(null)
  const [formData, setFormData] = useState({ name: "", slug: "" })

  const handleCreate = () => {
    console.log("Creating category:", formData)
    setCreateOpen(false)
    setFormData({ name: "", slug: "" })
  }

  const handleEdit = (category: { id: number; name: string; slug: string }) => {
    setSelectedCategory(category)
    setFormData({ name: category.name, slug: category.slug })
    setEditOpen(true)
  }

  const handleUpdate = () => {
    console.log("Updating category:", selectedCategory?.id, formData)
    setEditOpen(false)
    setSelectedCategory(null)
    setFormData({ name: "", slug: "" })
  }

  const handleDelete = () => {
    console.log("Deleting category:", selectedCategory?.id)
    setDeleteOpen(false)
    setSelectedCategory(null)
  }

  const handleAddSub = (parentId: number) => {
    setSelectedCategory({ id: parentId, name: "", slug: "", parentId })
    setAddSubOpen(true)
  }

  const handleCreateSub = () => {
    console.log("Creating subcategory for parent:", selectedCategory?.parentId, formData)
    setAddSubOpen(false)
    setSelectedCategory(null)
    setFormData({ name: "", slug: "" })
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Dashboard</span>
        <span>/</span>
        <span className="text-foreground">Categories</span>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <Button className="gap-2" onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          Create Root Category
        </Button>
      </div>

      {/* Category Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Products</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <>
                <TableRow key={category.id} className="bg-muted/30">
                  <TableCell className="font-semibold">
                    <div className="flex items-center gap-2">
                      <FolderTree className="h-4 w-4 text-primary" />
                      {category.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{category.products} products</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 bg-transparent"
                        onClick={() => handleAddSub(category.id)}
                      >
                        <Plus className="h-3 w-3" />
                        Add Subcategory
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(category)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              setSelectedCategory(category)
                              setDeleteOpen(true)
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
                {category.subcategories.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="pl-12">
                      <div className="flex items-center gap-2 text-sm">
                        <ChevronRight className="h-3 w-3 text-muted-foreground" />
                        {sub.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{sub.slug}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {sub.products} products
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(sub)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              setSelectedCategory(sub)
                              setDeleteOpen(true)
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Root Category</DialogTitle>
            <DialogDescription>Add a new root category to organize your products.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="create-name">Category Name</Label>
              <Input
                id="create-name"
                placeholder="e.g., Electronics"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-slug">Slug</Label>
              <Input
                id="create-slug"
                placeholder="e.g., electronics"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update category information.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Category Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-slug">Slug</Label>
              <Input
                id="edit-slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={addSubOpen} onOpenChange={setAddSubOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Subcategory</DialogTitle>
            <DialogDescription>Create a new subcategory under the selected category.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="sub-name">Subcategory Name</Label>
              <Input
                id="sub-name"
                placeholder="e.g., Running Shoes"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sub-slug">Slug</Label>
              <Input
                id="sub-slug"
                placeholder="e.g., running-shoes"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddSubOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateSub}>Create Subcategory</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this category? This action cannot be undone and will affect all products
              in this category.
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
