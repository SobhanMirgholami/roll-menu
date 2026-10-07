import { supabase } from "./supabaseClient";

export function toProduct(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    category: row.category,
    isAvailable: row.is_available,
    image: row.image_url,
    imagePath: row.image_path,
    createdAt: row.created_at,
  };
}

export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, name, description, price, category, " +
        "is_available, image_url, image_path, created_at",
    )
    .order("created_at", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map(toProduct);
}
export async function uploadProductImage(image) {
  if (typeof image !== "string" || !image.startsWith("data:image/")) {
    throw new Error("عکس محصول را انتخاب کن.");
  }

  // تبدیل عکس آماده‌شدهٔ فرم به فایل قابل آپلود
  const response = await fetch(image);
  const file = await response.blob();

  const extensions = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };

  const extension = extensions[file.type];

  if (!extension) {
    throw new Error("عکس باید JPG، PNG یا WebP باشد.");
  }

  if (file.size > 2 * 1024 * 1024) {
    throw new Error("حجم عکس باید حداکثر ۲ مگابایت باشد.");
  }

  const imagePath = `${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from("product-images")
    .upload(imagePath, file, {
      contentType: file.type,
      cacheControl: "31536000",
      upsert: false,
    });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage
    .from("product-images")
    .getPublicUrl(imagePath);

  return {
    imageUrl: data.publicUrl,
    imagePath,
  };
}


// فقط مسیرهایی را بررسی می‌کنیم که همین عملیات آزاد کرده است.
async function removeUnusedProductImage(imagePath) {
  if (!imagePath) return null;

  try {
    const { data, error } = await supabase
      .from("products")
      .select("id")
      .eq("image_path", imagePath)
      .limit(1);

    if (error) return error;
    if (!Array.isArray(data)) return new Error("بررسی استفاده از عکس انجام نشد.");
    if (data.length > 0) return null;

    const { error: imageError } = await supabase.storage
      .from("product-images")
      .remove([imagePath]);

    return imageError ?? null;
  } catch (error) {
    return error;
  }
}

function isConfirmedDatabaseFailure(error) {
  const code = error?.code ?? "";

  return /^[0-9A-Z]{5}$/.test(code) &&
    !code.startsWith("08") &&
    code !== "40003";
}

async function productSaveError(error, imagePath) {
  if (!imagePath) return error;

  if (!isConfirmedDatabaseFailure(error)) {
    return new Error(
      "ذخیره محصول تأیید نشد؛ صفحه را تازه کنید و قبل از ثبت دوباره، نتیجه را بررسی کنید.",
      { cause: error }
    );
  }

  const cleanupError = await removeUnusedProductImage(imagePath);

  if (cleanupError) {
    return new Error(
      `${error.message || "ذخیره محصول انجام نشد."} عکس آپلودشده هم پاک نشد.`,
      { cause: error }
    );
  }

  return error;
}

export async function createProduct(product) {
  const { imageUrl, imagePath } = await uploadProductImage(product.image);

  const { data, error } = await supabase
    .from("products")
    .insert({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      is_available: true,
      image_url: imageUrl,
      image_path: imagePath,
    })
    .select()
    .single();

  if (error) {
    throw await productSaveError(error, imagePath);
  }

  return toProduct(data);
}
export async function setProductAvailability(id, isAvailable) {
  const { data, error } = await supabase
    .from("products")
    .update({
      is_available: isAvailable,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return toProduct(data);
}
export async function updateProduct(product) {
  const changes = {
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
  };

  const hasNewImage =
    typeof product.image === "string" &&
    product.image.startsWith("data:image/");

  let oldImagePath = null;
  let newImagePath = null;

  if (hasNewImage) {
    const { data: current, error: readError } = await supabase
      .from("products")
      .select("image_path")
      .eq("id", product.id)
      .single();

    if (readError) throw readError;
    oldImagePath = current.image_path;

    const uploaded = await uploadProductImage(product.image);
    newImagePath = uploaded.imagePath;
    changes.image_url = uploaded.imageUrl;
    changes.image_path = uploaded.imagePath;
  }

  const { data, error } = await supabase
    .from("products")
    .update(changes)
    .eq("id", product.id)
    .select()
    .single();

  if (error) {
    throw await productSaveError(error, newImagePath);
  }

  let imageCleanupFailed = false;

  if (newImagePath && oldImagePath && oldImagePath !== newImagePath) {
    const cleanupError = await removeUnusedProductImage(oldImagePath);
    imageCleanupFailed = Boolean(cleanupError);
  }

  return {
    product: toProduct(data),
    imageCleanupFailed,
  };
}

export async function deleteProduct(id) {
  const { data, error } = await supabase
    .from("products")
    .delete()
    .eq("id", id)
    .select("id, image_path")
    .single();

  if (error) throw error;

  const cleanupError = await removeUnusedProductImage(data.image_path);

  return {
    id: data.id,
    imageCleanupFailed: Boolean(cleanupError),
  };
}
