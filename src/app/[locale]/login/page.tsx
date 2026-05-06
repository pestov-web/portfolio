import type { Metadata } from 'next';
import LoginClient from "./login-client";
import { enabledAuthProviders } from "@/shared/config/auth-providers";

export const metadata: Metadata = {
    title: 'Sign in',
    robots: { index: false, follow: false },
};

export default function LoginPage() {
  return <LoginClient enabledProviders={enabledAuthProviders} />;
}
