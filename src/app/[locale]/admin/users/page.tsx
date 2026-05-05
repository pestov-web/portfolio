import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { auth } from "@/shared/auth/server/index";
import type { Locale } from "@/shared/config/index";
import { prisma } from "@/shared/lib/prisma";
import { headers } from "next/headers";
import { PageHeader } from "@/shared/ui/page-header";
import { ListRow } from "@/shared/ui/list-row";
import { NativeSelect } from "@/shared/ui/native-select";
import { Button } from "@/shared/ui";
import { updateUserRole } from "../actions";
import { ActionForm } from "../action-form";
import { RoleBadge } from "./role-badge";

export default async function AdminUsersPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("admin");

  // Проверяем права
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "ADMIN") notFound();

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
      _count: { select: { comments: true } },
    },
  });

  const dateLocale = locale === "ru" ? "ru-RU" : "en-US";
  const roleLabels = {
    USER: t("usersPage.roles.USER"),
    FRIEND: t("usersPage.roles.FRIEND"),
    ADMIN: t("usersPage.roles.ADMIN"),
  } as const;

  return (
    <div className="page-container page-x fade-in">
      <div className="py-14">
        <PageHeader
          title={t("usersPage.title")}
          description={t("usersPage.accountsCount", { count: users.length })}
          eyebrow={<><span className="text-accent">$</span> sudo users --list</>}
          size="md"
        />

        <div className="flex flex-col gap-2">
          {users.map((user) => {
            const updateRole = updateUserRole.bind(null, user.id, locale);
            const isCurrentUser = user.id === session.user.id;

            return (
              <ListRow
                key={user.id}
                layout="responsive"
                padding="comfortable"
              >
                {/* Аватар + info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="shrink-0 size-9 rounded-full bg-subtle overflow-hidden flex items-center justify-center text-sm font-medium text-muted">
                    {user.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={user.image} alt={user.name} className="size-full object-cover" />
                    ) : (
                      user.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm truncate">{user.name}</span>
                      <RoleBadge role={user.role} label={roleLabels[user.role]} />
                      {isCurrentUser && (
                        <span className="text-xs text-faint">{t("usersPage.currentUser")}</span>
                      )}
                    </div>
                    <div className="text-xs text-faint truncate">{user.email}</div>
                    <div className="text-xs text-faint mt-0.5">
                      {t("usersPage.summary", {
                        comments: user._count.comments,
                        date: new Date(user.createdAt).toLocaleDateString(dateLocale),
                      })}
                    </div>
                  </div>
                </div>

                {/* Форма смены роли */}
                {!isCurrentUser && (
                  <ActionForm action={updateRole} className="flex items-center gap-2 shrink-0">
                    <NativeSelect
                      name="role"
                      defaultValue={user.role}
                    >
                      <option value="USER">{roleLabels.USER}</option>
                      <option value="FRIEND">{roleLabels.FRIEND}</option>
                      <option value="ADMIN">{roleLabels.ADMIN}</option>
                    </NativeSelect>
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                    >
                      {t("save")}
                    </Button>
                  </ActionForm>
                )}
              </ListRow>
            );
          })}
        </div>
      </div>
    </div>
  );
}
