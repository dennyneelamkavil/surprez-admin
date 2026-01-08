"use client";

import Button from "@/components/ui/button/Button";

type FormActionsProps = {
  primaryLabel?: string;
  onPrimary?: () => void;
  primaryDisabled?: boolean;
  primarytype?: "submit" | "button";

  secondaryLabel?: string;
  onSecondary?: () => void;
  secondarytype?: "submit" | "button";

  backLabel?: string;
  onBack?: () => void;
};

export default function FormActions({
  primaryLabel,
  onPrimary,
  primaryDisabled = false,
  primarytype = "submit",

  secondaryLabel,
  onSecondary,
  secondarytype = "button",

  backLabel = "Back",
  onBack,
}: FormActionsProps) {
  return (
    <div className="flex gap-3 pt-6 border-t dark:border-gray-800">
      {primaryLabel && (
        <Button type={primarytype} disabled={primaryDisabled} onClick={onPrimary}>
          {primaryLabel}
        </Button>
      )}

      {secondaryLabel && onSecondary && (
        <Button variant="outline" type={secondarytype} onClick={onSecondary}>
          {secondaryLabel}
        </Button>
      )}

      {onBack && (
        <Button variant="outline" type="button" onClick={onBack}>
          {backLabel}
        </Button>
      )}
    </div>
  );
}
