import "server-only";

import bcrypt from "bcryptjs";

import { OtpModel } from "@/server/models/otp.model";
import { AppError } from "@/server/errors/AppError";

const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 10;
const OTP_MAX_REQUESTS = 5;
const OTP_WINDOW_MINUTES = 10;

function generateOtp(): string {
  const min = Math.pow(10, OTP_LENGTH - 1);
  const max = Math.pow(10, OTP_LENGTH) - 1;
  return Math.floor(min + Math.random() * (max - min)).toString();
}

export async function requestOtp(params: {
  destination: string; // phone
  type: "phone" | "email";
}) {
  const { destination, type } = params;

  const now = new Date();

  let otpRecord = await OtpModel.findOne({ destination, type });

  // RATE LIMIT CHECK
  if (otpRecord) {
    const windowStart = otpRecord.windowStart ?? otpRecord.createdAt;
    const windowDiff = (now.getTime() - windowStart.getTime()) / (1000 * 60);

    if (windowDiff <= OTP_WINDOW_MINUTES) {
      if (otpRecord.requestCount >= OTP_MAX_REQUESTS) {
        throw new AppError(
          "Too many OTP requests. Please try again later.",
          429,
        );
      }

      otpRecord.requestCount += 1;
    } else {
      // reset window
      otpRecord.requestCount = 1;
      otpRecord.windowStart = now;
    }
  }

  const otp = generateOtp();
  const otpHash = await bcrypt.hash(otp, 12);

  const expiresAt = new Date(now.getTime() + OTP_EXPIRY_MINUTES * 60 * 1000);

  if (!otpRecord) {
    otpRecord = new OtpModel({
      destination,
      type,
      otpHash,
      expiresAt,
      requestCount: 1,
      windowStart: now,
    });
  } else {
    otpRecord.otpHash = otpHash;
    otpRecord.expiresAt = expiresAt;
    otpRecord.verified = false;
  }

  await otpRecord.save();

  // TODO: integrate SMS / Email provider here
  //   sendOtp(destination, otp);

  return {
    success: true,
    expiresAt,
  };
}
