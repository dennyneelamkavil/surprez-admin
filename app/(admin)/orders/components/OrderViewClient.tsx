"use client";

import { useRouter } from "next/navigation";

import { FormHeader, FormError } from "@/components/form";
import FormSkeleton from "@/components/skeletons/FormSkeleton";
import {
  ViewSection,
  ViewField,
  ViewBadge,
  ViewActions,
} from "@/components/view";

import { useAdminEntity } from "@/hooks";
import type { Order } from "@/lib/types";

type Props = {
  id: string;
};

export default function OrderViewClient({ id }: Props) {
  const router = useRouter();

  const {
    data: order,
    loading,
    error,
  } = useAdminEntity<Order>({
    endpoint: "orders",
    id,
  });

  return (
    <div className="space-y-6">
      <FormHeader title="View Order" />
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        {loading ? (
          <FormSkeleton />
        ) : error ? (
          <FormError error={error} />
        ) : !order ? null : (
          <div className="space-y-6">
            <div className="sm:sticky top-30 z-10 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/40">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <ViewField
                  label="Order Number"
                  value={order.orderNumber}
                  mono
                />

                <ViewField label="Customer" value={order.customer?.phone} />

                <ViewField label="Seller" value={order.seller?.businessName} />

                <ViewSection title="Status">
                  <div className="flex gap-6">
                    <ViewBadge label={order.orderStatus} variant="info" />
                    <ViewBadge
                      label={order.paymentStatus}
                      variant={
                        order.paymentStatus === "paid" ? "success" : "warning"
                      }
                    />
                  </div>
                </ViewSection>
              </div>
            </div>

            <ViewSection title="Items">
              <div className="space-y-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="rounded-md bg-gray-50 p-4 text-sm">
                    <p className="font-medium">{item.product?.name}</p>
                    <p>SKU: {item.inventory?.sku}</p>
                    <p>Qty: {item.quantity}</p>
                    <p>
                      ₹ {item.price.sellingPrice} × {item.quantity}
                    </p>
                  </div>
                ))}
              </div>
            </ViewSection>

            <ViewSection title="Totals">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <ViewField
                  label="MRP Total"
                  value={`₹ ${order.totals?.mrpTotal}`}
                />
                <ViewField
                  label="Selling Total"
                  value={`₹ ${order.totals?.sellingTotal}`}
                />
                <ViewField
                  label="Discount"
                  value={`₹ ${order.totals?.discountTotal}`}
                />
                <ViewField
                  label="Payable"
                  value={`₹ ${order.totals?.payableTotal}`}
                />
              </div>
            </ViewSection>

            <ViewSection title="Delivery Address">
              <div className="space-y-2 text-sm">
                <p>{order.deliveryAddress?.name}</p>
                <p>{order.deliveryAddress?.phone}</p>
                <p>{order.deliveryAddress?.addressLine1}</p>
                {order.deliveryAddress?.addressLine2 && (
                  <p>{order.deliveryAddress.addressLine2}</p>
                )}
                <p>
                  {order.deliveryAddress?.city}, {order.deliveryAddress?.state}{" "}
                  - {order.deliveryAddress?.pincode}
                </p>
                <p>{order.deliveryAddress?.country}</p>
              </div>
            </ViewSection>

            <ViewSection>
              <ViewField
                label="Created At"
                value={new Date(order.createdAt).toLocaleString()}
              />
            </ViewSection>

            <ViewActions onBack={() => router.back()} />
          </div>
        )}
      </div>
    </div>
  );
}
