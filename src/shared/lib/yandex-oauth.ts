type YandexProfile = {
  id: string;
  display_name?: string;
  real_name?: string;
  default_email?: string;
  default_avatar_id?: string;
};

export function mapYandexUserInfo(data: YandexProfile) {
  const email = data.default_email ?? `yandex-${data.id}@oauth.local`;

  return {
    id: data.id,
    name: data.display_name ?? data.real_name ?? "Пользователь",
    email,
    emailVerified: Boolean(data.default_email),
    image: data.default_avatar_id
      ? `https://avatars.yandex.net/get-yapic/${data.default_avatar_id}/islands-200`
      : undefined,
  };
}