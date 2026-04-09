import LoginClient from "./login-client";
import { enabledAuthProviders } from "@/shared/config/auth-providers";

export default function LoginPage() {
  return <LoginClient enabledProviders={enabledAuthProviders} />;
}
