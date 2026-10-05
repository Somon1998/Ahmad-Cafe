"use client";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/hooks/useLanguage";

interface DeleteProductDialogProps {
  open: boolean;
  productName: string;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export function DeleteProductDialog({
  open,
  productName,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteProductDialogProps) {
  const { t } = useLanguage();

  return (
    <Modal open={open} onClose={onClose} title={t.admin.deleteDialog.title}>
      <p className="mb-6 text-stone-600 dark:text-stone-400">
        {t.admin.deleteDialog.message(productName)}
      </p>
      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={onClose}>
          {t.common.cancel}
        </Button>
        <Button
          variant="primary"
          className="flex-1 !bg-red-600 hover:!brightness-110"
          onClick={onConfirm}
          isLoading={isDeleting}
        >
          {t.common.delete}
        </Button>
      </div>
    </Modal>
  );
}
