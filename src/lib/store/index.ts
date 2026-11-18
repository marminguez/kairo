"use client";

import { useCallback, useEffect, useState } from "react";
import { createLocalStore } from "./local";
import { createSupabaseStore } from "./supabase";
import type { KairoData, KairoStore } from "./types";

let singleton: KairoStore | null = null;

/** Usa Supabase si hay variables configuradas; si no, el modo local de demo. */
export function getStore(): KairoStore {
  if (singleton) return singleton;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  singleton = url && key ? createSupabaseStore(url, key) : createLocalStore();
  return singleton;
}

export function useKairo() {
  const [data, setData] = useState<KairoData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const store = typeof window === "undefined" ? null : getStore();

  const refresh = useCallback(async () => {
    if (!store) return;
    try {
      setData(await store.load());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se han podido cargar los datos");
    }
  }, [store]);

  useEffect(() => {
    if (!store) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial desde un sistema externo
    void refresh();
    return store.subscribe(() => void refresh());
  }, [store, refresh]);

  return { data, error, store, refresh };
}

export type { KairoData, KairoStore } from "./types";
