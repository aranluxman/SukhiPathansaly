const TABLE_NAME = 'sukhi_wellness_entries';
const OWNER_KEY = 'sukhi_cloud_owner_id';

type SupabaseRow<T> = {
  id: string;
  payload: T;
  updated_at?: string;
};

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return {
    url: url.replace(/\/$/, ''),
    anonKey
  };
}

export function isCloudStorageConfigured() {
  return Boolean(getSupabaseConfig());
}

export function getOwnerId() {
  if (typeof window === 'undefined') {
    return 'server';
  }

  const saved = window.localStorage.getItem(OWNER_KEY);
  if (saved) {
    return saved;
  }

  const next =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  window.localStorage.setItem(OWNER_KEY, next);
  return next;
}

async function requestSupabase<T>(path: string, init?: RequestInit) {
  const config = getSupabaseConfig();
  if (!config) {
    return null;
  }

  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: config.anonKey,
      Authorization: `Bearer ${config.anonKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...(init?.headers ?? {})
    }
  });

  if (!response.ok) {
    throw new Error(`Supabase request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return (await response.json()) as T;
}

export async function fetchCloudCollection<T>(collection: string) {
  const ownerId = getOwnerId();
  const params = new URLSearchParams({
    select: 'id,payload,updated_at',
    owner_id: `eq.${ownerId}`,
    collection: `eq.${collection}`,
    order: 'updated_at.desc'
  });

  const rows = await requestSupabase<SupabaseRow<T>[]>(`${TABLE_NAME}?${params.toString()}`);
  return rows?.map((row) => row.payload) ?? [];
}

export async function upsertCloudItem<T extends { id: string }>(collection: string, item: T) {
  const ownerId = getOwnerId();
  await requestSupabase(`${TABLE_NAME}?on_conflict=owner_id,collection,id`, {
    method: 'POST',
    body: JSON.stringify({
      owner_id: ownerId,
      collection,
      id: item.id,
      payload: item
    }),
    headers: {
      Prefer: 'resolution=merge-duplicates'
    }
  });
}

export async function deleteCloudItem(collection: string, id: string) {
  const ownerId = getOwnerId();
  const params = new URLSearchParams({
    owner_id: `eq.${ownerId}`,
    collection: `eq.${collection}`,
    id: `eq.${id}`
  });

  await requestSupabase(`${TABLE_NAME}?${params.toString()}`, {
    method: 'DELETE'
  });
}

export async function seedCloudCollection<T extends { id: string }>(collection: string, items: T[]) {
  const ownerId = getOwnerId();
  if (items.length === 0) {
    return;
  }

  await requestSupabase(`${TABLE_NAME}?on_conflict=owner_id,collection,id`, {
    method: 'POST',
    body: JSON.stringify(
      items.map((item) => ({
        owner_id: ownerId,
        collection,
        id: item.id,
        payload: item
      }))
    ),
    headers: {
      Prefer: 'resolution=merge-duplicates'
    }
  });
}
