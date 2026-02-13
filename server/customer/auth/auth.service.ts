import "server-only";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { connectDB } from "@/server/db";
import { CustomerModel } from "@/server/models/customer.model";
import { OtpModel } from "@/server/models/otp.model";
import { AppError } from "@/server/errors/AppError";

import type {
  RequestOtpInput,
  VerifyOtpInput,
  CompleteProfileInput,
} from "./auth.validation";

const CUSTOMER_JWT_SECRET = process.env.CUSTOMER_JWT_SECRET!;

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function requestOtp(input: RequestOtpInput) {
  await connectDB();

  // const otp = generateOtp();

  const otp = "123456"; // fixed OTP for testing, replace with generateOtp() in production
  const otpHash = await bcrypt.hash(otp, 10);

  await OtpModel.findOneAndUpdate(
    { destination: input.phone, type: "phone" },
    {
      otpHash,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      verified: false,
      windowStart: new Date(),
      requestCount: 1,
    },
    { upsert: true },
  );

  // TODO: integrate SMS provider
  console.log("OTP:", otp);

  return { success: true };
}

export async function verifyOtp(input: VerifyOtpInput) {
  await connectDB();

  const otpDoc = await OtpModel.findOne({
    destination: input.phone,
    type: "phone",
  });

  if (!otpDoc || otpDoc.expiresAt < new Date()) {
    throw new AppError("OTP expired or invalid", 400);
  }

  const incomingHash = await bcrypt.hash(input.otp, 10);

  if (incomingHash !== otpDoc.otpHash) {
    throw new AppError("Invalid OTP", 400);
  }

  otpDoc.verified = true;
  await otpDoc.save();

  let customer = await CustomerModel.findOne({
    phone: input.phone,
  });

  let isNewUser = false;

  if (!customer) {
    customer = await CustomerModel.create({
      phone: input.phone,
    });

    isNewUser = true;
  }

  const token = jwt.sign(
    {
      sub: customer._id.toString(),
      type: "customer",
    },
    CUSTOMER_JWT_SECRET,
    { expiresIn: "7d" },
  );

  customer.lastLoginAt = new Date();
  await customer.save();

  return {
    token,
    isNewUser,
    customer: {
      id: customer._id.toString(),
      phone: customer.phone,
      fullName: customer.fullName,
    },
  };
}

export async function completeProfile(
  customerId: string,
  input: CompleteProfileInput,
) {
  await connectDB();

  const customer = await CustomerModel.findById(customerId);

  if (!customer) {
    throw new AppError("Customer not found", 404);
  }

  customer.fullName = input.fullName;
  if (input.email) customer.email = input.email;

  await customer.save();

  return {
    customer: {
      id: customer._id.toString(),
      phone: customer.phone,
      fullName: customer.fullName,
      email: customer.email,
    },
  };
}
