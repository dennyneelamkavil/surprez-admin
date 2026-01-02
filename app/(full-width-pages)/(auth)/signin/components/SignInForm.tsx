"use client";

import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import FormField from "@/components/form/FormField";

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

    const errors = { username: "", password: "" };

    if (!formData.username) errors.username = "Username is required";
    if (!formData.password) errors.password = "Password is required";

    if (errors.username || errors.password) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    const toastId = toast.loading("Signing in...");
    try {
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

      router.push("/");
    } catch (err: any) {
      toast.update(toastId, {
        render: err.message || "Sign in failed",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        {/* Header */}
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 dark:text-white/90 text-title-sm sm:text-title-md">
            Sign In | Welcome Back!
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter your username and password to sign in!
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <FormField label="Username" required htmlFor="username">
              <Input
                id="username"
                placeholder="yourusername"
                value={formData.username}
                onChange={(e) => {
                  setFieldErrors((prev) => ({ ...prev, username: "" }));
                  const value = e.target.value
                    .toLowerCase() // force lowercase
                    .replace(/\s+/g, "") // remove spaces
                    .replace(/[^a-z0-9_]/g, ""); // allow only a-z, 0-9 and _
                  setFormData((prev) => ({
                    ...prev,
                    username: value,
                  }));
                }}
                error={!!fieldErrors.username}
                hint={fieldErrors.username}
              />
            </FormField>

            <FormField label="Password" required htmlFor="password">
              <div className="relative">
                <Input
                  id="password"
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
                    <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                  )}
                </span>
              </div>
            </FormField>

            {/* Remember me */}
            <div className="flex items-center gap-3">
              <Checkbox checked={isChecked} onChange={setIsChecked} />
              <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                Keep me logged in
              </span>
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-error-500 text-center">{error}</p>
            )}

            {/* Submit */}
            <Button
              type="submit"
              className="w-full"
              size="sm"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
