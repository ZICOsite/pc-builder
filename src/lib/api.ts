import type {
  AdminDashboard,
  AdminLeaderboards,
  AdminStatsPoint,
  AdminUser,
  Build,
  Component,
  ComponentInput,
  ComponentType,
  Order,
  OrderStatus,
  PaginatedComponents,
  ReferralStats,
  RequiredCategory,
  StatsRangeDays,
  UserProfile,
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";
const BOT_USERNAME = process.env.NEXT_PUBLIC_BOT_USERNAME ?? "PCForgeUzBot";

export function getReferralLink(buildId: string): string {
  return `https://t.me/${BOT_USERNAME}?start=${buildId}`;
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function loginWithTelegram(initData: string): Promise<{ accessToken: string }> {
  const res = await fetch(`${API_BASE_URL}/auth/telegram`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ initData }),
  });

  if (!res.ok) {
    throw new ApiError(res.status, `Telegram auth failed: ${res.status}`);
  }

  return res.json();
}

export async function apiFetch(path: string, accessToken: string, init?: RequestInit) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new ApiError(res.status, `API error: ${res.status}`);
  }

  if (res.status === 204) return undefined;
  return res.json();
}

export async function getComponents(type: ComponentType): Promise<Component[]> {
  const res = await fetch(`${API_BASE_URL}/components?type=${type}`);
  if (!res.ok) {
    throw new ApiError(res.status, `Failed to load components: ${res.status}`);
  }
  return res.json();
}

export async function getComponentsPage(
  type: ComponentType,
  params: { page: number; limit: number; search?: string; brand?: string; sortOrder: "asc" | "desc" },
): Promise<PaginatedComponents> {
  const query = new URLSearchParams({
    type,
    page: String(params.page),
    limit: String(params.limit),
    sortBy: "price",
    sortOrder: params.sortOrder,
  });
  if (params.search) query.set("search", params.search);
  if (params.brand) query.set("brand", params.brand);

  const res = await fetch(`${API_BASE_URL}/components?${query.toString()}`);
  if (!res.ok) {
    throw new ApiError(res.status, `Failed to load components: ${res.status}`);
  }
  return res.json();
}

export async function getComponentBrands(type: ComponentType): Promise<string[]> {
  const res = await fetch(`${API_BASE_URL}/components/brands?type=${type}`);
  if (!res.ok) {
    throw new ApiError(res.status, `Failed to load brands: ${res.status}`);
  }
  return res.json();
}

export async function saveBuild(
  accessToken: string,
  items: { componentId: number; quantity: number }[],
  name?: string,
): Promise<Build> {
  const build: Build = await apiFetch("/builds", accessToken, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(name ? { name } : {}),
  });

  for (const item of items) {
    await apiFetch(`/builds/${build.id}/items`, accessToken, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
  }

  return apiFetch(`/builds/${build.id}`, accessToken);
}

export async function getMyBuilds(accessToken: string): Promise<Build[]> {
  return apiFetch("/builds", accessToken);
}

export async function deleteBuild(id: string, accessToken: string): Promise<void> {
  await apiFetch(`/builds/${id}`, accessToken, { method: "DELETE" });
}

// Синхронизирует состав уже существующей сборки с текущим выбором (используется при
// "продолжении" сборки в конфигураторе) — добавляет новые позиции, убирает снятые.
export async function updateBuildItems(
  accessToken: string,
  buildId: string,
  items: { componentId: number; quantity: number }[],
): Promise<Build> {
  const current: Build = await apiFetch(`/builds/${buildId}`, accessToken);
  const nextIds = new Set(items.map((item) => item.componentId));

  for (const item of current.items) {
    if (!nextIds.has(item.componentId)) {
      await apiFetch(`/builds/${buildId}/items/${item.componentId}`, accessToken, { method: "DELETE" });
    }
  }

  const currentIds = new Set(current.items.map((item) => item.componentId));
  for (const item of items) {
    if (!currentIds.has(item.componentId)) {
      await apiFetch(`/builds/${buildId}/items`, accessToken, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
    }
  }

  return apiFetch(`/builds/${buildId}`, accessToken);
}

export async function getBuild(id: string, accessToken?: string): Promise<Build> {
  const res = await fetch(`${API_BASE_URL}/builds/${id}`, {
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
  });

  if (!res.ok) {
    throw new ApiError(res.status, `Failed to load build: ${res.status}`);
  }

  return res.json();
}

export async function shareBuild(id: string, accessToken: string): Promise<Build> {
  return apiFetch(`/builds/${id}/share`, accessToken, { method: "POST" });
}

export async function orderBuild(id: string, accessToken: string): Promise<void> {
  await apiFetch(`/builds/${id}/order`, accessToken, { method: "POST" });
}

export async function getProfile(accessToken: string): Promise<UserProfile> {
  return apiFetch("/users/me", accessToken);
}

export async function getReferralStats(accessToken: string): Promise<ReferralStats> {
  return apiFetch("/referrals/stats", accessToken);
}

export async function trackReferral(buildId: string, accessToken: string): Promise<void> {
  await apiFetch("/referrals/track", accessToken, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ buildId }),
  });
}

export async function getAdminDashboard(accessToken: string): Promise<AdminDashboard> {
  return apiFetch("/admin/dashboard", accessToken);
}

export async function getAdminComponents(accessToken: string): Promise<Component[]> {
  return apiFetch("/admin/components", accessToken);
}

export async function getAdminComponent(id: number, accessToken: string): Promise<Component> {
  return apiFetch(`/admin/components/${id}`, accessToken);
}

export async function createComponent(input: ComponentInput, accessToken: string): Promise<Component> {
  return apiFetch("/admin/components", accessToken, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export async function updateComponent(
  id: number,
  input: Partial<ComponentInput>,
  accessToken: string,
): Promise<Component> {
  return apiFetch(`/admin/components/${id}`, accessToken, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export async function deleteComponent(id: number, accessToken: string): Promise<void> {
  await apiFetch(`/admin/components/${id}`, accessToken, { method: "DELETE" });
}

export async function getAdminOrders(accessToken: string): Promise<Order[]> {
  return apiFetch("/orders", accessToken);
}

export async function getAdminUsers(accessToken: string): Promise<AdminUser[]> {
  return apiFetch("/admin/users", accessToken);
}

export async function getAdminStats(days: StatsRangeDays, accessToken: string): Promise<AdminStatsPoint[]> {
  return apiFetch(`/admin/stats?days=${days}`, accessToken);
}

export async function getAdminLeaderboards(accessToken: string): Promise<AdminLeaderboards> {
  return apiFetch("/admin/leaderboards", accessToken);
}

// Публичный эндпоинт — нужен всем, кто смотрит сборку, не только админу
export async function getRequiredCategories(): Promise<RequiredCategory[]> {
  const res = await fetch(`${API_BASE_URL}/settings/required-categories`);
  if (!res.ok) {
    throw new ApiError(res.status, `Failed to load required categories: ${res.status}`);
  }
  return res.json();
}

export async function updateRequiredCategory(
  type: ComponentType,
  required: boolean,
  accessToken: string,
): Promise<RequiredCategory> {
  return apiFetch(`/settings/required-categories/${type}`, accessToken, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ required }),
  });
}

export async function updateOrderStatus(id: number, status: OrderStatus, accessToken: string): Promise<Order> {
  return apiFetch(`/orders/${id}`, accessToken, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
}
