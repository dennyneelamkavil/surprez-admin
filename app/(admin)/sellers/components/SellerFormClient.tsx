"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  FormHeader,
  FormField,
  FormError,
  FormActions,
  Input,
  Switch,
  Select,
  CollapsibleFormSection,
} from "@/components/form";

import FormSkeleton from "@/components/skeletons/FormSkeleton";
import { useFieldErrors, useScrollToTop } from "@/hooks";

type Fields = "email" | "password" | "businessName";

type Props = {
  mode: "create" | "edit";
  id?: string;
};

export default function SellerFormClient({ mode, id }: Props) {
  const router = useRouter();

  /* ================= AUTH ================= */

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  /* ================= BUSINESS ================= */

  const [sellerType, setSellerType] = useState("vendor");
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [legalName, setLegalName] = useState("");
  const [gstin, setGstin] = useState("");

  /* ================= ADDRESS ================= */

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  /* ================= BANK ================= */

  const [accountHolderName, setAccountHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [bankName, setBankName] = useState("");

  /* ================= STATUS ================= */

  const [status, setStatus] = useState("pending");
  const [rejectedReason, setRejectedReason] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  const { fieldErrors, setFieldError, clearFieldError, clearAllFieldErrors } =
    useFieldErrors<Fields>();

  useScrollToTop(error || fieldErrors);

  /* ================= FETCH ================= */

  const fetchSeller = useCallback(async () => {
    if (!id) return;

    try {
      const res = await fetch(`/api/admin/sellers/${id}`, {
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Failed to load seller");
      const data = await res.json();

      setEmail(data.email);
      setPhone(data.phone ?? "");

      setSellerType(data.sellerType);
      setBusinessName(data.businessName);
      setBusinessType(data.businessType ?? "");
      setLegalName(data.legalName ?? "");
      setGstin(data.gstin ?? "");

      setAddress(data.businessAddress?.address ?? "");
      setCity(data.businessAddress?.city ?? "");
      setState(data.businessAddress?.state ?? "");
      setPincode(data.businessAddress?.pincode ?? "");

      setAccountHolderName(data.bankDetails?.accountHolderName ?? "");
      setAccountNumber(data.bankDetails?.accountNumber ?? "");
      setIfscCode(data.bankDetails?.ifscCode ?? "");
      setBankName(data.bankDetails?.bankName ?? "");

      setStatus(data.status);
      setRejectedReason(data.rejectedReason ?? "");
      setIsActive(data.isActive);
    } catch (err: any) {
      setEditError(err.message ?? "Failed to load seller");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (mode === "edit") fetchSeller();
  }, [mode, fetchSeller]);

  /* ================= SUBMIT ================= */

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    clearAllFieldErrors();

    let hasError = false;

    if (!email) {
      setFieldError("email", "Email is required");
      hasError = true;
    }

    if (mode === "create" && !password) {
      setFieldError("password", "Password is required");
      hasError = true;
    }

    if (!businessName) {
      setFieldError("businessName", "Business name is required");
      hasError = true;
    }

    if (hasError) {
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(
        mode === "create" ? "/api/admin/sellers" : `/api/admin/sellers/${id}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password: password || undefined,
            phone,
            sellerType,
            businessName,
            businessType,
            legalName,
            gstin,
            businessAddress: {
              address,
              city,
              state,
              pincode,
            },
            bankDetails: {
              accountHolderName,
              accountNumber,
              ifscCode,
              bankName,
            },
            status,
            rejectedReason,
            isActive,
          }),
        },
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error ?? "Save failed");
      }

      router.push(mode === "create" ? "/sellers" : `/sellers/${id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const hasErrors = Object.values(fieldErrors).some(Boolean) || !!error;

  return (
    <div className="space-y-6">
      <FormHeader title={mode === "create" ? "Create Seller" : "Edit Seller"} />

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        {loading ? (
          <FormSkeleton />
        ) : editError ? (
          <FormError error={editError} />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && <FormError error={error} />}

            {/* ================= AUTH ================= */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Email" required>
                <Input
                  type="email"
                  value={email}
                  placeholder="johndoe@gmail.com"
                  onChange={(e) => {
                    clearFieldError("email");
                    setError(null);
                    setEmail(e.target.value);
                  }}
                  error={!!fieldErrors.email}
                  hint={fieldErrors.email}
                />
              </FormField>

              <FormField label="Password" required>
                <Input
                  type="password"
                  value={password}
                  placeholder={
                    mode === "edit" ? "Leave blank to keep unchanged" : ""
                  }
                  onChange={(e) => {
                    clearFieldError("password");
                    setError(null);
                    setPassword(e.target.value);
                  }}
                  error={!!fieldErrors.password}
                  hint={fieldErrors.password}
                />
              </FormField>

              <FormField label="Phone">
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </FormField>
            </div>

            {/* ================= BUSINESS ================= */}
            <CollapsibleFormSection
              title="Business Details"
              collapsible
              defaultOpen
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Seller Type">
                  <Select
                    value={sellerType}
                    onChange={setSellerType}
                    options={[
                      { label: "Vendor", value: "vendor" },
                      { label: "Craft Maker", value: "craft_maker" },
                    ]}
                  />
                </FormField>

                <FormField label="Business Name" required>
                  <Input
                    value={businessName}
                    onChange={(e) => {
                      clearFieldError("businessName");
                      setError(null);
                      setBusinessName(e.target.value);
                    }}
                    error={!!fieldErrors.businessName}
                    hint={fieldErrors.businessName}
                  />
                </FormField>

                <FormField label="Business Type">
                  <Select
                    value={businessType}
                    onChange={setBusinessType}
                    options={[
                      { label: "Individual", value: "individual" },
                      { label: "Proprietorship", value: "proprietorship" },
                      { label: "Partnership", value: "partnership" },
                      { label: "LLP", value: "llp" },
                      { label: "Private Limited", value: "private_limited" },
                      { label: "Public Limited", value: "public_limited" },
                    ]}
                  />
                </FormField>

                <FormField label="Legal Name">
                  <Input
                    value={legalName}
                    onChange={(e) => setLegalName(e.target.value)}
                  />
                </FormField>

                <FormField label="GSTIN">
                  <Input
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                  />
                </FormField>
              </div>
            </CollapsibleFormSection>

            {/* ================= ADDRESS ================= */}

            <CollapsibleFormSection title="Business Address" collapsible>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Address">
                  <Input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </FormField>

                <FormField label="City">
                  <Input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </FormField>

                <FormField label="State">
                  <Input
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                </FormField>

                <FormField label="Pincode">
                  <Input
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                  />
                </FormField>
              </div>
            </CollapsibleFormSection>

            {/* ================= BANK ================= */}

            <CollapsibleFormSection title="Bank Details" collapsible>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Account Holder Name">
                  <Input
                    value={accountHolderName}
                    onChange={(e) => setAccountHolderName(e.target.value)}
                  />
                </FormField>

                <FormField label="Account Number">
                  <Input
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                  />
                </FormField>

                <FormField label="IFSC Code">
                  <Input
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value)}
                  />
                </FormField>

                <FormField label="Bank Name">
                  <Input
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                  />
                </FormField>
              </div>
            </CollapsibleFormSection>

            {/* ================= STATUS ================= */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Status">
                <Select
                  value={status}
                  onChange={setStatus}
                  options={[
                    { label: "Pending", value: "pending" },
                    { label: "Approved", value: "approved" },
                    { label: "Suspended", value: "suspended" },
                    { label: "Rejected", value: "rejected" },
                  ]}
                />
              </FormField>

              {status === "rejected" && (
                <FormField label="Rejected Reason">
                  <Input
                    value={rejectedReason}
                    onChange={(e) => setRejectedReason(e.target.value)}
                  />
                </FormField>
              )}

              <FormField label="Active">
                <Switch
                  label={isActive ? "Active" : "Inactive"}
                  defaultChecked={isActive}
                  onChange={setIsActive}
                />
              </FormField>
            </div>

            <FormActions
              primaryLabel={
                saving
                  ? "Saving..."
                  : mode === "create"
                    ? "Create Seller"
                    : "Update Seller"
              }
              primaryDisabled={saving || hasErrors}
              backLabel="Cancel"
              onBack={() => router.back()}
            />
          </form>
        )}
      </div>
    </div>
  );
}
