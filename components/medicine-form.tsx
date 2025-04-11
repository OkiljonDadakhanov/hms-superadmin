"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createMedicineProduct, fetchMedicineProduct, updateMedicineProduct } from "@/lib/api-service"
import { toast } from "@/components/ui/use-toast"

const medicineFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  type: z.string().min(1, { message: "Type is required." }),
  price: z.coerce.number().min(0, { message: "Price must be a positive number." }),
  stock: z.coerce.number().min(0, { message: "Stock must be a positive number." }),
  unit: z.string().min(1, { message: "Unit is required." }),
  expiryDate: z.string().min(1, { message: "Expiry date is required." }),
  manufacturer: z.string().min(1, { message: "Manufacturer is required." }),
  category: z.string().min(1, { message: "Category is required." }),
})

type MedicineFormValues = z.infer<typeof medicineFormSchema>

interface MedicineFormProps {
  productId?: string
  onSuccess: () => void
}

export function MedicineForm({ productId, onSuccess }: MedicineFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<MedicineFormValues>({
    resolver: zodResolver(medicineFormSchema),
    defaultValues: {
      name: "",
      type: "",
      price: 0,
      stock: 0,
      unit: "pcs",
      expiryDate: "",
      manufacturer: "",
      category: "",
    },
  })

  useEffect(() => {
    if (productId) {
      setIsLoading(true)
      fetchMedicineProduct(productId)
        .then((product) => {
          if (product) {
            form.reset({
              name: product.name,
              type: product.type,
              price: product.price,
              stock: product.stock,
              unit: product.unit,
              expiryDate: product.expiryDate,
              manufacturer: product.manufacturer,
              category: product.category,
            })
          }
        })
        .catch((error) => {
          console.error("Error fetching product:", error)
          toast({
            title: "Error",
            description: "Failed to fetch product details.",
            variant: "destructive",
          })
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [productId, form])

  const onSubmit = async (data: MedicineFormValues) => {
    setIsLoading(true)
    try {
      if (productId) {
        await updateMedicineProduct(productId, data)
        toast({
          title: "Product updated",
          description: "The product has been successfully updated.",
        })
      } else {
        await createMedicineProduct(data)
        toast({
          title: "Product created",
          description: "The product has been successfully created.",
        })
      }
      onSuccess()
    } catch (error) {
      console.error("Error saving product:", error)
      toast({
        title: "Error",
        description: "Failed to save product.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const productTypes = ["Tablet", "Capsule", "Syrup", "Inhaler", "Cream", "Soap", "Injection"]
  const productCategories = ["RESPIRATORY", "ANTIBIOTICS", "ANALGESICS", "DERMATOLOGY", "CARDIOLOGY", "NEUROLOGY"]

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="Paracetamol 500mg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {productTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {productCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (₹)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pcs">pcs</SelectItem>
                      <SelectItem value="ml">ml</SelectItem>
                      <SelectItem value="g">g</SelectItem>
                      <SelectItem value="kg">kg</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="expiryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expiry Date</FormLabel>
                <FormControl>
                  <Input placeholder="01 Jun 2024" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="manufacturer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Manufacturer</FormLabel>
                <FormControl>
                  <Input placeholder="John's Health Care" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : productId ? "Update Product" : "Add Product"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
