import { notFound } from "next/navigation";
import { auth } from "@/shared/auth/server/index";
import type { Locale } from "@/shared/config/index";
import { prisma } from "@/shared/lib/prisma";
import { headers } from "next/headers";
import { updateUserRole } from "../actions";

// Бейдж роли
function RoleBadge({ role }: { role: "USER" | "FRIEND" | "ADMIN" }) {
  const styles = {
    USER:   "bg-subtle text-muted",
    FRIEND: "bg-accent-vivid/10 text-accent",
    ADMIN:  "bg-red-500/10 text-red-400",
  };
  const labels = { USER: "User", FRIEND: "Friend", ADMIN: "Admin" };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-mono font-medium ${styles[role]}`}>
      {labels[role]}
    </span>
  );
}

export default async function AdminUsersPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

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

  return (
    <div className="page-container page-x fade-in">
      <div className="py-14">
        <div className="mb-8">
          <p className="font-mono text-xs text-faint mb-2">
            <span className="text-accent">$</span> sudo users --list
          </p>
          <h1 className="text-2xl font-bold">Пользователи</h1>
          <p className="text-sm text-muted mt-1">{users.length} аккаунтов</p>
        </div>

        <div className="flex flex-col gap-2">
          {users.map((user) => {
            const updateRole = updateUserRole.bind(null, user.id, locale);
            const isCurrentUser = user.id === session.user.id;

            return (
              <div
                key={user.id}
                className="glass px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4"
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
                      <RoleBadge role={user.role} />
                      {isCurrentUser && (
                        <span className="text-xs text-faint">(вы)</span>
                      )}
                    </div>
                    <div className="text-xs text-faint truncate">{user.email}</div>
                    <div className="text-xs text-faint mt-0.5">
                      {user._count.comments} комм. · зарег. {new Date(user.createdAt).toLocaleDateString("ru-RU")}
                    </div>
                  </div>
                </div>

                {/* Форма смены роли */}
                {!isCurrentUser && (
                  <form action={updateRole} className="flex items-center gap-2 shrink-0">
                    <select
                      name="role"
                      defaultValue={user.role}
                      className="h-8 rounded-md border border-border bg-surface px-2 text-xs focus:outline-none focus:ring-2 focus:ring-accent-vivid/50 focus:border-accent-vivid transition-colors"
                    >
                      <option value="USER">User</option>
                      <option value="FRIEND">Friend</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                    <button
                      type="submit"
                      className="h-8 px-3 text-xs font-medium bg-accent-vivid text-white rounded-md hover:bg-accent-dim transition-colors"
                    >
                      Сохранить
                    </button>
                  </form>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
