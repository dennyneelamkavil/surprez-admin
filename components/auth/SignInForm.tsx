"use client";

import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function SignInForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState({
    username: "",
    password: "",
  });

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setFieldErrors({ username: "", password: "" });

    const errors = {
      username: "",
      password: "",
    };
    if (!formData.username) {
      errors.username = "Username is required";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    }
    if (errors.username || errors.password) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const toastId = toast.loading("Signing in...");

      const res = await signIn("credentials", {
        username: formData.username,
        password: formData.password,
        redirect: false,
      });

      if (!res || !res.ok) {
        throw new Error(res?.error || "Invalid username or password");
      }

      toast.update(toastId, {
        render: "Signed in successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      router.push("/"); // dashboard
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm sm:text-title-md">
            Sign In
          </h1>
          <p className="text-sm text-gray-500">
            Enter your username and password to sign in
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Username */}
            <div>
              <Label>
                Username <span className="text-error-500">*</span>
              </Label>
              <Input
                placeholder="yourusername"
                value={formData.username}
                onChange={(e) => {
                  setFieldErrors((prev) => ({ ...prev, username: "" }));
                  setFormData((prev) => ({
                    ...prev,
                    username: e.target.value,
                  }));
                }}
                error={!!fieldErrors.username}
                hint={fieldErrors.username}
              />
            </div>

            {/* Password */}
            <div>
              <Label>
                Password <span className="text-error-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => {
                    setFieldErrors((prev) => ({ ...prev, password: "" }));
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }));
                  }}
                  error={!!fieldErrors.password}
                  hint={fieldErrors.password}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                >
                  {showPassword ? (
                    <EyeIcon className="fill-gray-500" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500" />
                  )}
                </span>
              </div>
            </div>

            {/* Remember me */}
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3">
                <Checkbox checked={isChecked} onChange={setIsChecked} />
                <span className="text-sm text-gray-700">Keep me logged in</span>
              </div>
            </label>

            {/* Error */}
            {error && (
              <p className="text-sm text-error-500 text-center">{error}</p>
            )}

            {/* Submit */}
            <Button className="w-full" size="sm" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
