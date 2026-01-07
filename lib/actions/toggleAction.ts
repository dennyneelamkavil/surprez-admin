import { toast } from "react-toastify";

type ToggleActionOptions = {
  confirmMessage?: string;
  successMessage?: string;
  errorMessage?: string;
};

export async function toggleAction(
  url: string,
  payload: Record<string, any>,
  options?: ToggleActionOptions
): Promise<boolean> {
  const {
    confirmMessage = "Are you sure you want to update this status?",
    successMessage = "Status updated successfully",
    errorMessage = "Failed to update status",
  } = options ?? {};

  const ok = confirm(confirmMessage);
  if (!ok) return false;

  try {
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data?.error ?? errorMessage);
      return false;
    }

    toast.success(successMessage);
    return true;
  } catch {
    toast.error("Network error. Please try again.");
    return false;
  }
}
