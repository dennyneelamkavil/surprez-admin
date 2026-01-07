import { toast } from "react-toastify";

type DeleteActionOptions = {
  confirmMessage?: string;
  successMessage?: string;
  errorMessage?: string;
};

export async function deleteAction(
  url: string,
  options?: DeleteActionOptions
): Promise<boolean> {
  const {
    confirmMessage = "Are you sure you want to delete this item?",
    successMessage = "Deleted successfully",
    errorMessage = "Failed to delete item",
  } = options ?? {};

  const ok = confirm(confirmMessage);
  if (!ok) return false;

  try {
    const res = await fetch(url, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data?.error ?? errorMessage);
      return false;
    }

    toast.success(successMessage);
    return true;
  } catch (err) {
    toast.error("Network error. Please try again.");
    return false;
  }
}
