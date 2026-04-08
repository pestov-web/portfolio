import { redirect } from "next/navigation";
import { defaultLocale } from "@/shared/config/i18n";

// Редиректим с / на /ru (или любую дефолтную локаль)
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
