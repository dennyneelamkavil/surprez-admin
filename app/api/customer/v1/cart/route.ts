import { NextResponse } from "next/server";
import { requireCustomerAuth } from "@/server/auth/customerAuth";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
} from "@/server/customer/cart/cart.service";

import {
  AddToCartSchema,
  UpdateCartItemSchema,
  RemoveCartItemSchema,
} from "@/server/customer/cart/cart.validation";

import { handleApiError } from "@/server/errors/handleApiError";

/* ================= GET ================= */
export async function GET(req: Request) {
  try {
    const auth = await requireCustomerAuth(req);
    return NextResponse.json(await getCart(auth.customerId));
  } catch (err) {
    return handleApiError(err);
  }
}

/* ================= POST ================= */
export async function POST(req: Request) {
  try {
    const auth = await requireCustomerAuth(req);

    const body = await req.json();
    const parsed = AddToCartSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    return NextResponse.json(
      await addToCart(
        auth.customerId,
        parsed.data.inventoryId,
        parsed.data.quantity,
      ),
      { status: 201 },
    );
  } catch (err) {
    return handleApiError(err);
  }
}

/* ================= PUT ================= */
export async function PUT(req: Request) {
  try {
    const auth = await requireCustomerAuth(req);

    const body = await req.json();
    const parsed = UpdateCartItemSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    return NextResponse.json(
      await updateCartItem(
        auth.customerId,
        parsed.data.inventoryId,
        parsed.data.quantity,
      ),
    );
  } catch (err) {
    return handleApiError(err);
  }
}

/* ================= DELETE ================= */
export async function DELETE(req: Request) {
  try {
    const auth = await requireCustomerAuth(req);

    const body = await req.json();
    const parsed = RemoveCartItemSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    return NextResponse.json(
      await removeCartItem(auth.customerId, parsed.data.inventoryId),
    );
  } catch (err) {
    return handleApiError(err);
  }
}
