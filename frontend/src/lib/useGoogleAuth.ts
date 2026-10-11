"use client";

import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

import { isSupabaseAuthConfigured, supabase } from "@/lib/supabase";

interface GoogleAuthState {
    user: User | null;
    loading: boolean;
    configured: boolean;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
}

/**
 * Maneja la sesión de Google del postulante mediante Supabase Auth.
 */
export function useGoogleAuth(): GoogleAuthState {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(isSupabaseAuthConfigured);

    useEffect(() => {
        if (!supabase) {
            return;
        }

        const client = supabase;
        let cancelado = false;

        client.auth
            .getSession()
            .then(({ data }) => {
                if (!cancelado) {
                    setUser(data.session?.user ?? null);
                    setLoading(false);
                }
            })
            .catch(() => {
                if (!cancelado) setLoading(false);
            });

        const { data: listener } = client.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ?? null);
                setLoading(false);
            },
        );

        return () => {
            cancelado = true;
            listener.subscription.unsubscribe();
        };
    }, []);

    const signIn = useCallback(async () => {
        if (!supabase) {
            return;
        }

        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                // Volvemos a la misma página tras autenticarse.
                redirectTo: `${window.location.origin}${window.location.pathname}`,
            },
        });
    }, []);

    const signOut = useCallback(async () => {
        if (!supabase) {
            return;
        }

        await supabase.auth.signOut();
        setUser(null);
    }, []);

    return {
        user,
        loading,
        configured: isSupabaseAuthConfigured,
        signIn,
        signOut,
    };
}
