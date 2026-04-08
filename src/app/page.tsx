import { redirect } from "next/navigation";
import { defaultLocale } from "@/shared/config/index";

// Редиректим с / на /ru (или любую дефолтную локаль)
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
