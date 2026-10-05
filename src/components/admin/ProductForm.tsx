"use client";

import { PRODUCT_CATEGORIES } from "@/constants/categories";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Toast, type ToastType } from "@/components/ui/Toast";
import { uploadProductImage } from "@/lib/supabase/storage";
import { cn, parsePrice } from "@/lib/utils";
import type { Product, ProductCategory, ProductFormData } from "@/types/product";
import { ImagePlus, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: ProductFormData) => Promise<{ error: string | null }>;
}

function initialNameRu(product?: Product): string {
  return product?.name_ru?.trim() || product?.name?.trim() || "";
}

function initialNameTg(product?: Product): string {
  return (
    product?.name_tg?.trim() ||
    product?.name_ru?.trim() ||
    product?.name?.trim() ||
    ""
  );
}

function initialNameEn(product?: Product): string {
  return (
    product?.name_en?.trim() ||
    product?.name_ru?.trim() ||
    product?.name?.trim() ||
    ""
  );
}

function initialDescriptionRu(product?: Product): string {
  return product?.description_ru?.trim() || product?.description?.trim() || "";
}

function initialDescriptionTg(product?: Product): string {
  return (
    product?.description_tg?.trim() ||
    product?.description_ru?.trim() ||
    product?.description?.trim() ||
    ""
  );
}

function initialDescriptionEn(product?: Product): string {
  return (
    product?.description_en?.trim() ||
    product?.description_ru?.trim() ||
    product?.description?.trim() ||
    ""
  );
}

export function ProductForm({ product, onSubmit }: ProductFormProps) {
  const { t } = useLanguage();
  const router = useRouter();

  const categoryOptions = PRODUCT_CATEGORIES.map((c) => ({
    value: c,
    label: t.categories[c],
  }));

  const [nameRu, setNameRu] = useState(() => initialNameRu(product));
  const [nameTg, setNameTg] = useState(() => initialNameTg(product));
  const [nameEn, setNameEn] = useState(() => initialNameEn(product));
  const [descriptionRu, setDescriptionRu] = useState(() =>
    initialDescriptionRu(product),
  );
  const [descriptionTg, setDescriptionTg] = useState(() =>
    initialDescriptionTg(product),
  );
  const [descriptionEn, setDescriptionEn] = useState(() =>
    initialDescriptionEn(product),
  );
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [category, setCategory] = useState<ProductCategory>(
    product?.category ?? "hotdog",
  );
  const [isAvailable, setIsAvailable] = useState(product?.is_available ?? true);
  const [imageUrl, setImageUrl] = useState(product?.image_url ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);
  const fileInputId = useId();

  useEffect(() => {
    return () => {
      if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
    };
  }, [localPreviewUrl]);

  function revokeLocalPreview() {
    setLocalPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name);
    setLocalPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });

    setUploading(true);
    const { url, error } = await uploadProductImage(file);
    setUploading(false);
    if (error) {
      setToast({ message: error, type: "error" });
      return;
    }
    if (url) {
      setImageUrl(url);
      revokeLocalPreview();
    }
    setToast({ message: t.admin.productForm.imageUploaded, type: "success" });
  }

  const previewSrc = localPreviewUrl ?? (imageUrl || null);
  const isLocalPreview = Boolean(localPreviewUrl);

  function validate(): ProductFormData | null {
    const newErrors: Record<string, string> = {};
    const priceNum = parsePrice(price);

    if (!nameRu.trim()) {
      newErrors.nameRu = t.admin.productForm.errors.nameRuRequired;
    }
    if (!Number.isFinite(priceNum) || priceNum < 0) {
      newErrors.price = t.admin.productForm.errors.priceInvalid;
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return null;

    return {
      name_ru: nameRu.trim(),
      name_tg: nameTg.trim(),
      name_en: nameEn.trim(),
      description_ru: descriptionRu.trim(),
      description_tg: descriptionTg.trim(),
      description_en: descriptionEn.trim(),
      price: priceNum,
      category: category as ProductFormData["category"],
      is_available: isAvailable,
      image_url: imageUrl || null,
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = validate();
    if (!data) return;

    setLoading(true);
    const { error } = await onSubmit(data);
    setLoading(false);

    if (error) {
      setToast({ message: error, type: "error" });
      return;
    }

    setToast({
      message: product
        ? t.admin.productForm.updated
        : t.admin.productForm.created,
      type: "success",
    });
    setTimeout(() => {
      router.push("/admin/products");
      router.refresh();
    }, 800);
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
        <fieldset className="space-y-4 rounded-2xl border border-stone-200 p-4 dark:border-stone-800">
          <legend className="px-1 text-sm font-semibold text-stone-800 dark:text-stone-200">
            {t.admin.productForm.namesSection}
          </legend>
          <Input
            label={t.admin.productForm.nameRu}
            value={nameRu}
            onChange={(e) => setNameRu(e.target.value)}
            error={errors.nameRu}
            required
          />
          <Input
            label={t.admin.productForm.nameTg}
            value={nameTg}
            onChange={(e) => setNameTg(e.target.value)}
          />
          <Input
            label={t.admin.productForm.nameEn}
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
          />
        </fieldset>

        <fieldset className="space-y-4 rounded-2xl border border-stone-200 p-4 dark:border-stone-800">
          <legend className="px-1 text-sm font-semibold text-stone-800 dark:text-stone-200">
            {t.admin.productForm.descriptionsSection}
          </legend>
          <Textarea
            label={t.admin.productForm.descriptionRu}
            value={descriptionRu}
            onChange={(e) => setDescriptionRu(e.target.value)}
            rows={3}
          />
          <Textarea
            label={t.admin.productForm.descriptionTg}
            value={descriptionTg}
            onChange={(e) => setDescriptionTg(e.target.value)}
            rows={3}
          />
          <Textarea
            label={t.admin.productForm.descriptionEn}
            value={descriptionEn}
            onChange={(e) => setDescriptionEn(e.target.value)}
            rows={3}
          />
        </fieldset>

        <Input
          label={t.admin.productForm.price}
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          error={errors.price}
          required
        />
        <Select
          label={t.admin.productForm.category}
          value={category}
          onChange={(e) => setCategory(e.target.value as ProductCategory)}
          options={categoryOptions}
        />

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="is_available"
            checked={isAvailable}
            onChange={(e) => setIsAvailable(e.target.checked)}
            className="h-5 w-5 rounded border-stone-300 text-gold focus:ring-gold"
          />
          <label
            htmlFor="is_available"
            className="text-sm font-medium text-stone-700 dark:text-stone-300"
          >
            {t.admin.productForm.inStock}
          </label>
        </div>

        <div>
          <span className="mb-2 block text-sm font-medium text-stone-700 dark:text-stone-300">
            {t.admin.productForm.photo}
          </span>

          {previewSrc ? (
            <div className="relative mb-4 h-44 w-full max-w-sm overflow-hidden rounded-xl border border-stone-200 bg-stone-100 shadow-sm dark:border-stone-700 dark:bg-stone-900">
              <Image
                src={previewSrc}
                alt={
                  isLocalPreview
                    ? t.admin.productForm.previewSelected
                    : t.admin.productForm.previewCurrent
                }
                fill
                unoptimized={isLocalPreview}
                className="object-cover"
                sizes="(max-width: 384px) 100vw, 384px"
              />
              {uploading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-stone-950/50 backdrop-blur-[2px]">
                  <Loader2
                    className="h-8 w-8 animate-spin text-gold"
                    aria-hidden
                  />
                  <span className="sr-only">
                    {t.admin.productForm.uploadingImage}
                  </span>
                </div>
              ) : null}
            </div>
          ) : null}

          <div
            className={cn(
              "rounded-xl border-2 border-dashed transition-colors",
              "border-stone-200 bg-stone-50/80 dark:border-stone-700 dark:bg-stone-900/40",
              "hover:border-gold/70 hover:bg-gold/5 dark:hover:border-gold/50 dark:hover:bg-gold/5",
              "focus-within:border-gold focus-within:ring-2 focus-within:ring-gold/25",
              uploading && "pointer-events-none opacity-70",
            )}
          >
            <div className="flex flex-col items-center gap-3 px-6 py-8 text-center">
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-full",
                  "bg-stone-200/80 text-stone-500 dark:bg-stone-800 dark:text-stone-400",
                )}
                aria-hidden
              >
                <ImagePlus className="h-6 w-6" />
              </div>

              <input
                id={fileInputId}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                disabled={uploading}
                className="sr-only"
              />

              <label
                htmlFor={fileInputId}
                className={cn(
                  "inline-flex cursor-pointer items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold transition-all",
                  "brand-gradient text-white shadow-md shadow-gold/20",
                  "hover:brightness-110 hover:shadow-gold/30",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 dark:focus-visible:ring-offset-stone-950",
                  uploading && "cursor-wait opacity-80",
                )}
              >
                {uploading
                  ? t.admin.productForm.uploading
                  : previewSrc
                    ? t.admin.productForm.replacePhoto
                    : t.admin.productForm.selectPhoto}
              </label>

              <p className="text-xs text-stone-500 dark:text-stone-400">
                {t.admin.productForm.fileHint}
              </p>

              {selectedFileName ? (
                <p
                  className="max-w-full truncate text-sm font-medium text-stone-700 dark:text-stone-300"
                  title={selectedFileName}
                >
                  {selectedFileName}
                </p>
              ) : imageUrl && !selectedFileName ? (
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {t.admin.productForm.currentPhotoUploaded}
                </p>
              ) : null}
            </div>
          </div>

          {uploading && !previewSrc ? (
            <p className="mt-2 flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              {t.admin.productForm.uploadingToServer}
            </p>
          ) : null}
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" isLoading={loading}>
            {product ? t.admin.productForm.save : t.admin.productForm.create}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            {t.common.cancel}
          </Button>
        </div>
      </form>

      {toast ? (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      ) : null}
    </>
  );
}
