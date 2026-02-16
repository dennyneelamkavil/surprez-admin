import "server-only";

import { connectDB } from "@/server/db";
import { CustomerModel } from "@/server/models/customer.model";
import { AppError } from "@/server/errors/AppError";
import { mapAddress } from "./addresses.mapper";
import type {
  CreateAddressInput,
  UpdateAddressInput,
} from "./addresses.validation";

export async function listAddresses(customerId: string) {
  await connectDB();

  const customer = await CustomerModel.findById(customerId)
    .select("addresses")
    .lean();

  if (!customer) throw new AppError("Customer not found", 404);

  return customer.addresses.map(mapAddress);
}

export async function createAddress(
  customerId: string,
  input: CreateAddressInput,
) {
  await connectDB();

  const customer = await CustomerModel.findById(customerId);
  if (!customer) throw new AppError("Customer not found", 404);

  if (input.isDefault) {
    customer.addresses.forEach((a: (typeof customer.addresses)[number]) => {
      a.isDefault = false;
    });
  }

  customer.addresses.push(input);
  await customer.save();

  return customer.addresses.map(mapAddress);
}

export async function updateAddress(
  customerId: string,
  addressId: string,
  input: UpdateAddressInput,
) {
  await connectDB();

  const customer = await CustomerModel.findById(customerId);
  if (!customer) throw new AppError("Customer not found", 404);

  const address = customer.addresses.id(addressId);
  if (!address) throw new AppError("Address not found", 404);

  if (input?.isDefault === true) {
    customer.addresses.forEach((a: (typeof customer.addresses)[number]) => {
      a.isDefault = false;
    });
  }

  address.set(input);

  await customer.save();

  return customer.addresses.map(mapAddress);
}

export async function deleteAddress(customerId: string, addressId: string) {
  await connectDB();

  const customer = await CustomerModel.findById(customerId);
  if (!customer) throw new AppError("Customer not found", 404);

  const address = customer.addresses.id(addressId);
  if (!address) throw new AppError("Address not found", 404);

  const wasDefault = address.isDefault;

  address.deleteOne();

  // If deleted address was default → assign first as default
  if (wasDefault && customer.addresses.length > 0) {
    customer.addresses[0].isDefault = true;
  }

  await customer.save();

  return customer.addresses.map(mapAddress);
}
