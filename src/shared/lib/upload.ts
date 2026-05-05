export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

type ImageValidationMessages = {
  invalidType: string;
  tooLarge: string;
};

const defaultImageValidationMessages: ImageValidationMessages = {
  invalidType: "Недопустимый тип файла",
  tooLarge: "Файл слишком большой (макс. 10 МБ)",
};

export function validateImageFile(file: File, messages: ImageValidationMessages = defaultImageValidationMessages) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error(messages.invalidType);
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error(messages.tooLarge);
  }
}

export function getOptionalFile(formData: FormData, fieldName: string): File | null {
  const value = formData.get(fieldName);

  if (!(value instanceof File) || value.size === 0) {
    return null;
  }

  return value;
}